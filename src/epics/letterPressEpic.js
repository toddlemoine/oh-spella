import { speak } from "../letters/speech";
export default action$ =>
  action$
    .ofType("LETTERPRESS")
    .mergeMap($action => speak($action.letter))
    .map(
      text => (console.log("complete", text), { type: "SPEECH_COMPLETE", text })
    );
