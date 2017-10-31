import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";
import { say } from "./letters/speech";

const initialWordList = "big list web grip ball small".split(" ");

const initialState = {
  wordList: initialWordList,
  currentWord: "big",
  userWord: "",
  complete: false,
  stats: []
};

function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

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
  console.log("isValid", word.startsWith(guess));
  const isValid = word.startsWith(guess);
  return isValid;
}

function action(type, attrs) {
  return { type, ...attrs };
}

function validateUserWord({ text }, state) {
  console.log("validateUserWord", text, state);
  const attempt = state.userWord + text;
  const isValid = validGuess(attempt, state.currentWord);
  updateLetterStats(text, state);
  updateCorrectnessStats(isValid, state);
  const stream$ = Observable.of(say(text))
    .filter(text => isValid)
    .do(() => console.log(attempt, "is valid attempt; mapping to"))
    .mapTo({ userWord: attempt });
  return stream$;
}

function validateComplete({ text }, state) {
  console.log("validateComplete", text);
  const complete = state.userWord + text === state.currentWord;
  if (complete) say("complete");
  updateCompleteStats(complete, state);
  return Observable.of({ complete });
}

function combineHandlers(...handlers) {
  return function(action, state) {
    console.log("action:", action.type);
    const stream$ = Observable.from(
      handlers
        .filter(([type, _]) => type === action.type)
        .map(([type, fn]) => fn(action, state))
    ).mergeAll();
    return stream$;
  };
}

function repeatWord(action, state) {
  say(state.currentWord);
}

function nextWord(state) {
  const { wordList, stats } = state;
  const currentWord = wordList[stats.length];
  stats.push(createStats(currentWord));
  state.currentWord = currentWord;
  state.userWord = "";
  state.complete = false;
  return state;
}

function handleNextWord(_, state) {
  return Observable.of(nextWord(state));
}

function currentStat(stats) {
  return stats[stats.length - 1];
}

function updateLetterStats(letter, state) {
  const stat = currentStat(state.stats);
  stat.history.push(letter);
}

function updateCorrectnessStats(correct, state) {
  const stat = currentStat(state.stats);
  stat.correctHistory.push(correct);
}

function updateCompleteStats(complete, state) {
  const stat = currentStat(state.stats);
  if (complete) {
    stat.end = Date.now();
  }
}

function createStats(word) {
  return {
    word,
    history: [],
    correctHistory: [],
    start: Date.now(),
    end: null
  };
}

const actionHandlers = combineHandlers(
  ["letter", validateUserWord],
  ["letter", validateComplete],
  ["next-word", handleNextWord],
  ["repeat-word", repeatWord]
);

export function initialize(node) {
  console.log("initialize");

  let _state = nextWord(shuffleWordList({ ...initialState }));

  const gameState$ = new BehaviorSubject(_state)
    .scan((acc, val) => ((_state = { ...acc, ...val }), _state))
    .do(state => console.log("state", state));

  const keypress$ = Observable.fromEvent(document, "keypress")
    .filter(isValidKeyEvent)
    .do(e => console.log("pressed", e.key))
    .pluck("key")
    .map(text => action("letter", { text }));

  const clicks$ = Observable.fromEvent(node, "click")
    .filter(e => /button/gi.test(e.target.nodeName))
    .map(e => action(e.target.id));

  // keypress$ and clicks$ make up our flux-flow/event bus
  Observable.merge(keypress$, clicks$)
    .mergeMap(action => actionHandlers(action, _state))
    .subscribe(state => {
      console.log("state", state);
      gameState$.next(state);
    });

  return gameState$;
}
