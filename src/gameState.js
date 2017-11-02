import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";
import { say } from "./letters/speech";
import localforage from "localforage";
import shuffle from "./util/shuffle";
import combineHandlers from "./util/combineHandlers";
import {
  currentStat,
  updateLetterStats,
  updateCompleteStats,
  updateCorrectnessStats,
  updateSkipStats,
  createStats
} from "./stats/index";

const initialWordList = "big list small".split(" ");

const initialState = {
  id: "foo",
  wordList: initialWordList,
  currentWord: "",
  userWord: "",
  complete: false,
  stats: []
};

function shuffleWordList(state) {
  state.wordList = shuffle(state.wordList);
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

function validateUserWord({ text }, state) {
  const attempt = state.userWord + text;
  const isValid = validGuess(attempt, state.currentWord);
  updateLetterStats(text, state);
  updateCorrectnessStats(isValid, state);
  return Observable.of(say(text))
    .filter(text => isValid)
    .mapTo({ userWord: attempt });
}

function validateComplete({ text }, state) {
  const complete = state.userWord + text === state.currentWord;
  if (complete) say("complete");
  updateCompleteStats(complete, state);
  return Observable.of({ complete });
}

function repeatWord(action, state) {
  say(state.currentWord);
  return Observable.of(state);
}

function resetState(state) {
  return { ...state, userWord: "", complete: false };
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

function skipWord(_, state) {
  updateSkipStats(state);
  return handleNextWord(_, state);
}

function saveStats(state) {
  return localforage.setItem(state.id, state.stats);
}

function roundIsFinished(state) {
  const { stats, wordList } = state;
  const last = stats[stats.length - 1];
  const isFinished =
    state.complete && stats.length === wordList.length && last.end !== null;
  console.log("roundIsFinished", isFinished);
  return isFinished;
}

function routeToStats(id) {
  console.log("routing to /stats/", id);
}

const actionHandlers = combineHandlers(
  ["letter", validateUserWord],
  ["letter", validateComplete],
  ["next-word", handleNextWord],
  ["repeat", repeatWord],
  ["initial-announcement", initialAnnouncement],
  ["skip", skipWord]
);

export function initialize(node) {
  let _state = nextWord(shuffleWordList(resetState({ ...initialState })));

  const gameState$ = new BehaviorSubject(_state)
    .scan((acc, val) => ((_state = { ...acc, ...val }), _state))
    .takeWhile(state => !roundIsFinished(state))
    .do(state => console.log("state", state));

  const initialAnnouncement$ = Observable.of(action("initial-announcement"));

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

  Observable.merge(initialAnnouncement$, keypress$, spaceBarPress$, clicks$)
    .mergeMap(action => actionHandlers(action, _state))
    .subscribe(state => gameState$.next(state));

  const noop = () => null;
  gameState$.subscribe({
    next: noop,
    error: noop,
    complete: () => {
      saveStats(_state).then(() => routeToStats(_state.id));
    }
  });

  return gameState$;
}
