import { createEpicMiddleware, combineEpics } from "redux-observable";
import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers";
import * as rootEpic from "../epics";

const epics = combineEpics(...Object.keys(rootEpic).map(key => rootEpic[key]));
const epicMiddleware = createEpicMiddleware(epics);

export default createStore(reducers, applyMiddleware(epicMiddleware));
