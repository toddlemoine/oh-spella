import { Observable, BehaviorSubject } from "rxjs/Rx";
import combineHandlers from "../util/combineHandlers";
import storage from "../storage";
import uniqueId from "../util/uniqueId";

const history = window.history;
const SAVED_LIST_KEY = "saved";
const CANNED_LIST_KEY = "canned";

const initialState = {
  cannedLists: [],
  savedLists: []
};

function getSavedListKey(key) {
  return key || uniqueId();
}

function fetchCannedLists() {
  return storage.getItem(CANNED_LIST_KEY).then(lists => {
    if (!lists) {
      return fetch("/words.json")
        .then(resp => storage.setItem(CANNED_LIST_KEY, resp.json()))
        .then(lists => Object.entries(lists));
    }
    return Object.entries(lists);
  });
}

function fetchSavedLists() {
  return storage
    .getItem(SAVED_LIST_KEY)
    .then(lists => Object.entries(lists || {}));
}

function handleListClick(namespace, id) {
  window.location.href = `/game/${namespace}:${id}`;
}

async function saveList(key, list) {
  const lists = (await storage.getItem(SAVED_LIST_KEY)) || {};
  lists[key || uniqueId()] = list;
  return storage
    .setItem(SAVED_LIST_KEY, lists)
    .then(lists => Object.entries(lists));
}

function clickOriginatesFromCannedList(e) {
  return (
    e.target.parentNode.id === "canned-lists" && e.target.nodeName === "LI"
  );
}

function clickOriginatesFromSavedList(e) {
  return e.target.parentNode.id === "saved-lists" && e.target.nodeName === "LI";
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
    .pluck("target", "dataset", "id")
    .do(id => handleListClick(CANNED_LIST_KEY, id));

  const savedListClicks$ = Observable.fromEvent(node, "click")
    .filter(clickOriginatesFromSavedList)
    .pluck("target", "dataset", "id")
    .do(id => handleListClick(SAVED_LIST_KEY, id));

  Promise.all([
    fetchCannedLists(),
    fetchSavedLists()
  ]).then(([cannedLists, savedLists]) => {
    state$.next({ cannedLists, savedLists });
  });

  Observable.merge(
    cannedListClicks$,
    savedListClicks$,
    saveList$
  ).subscribe(state => state$.next(state));

  return state$;
}
