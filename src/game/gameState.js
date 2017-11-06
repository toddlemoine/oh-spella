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

const noop = () => null;

const initialState = {
  id: null,
  wordList: [],
  currentWord: "",
  userWord: "",
  complete: false,
  stats: []
};

function shuffleWordList(state, wordList) {
  state.wordList = shuffle(wordList);
  return state;
}

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
  updateLetterStats(text, state);
  updateCorrectnessStats(isValid, state);
  return Observable.of(text)
    .filter(text => isValid)
    .do(() => say(text))
    .mapTo({ userWord: attempt });
}

function validateComplete({ text }, state) {
  const complete = state.userWord + text === state.currentWord;
  updateCompleteStats(complete, state);
  if (complete) {
    return Observable.of(complete)
      .do(() => say(getCompletePhrase()))
      .mapTo({ complete });
  }
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
  const nextState = nextWord(resetState(state));
  return Observable.of(say(`Next word: Spell: ${nextState.currentWord}`)).mapTo(
    nextState
  );
}

function initialAnnouncement(_, state) {
  return Observable.of(say(`Ready? Spell: ${state.currentWord}`)).mapTo(state);
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
  console.log("roundIsFinished", isFinished);
  return isFinished;
}

function routeToStats(id) {
  console.log("routing to /stats/", id);
  window.location.href = `/stats/${id}`;
}

function initializeWords(action, state) {
  const _state = nextWord(
    resetState({
      ...initialState,
      wordList: shuffle(action.wordList)
    })
  );
  return Observable.of(_state);
}

function loadWordList(id) {
  return storage.getItem(id);
}

const actionHandlers = combineHandlers(
  ["load-word-list-success", initializeWords],
  ["letter", validateUserWord],
  ["letter", validateComplete],
  ["next-word", handleNextWord],
  ["repeat", repeatWord],
  ["initial-announcement", initialAnnouncement],
  ["skip", skipWord]
);

export function initialize(node, wordListId) {
  let _state = initialState;

  const gameState$ = new BehaviorSubject(_state)
    .scan((acc, val) => ((_state = { ...acc, ...val }), _state))
    .takeWhile(state => !roundIsFinished(state))
    .do(state => console.log("state", state));

  const loadWords$ = loadWordList(wordListId).then(wordList =>
    action("load-word-list-success", { wordList })
  );

  const spaceBarPress$ = Observable.fromEvent(document, "keypress")
    .filter(e => _state.complete && e.which === 32)
    .map(() => action("next-word"));

  const keypress$ = Observable.fromEvent(document, "keypress")
    .filter(e => !_state.complete && isValidKeyEvent(e))
    .pluck("key")
    .map(text => action("letter", { text }));

  const clicks$ = Observable.fromEvent(node, "click")
    .filter(e => /button/gi.test(e.target.nodeName))
    .map(e => action(e.target.id));

  Observable.merge(loadWords$, keypress$, spaceBarPress$, clicks$)
    .startWith(action("initial-announcement"))
    .mergeMap(action => actionHandlers(action, _state))
    .subscribe(state => gameState$.next(state));

  gameState$.subscribe({
    next: noop,
    error: noop,
    complete: () => {
      saveStats(_state).then(() => routeToStats(_state.id));
    }
  });

  return gameState$;
}