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

  console.log('handleNextWord')
  const nextState = nextWord(resetState(state));
  return Observable.of(say(`Spell: ${nextState.currentWord}`)).mapTo(nextState);
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

function routeToStats(id) {
  window.location.href = `/stats/${id}`;
}

function initializeWords(action, state) {
  console.log('initialize words')
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
  ["letter", validateComplete],
  ["next-word", handleNextWord],
  ["repeat", repeatWord],
  ["skip", skipWord]
);

export function initialize(node, wordListId) {

  const gameState$ = new BehaviorSubject(initialState)
    .scan((acc, val) => ({ ...acc, ...val }))
    .takeWhile(state => !roundIsFinished(state))
    .do(state => console.log("state", state));

  const loadWords$ = Observable.fromPromise(
    loadWordList(wordListId).then(wordList => action("load-word-list-success", { wordList }))
  );

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
    .map(e => action(e.target.id));

  const mergedStreams = Observable.merge(loadWords$, keypress$, spaceBarPress$, clicks$)
    .startWith(action("initial-announcement"))
    .withLatestFrom(gameState$)
    .mergeMap(([action, state]) => actionHandlers(action, state))
    .multicast(gameState$)
    .refCount();

  // mergedStreams.subscribe({
  //   complete: (...args) => {
  //     console.log('complete args', args)
  //     // saveStats(state).then(() => routeToStats(state.id));
  //   }
  // });

  return mergedStreams;
}
