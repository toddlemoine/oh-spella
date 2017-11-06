import { Observable, BehaviorSubject } from "rxjs/Rx";
import combineHandlers from "../util/combineHandlers";
import storage from "../storage";

const history = window.history;

const initialState = {
  cannedLists: []
};

function savedCannedLists(jsonLists) {
  const lists = Object.entries(jsonLists);
  return Promise.all(lists.map(([key, val]) => storage.setItem(key, val))).then(
    () => lists
  );
}

function fetchCannedLists() {
  return fetch("/words.json")
    .then(resp => resp.json())
    .then(savedCannedLists);
}

function handleCannedListClick(e) {
  window.location.href = `/game/${e.target.dataset.id}`;
}

const actionHandlers = combineHandlers([]);

export function initialize(node) {
  let _state = { ...initialState };

  const state$ = new BehaviorSubject(_state)
    //   const gameState$ = new BehaviorSubject(_state)
    .scan((acc, val) => ((_state = { ...acc, ...val }), _state))
    // .takeWhile(state => !roundIsFinished(state))
    .do(state => console.log("state", state));

  function clickOriginatesFromCannedList(e) {
    return (
      e.target.parentNode.id === "canned-lists" && e.target.nodeName === "LI"
    );
  }
  const cannedListClicks$ = Observable.fromEvent(node, "click")
    .filter(clickOriginatesFromCannedList)
    .do(handleCannedListClick);

  fetchCannedLists().then(cannedLists => state$.next({ cannedLists }));

  Observable.merge(cannedListClicks$)
    //     .mergeMap(action => actionHandlers(action, _state))
    .subscribe(state => state$.next(state));

  return state$;
}
