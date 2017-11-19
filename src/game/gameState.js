import { Observable, BehaviorSubject } from "rxjs/Rx";
import { say } from "../speech";
import shuffle from "../util/shuffle";
import combineHandlers from "../util/combineHandlers";
import uniqueId from "../util/uniqueId";
import storage from "../storage";
import {
  updateLetterStats,
  updateCompleteStats,
  updateCorrectnessStats,
  updateSkipStats,
  createStats
} from "./stats";
import { Subject } from "rxjs/Subject";

const [COMPLETE, SKIPPED, MISSED] = [1, 2, 3];

const initialState = {
  id: null,
  currentWord: "",
  userWord: "",
  wordList: [],
  word: {
    result: null, // complete, skipped, missed
    correctHistory: []
  },
  stats: []
};

function isValidKeyEvent(e) {
  const A_CHARCODE = 97;
  const Z_CHARCODE = 122;
  return e.which >= A_CHARCODE && e.which <= Z_CHARCODE;
}

function loadWordList(listParam) {
  const [namespace, listId] = listParam.split(":");
  return storage.getItem(namespace).then(lists => {
    return lists[listId];
  });
}

export function initialize(node, wordListId) {
  const startSpeech$ = Observable.fromPromise(say("Get ready!"));

  const gameState$ = new BehaviorSubject(initialState);

  // Load words and set on state
  Observable.fromPromise(loadWordList(wordListId))
    .map(shuffle)
    .subscribe(wordList => {
      const currentWord = wordList.pop();
      gameState$.next({ wordList, currentWord });
    });

  // Supporting streams
  const letterPress$ = Observable.fromEvent(document, "keypress")
    .filter(isValidKeyEvent)
    .pluck("key");

  const round$ = gameState$
    .skip(1)
    // .takeWhile(state => state.wordList.length)
    .distinctUntilKeyChanged("currentWord")
    .do(({ currentWord }) => say(`Spell: ${currentWord}`))
    .switchMap(state => {
      console.log("-------------- switchMap -----", state.currentWord);
      const wordToSpell = state.currentWord;

      const attempt$ = letterPress$
        .scan((userWord, key) => {
          const attempt = userWord + key;
          return wordToSpell.startsWith(attempt) ? attempt : userWord;
        })
        .do(x => console.log("attempt", x));

      // userWord state
      const userWord$ = attempt$.distinct().map(userWord => ({ userWord }));
      userWord$.subscribe(({ userWord }) => say(userWord.substr(-1)));

      // Complete state
      const complete$ = attempt$
        .filter(userWord => userWord === wordToSpell)
        .mapTo(true);

      complete$.subscribe(() => {
        say("correct");
      });

      // correctHistory state
      const correctHistory$ = letterPress$
        .withLatestFrom(userWord$)
        .map(([key, { userWord }]) => userWord.endsWith(key))
        .scan(
          (history, successOrFailure) => history.concat(successOrFailure),
          []
        )
        .map(history => ({ history }));

      const merged = Observable.merge(userWord$, correctHistory$)
        .takeUntil(complete$)
        .scan((acc, curr) => ({ ...acc, ...curr }), state);

      merged.subscribe({
        complete: () => {
          console.log("merged complete, unsubscribing");
          const currentWord = state.wordList.pop();
          console.log("next word", currentWord, state.wordList);
          const nextState = {
            wordList: state.wordList,
            currentWord,
            complete: false,
            history: [],
            userWord: ""
          };

          Observable.of(nextState)
            .delay(3000)
            .subscribe(nextState => gameState$.next(nextState));
        }
      });

      return merged;
    });

  round$.subscribe({
    next: state => gameState$.next(state),
    complete: () => {
      console.log("Round complete");
    }
  });

  return gameState$;
}
