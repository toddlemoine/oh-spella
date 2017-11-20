import { createEpicMiddleware, combineEpics } from "redux-observable";
import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers";
// import * as rootEpic from "../epics";
import { initialize, letterPress } from "../epics";

// const epics = Object.keys(rootEpic).map(key => rootEpic[key]);
const epics = combineEpics(initialize, letterPress);
const epicMiddleware = createEpicMiddleware(epics);

export default createStore(reducers, applyMiddleware(epicMiddleware));
