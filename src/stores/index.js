import { createEpicMiddleware } from "redux-observable";
import { createStore, applyMiddleware } from "redux";
import reducers from "../reducers";
import rootEpic from "../epics";

const epicMiddleware = createEpicMiddleware(rootEpic);

export default createStore(reducers, applyMiddleware(epicMiddleware));
