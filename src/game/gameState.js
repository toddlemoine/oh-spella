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

const initialState = {
  id: null,
  wordList: [],
  currentWord: "",
  userWord: "",
  complete: false,
  finished: false,
  stats: []
};

function isValidKeyEvent(e) {
  const A_CHARCODE = 97;
  const Z_CHARCODE = 122;
  return e.which >= A_CHARCODE && e.which <= Z_CHARCODE;
}

function validGuess(guess, word) {
  const isValid = word.startsWith(guess);
  return isValid;
}

function action(type, attrs) {
  return { type, ...attrs };
}

function getCompletePhrase() {
  const phrases = `That's great!;Well done!;Keep going!;Excellent!`.split(";");
  const randomNumber = Math.floor(Math.random() * (phrases.length - 1));
  return phrases[randomNumber];
}

function validateUserWord({ text }, state) {
  const attempt = state.userWord + text;
  const isValid = validGuess(attempt, state.currentWord);
  const userWord = isValid ? attempt : state.userWord;
  updateLetterStats(text, state);
  updateCorrectnessStats(isValid, state);

  const complete = attempt === state.currentWord;
  updateCompleteStats(complete, state);

  const response = Observable.of({ ...state, userWord, complete });

  response.subscribe(state => {
    if (isValid) say(text);
  });

  return response;
}

function validateComplete({ text }, state) {
  const complete = state.userWord + text === state.currentWord;
  updateCompleteStats(complete, state);
  return Observable.of({ complete });
}

function repeatWord(action, state) {
  say(state.currentWord);
  return Observable.of(state);
}

function resetState(state) {
  return { ...state, id: uniqueId(), userWord: "", complete: false };
}

function nextWord(state) {
  const { wordList, stats } = state;
  const currentWord = wordList[stats.length];
  state.currentWord = currentWord;
  stats.push(createStats(currentWord));
  return state;
}

function handleNextWord(_, state) {
  console.log("handleNextWord");
  const nextState = nextWord(resetState(state));
  const response = Observable.of(nextState);
  response.subscribe(({ currentWord }) => say(`Spell: ${currentWord}`));
  return response;
}

function initialAnnouncement(action, state) {
  return Observable.of(say(`Get ready!`)).mapTo(state);
}

function usedAllWords({ stats, wordList }) {
  return stats.length === wordList.length;
}

function skipWord(_, state) {
  updateSkipStats(state);
  return usedAllWords(state)
    ? Observable.of({ complete: true })
    : handleNextWord(_, state);
}

function saveStats(state) {
  return storage.setItem(state.id, state.stats);
}

function roundIsFinished(state) {
  const { stats, wordList } = state;
  const last = stats[stats.length - 1];
  const isFinished = state.complete && usedAllWords(state) && last.end !== null;
  return isFinished;
}

function initializeWords(action, state) {
  return handleNextWord(null, { ...state, wordList: shuffle(action.wordList) });
}

function loadWordList(listParam) {
  const [namespace, listId] = listParam.split(":");
  return storage.getItem(namespace).then(lists => {
    return lists[listId];
  });
}

const actionHandlers = combineHandlers(
  ["load-word-list-success", initializeWords],
  ["initial-announcement", initialAnnouncement],
  ["letter", validateUserWord],
  ["next-word", handleNextWord],
  ["repeat", repeatWord],
  ["skip", skipWord]
);

function checkIfRoundIsFinished(state) {
  state.finished = roundIsFinished(state);
  return state;
}

export function initialize(node, wordListId) {
  const gameState$ = new BehaviorSubject(initialState)
    .scan((acc, val) => ({ ...acc, ...val }))
    .do(state => console.log("state", state));

  const loadWords$ = Observable.fromPromise(
    loadWordList(wordListId)
  ).map(wordList => action("load-word-list-success", { wordList }));

  const spaceBarPress$ = Observable.fromEvent(document, "keypress")
    .withLatestFrom(gameState$)
    .filter(([e, state]) => state.complete && e.which === 32)
    .map(() => action("next-word"));

  const keypress$ = Observable.fromEvent(document, "keypress")
    .withLatestFrom(gameState$)
    .filter(([e, state]) => !state.complete && isValidKeyEvent(e))
    .map(([e, state]) => action("letter", { text: e.key }));

  const clicks$ = Observable.fromEvent(node, "click")
    .filter(e => /button/gi.test(e.target.nodeName))
    .pluck("target", "id")
    .map(action);

  const actionStream = Observable.merge(
    loadWords$,
    keypress$,
    spaceBarPress$,
    clicks$
  )
    .startWith(action("initial-announcement"))
    .withLatestFrom(gameState$)
    .concatMap(([action, state]) => actionHandlers(action, state))
    .concatMap(state => {
      console.log("complete check", state);
      if (state.complete) {
        console.log("is complete. delay?");
        return handleNextWord(null, state).delay(3000);
      } else {
        return Observable.of(state);
      }
    })
    .map(checkIfRoundIsFinished)
    .multicast(gameState$)
    .refCount();

  actionStream.subscribe();
  return gameState$;
}
