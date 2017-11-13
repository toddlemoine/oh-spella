import { Observable } from "rxjs";

export default function combineHandlers(...handlers) {
  return function(action, state) {
    // handlers return observables, so we are returning
    // a higher-order obsevable here.
    return Observable.from(
      handlers
        .filter(([type, _]) => type === action.type)
        .map(([type, fn]) => fn(action, state))
    ).mergeAll();
  };
}
