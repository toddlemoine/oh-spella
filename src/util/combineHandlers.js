import { Observable } from "rxjs";
export default function combineHandlers(...handlers) {
  return function(action, state) {
    console.log("action:", action.type);
    return Observable.from(
      handlers
        .filter(([type, _]) => type === action.type)
        .map(([type, fn]) => fn(action, state))
    ).mergeAll();
  };
}
