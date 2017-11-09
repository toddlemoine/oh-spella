import { Observable, BehaviorSubject } from "rxjs/Rx";
import combineHandlers from "../util/combineHandlers";
import storage from "../storage";
import uniqueId from "../util/uniqueId";

const history = window.history;

const initialState = {
  cannedLists: []
};

function getSavedListKey(key) {
  return key || uniqueId();
}

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

async function saveList(key, list) {
  console.log("saving", key, list);
  if (!key) return;
  const lists = (await storage.getItem("savedLists")) || {};
  lists[key || uniqueId()] = list;
  return storage.setItem("savedLists", lists);
}

// const actionHandlers = combineHandlers([]);

function clickOriginatesFromCannedList(e) {
  return (
    e.target.parentNode.id === "canned-lists" && e.target.nodeName === "LI"
  );
}

export function initialize(node) {
  const saveList$ = new BehaviorSubject()
    .filter(keyListPair => Boolean(keyListPair))
    .switchMap(([key, list]) => saveList(key, list))
    .map(savedLists => ({ savedLists }));

  let _state = {
    ...initialState,
    onSave: (key, list) => {
      saveList$.next([key, list]);
    }
  };

  const state$ = new BehaviorSubject(_state)
    .scan((acc, val) => ((_state = { ...acc, ...val }), _state))
    .do(state => console.log("state", state));

  const cannedListClicks$ = Observable.fromEvent(node, "click")
    .filter(clickOriginatesFromCannedList)
    .do(handleCannedListClick);

  fetchCannedLists().then(cannedLists => state$.next({ cannedLists }));

  Observable.merge(cannedListClicks$, saveList$).subscribe(state =>
    state$.next(state)
  );

  return state$;
}
