import { Observable, BehaviorSubject } from "rxjs/Rx";
import combineHandlers from "../util/combineHandlers";
import { sessionStore } from "../storage";

sessionStore.setData("foo", "123");

const initialState = {
  cannedLists: [["foo", "bar"]]
};

function fetchCannedLists() {
  return fetch("/words.json").then(resp => resp.json());
}

const actionHandlers = combineHandlers([]);

export function initialize(node) {
  let _state = { ...initialState };

  const state$ = new BehaviorSubject(_state)
    //   const gameState$ = new BehaviorSubject(_state)
    .scan((acc, val) => ((_state = { ...acc, ...val }), _state))
    // .takeWhile(state => !roundIsFinished(state))
    .do(state => console.log("state", state));

  fetchCannedLists().then(cannedLists => state$.next({ cannedLists }));

  //   Observable.merge(fetchCannedLsts)
  //     .mergeMap(action => actionHandlers(action, _state))
  //     .subscribe(state => gameState$.next(state));

  return state$;
}
