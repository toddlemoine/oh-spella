const pingEpic = action$ =>
  action$.filter(action => action.type === "PING").mapTo({ type: "PONG" });

export default action$ =>
  action$
    .ofType("LETTERPRESS")
    .do(x => console.log("letterpress", x))
    .mapTo({ foo: "bar", type: "LETTERPRESS_COMPLETE" });
