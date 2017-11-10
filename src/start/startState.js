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

async function saveList(key, list) {
  const lists = (await storage.getItem(SAVED_LIST_KEY)) || {};
  lists[key || uniqueId()] = list;
  return storage
    .setItem(SAVED_LIST_KEY, lists)
    .then(lists => Object.entries(lists));
}

async function removeItemFromList(listKey, id) {
  return await storage
    .getItem(listKey)
    .then(lists => {
      delete lists[id];
      return storage.setItem(listKey, lists);
    })
    .then(lists => Object.entries(lists));
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

  const removeSavedItem$ = Observable.fromEvent(
    node.querySelector("#saved-lists"),
    "click"
  )
    .filter(e => e.target.dataset.action === "remove")
    .mergeMap(e => removeItemFromList("saved", e.target.dataset.id))
    .do(saved => {
      console.log("???", saved);
    })
    .map(savedLists => ({ savedLists }));

  Promise.all([
    fetchCannedLists(),
    fetchSavedLists()
  ]).then(([cannedLists, savedLists]) => {
    state$.next({ cannedLists, savedLists });
  });

  Observable.merge(saveList$, removeSavedItem$).subscribe(state =>
    state$.next(state)
  );

  return state$;
}
