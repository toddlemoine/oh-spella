import { Observable } from "rxjs/Rx";
import storage from "../storage";

function isValidKey(key) {
  return /\w/gi.test(key);
}

function loadWords(listParam) {
  const [namespace, listId] = listParam.split(":");
  return storage.getItem(namespace).then(lists => {
    return lists[listId];
  });
}

export function initialize(action$) {
  return action$
    .ofType("INITIALIZE")
    .pluck("wordSetId")
    .switchMap(id => Observable.fromPromise(loadWords(id)))
    .map(words => {
      const currentWord = words.pop();
      return { type: "INITIALIZE_COMPLETE", words, currentWord };
    });
}

export function letterPress(action$) {
  return action$
    .do(x => console.log("epic..."))
    .ofType("LETTERPRESS")
    .filter(({ key }) => isValidKey(key))
    .map(({ key, currentWord, userWord }) => {
      const newState = {};
      const attempt = userWord + key;
      if (currentWord.startsWith(attempt)) {
        newState.userWord = attempt;
      }
      if (attempt === currentWord) {
        newState.complete = true;
      }
      return { type: "LETTERPRESS_COMPLETE", _state: newState };
    });
}
