import "rxjs";
import React from "react";
import ReactDOM from "react-dom";
// service worker
import registerServiceWorker from "./registerServiceWorker";
// routing
import history from "./history";
import routes from "./routes";
import router from "./router";
// redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import lettersReducer, {
  lettersEpic,
  wordSpelledCorrectlyEpic
} from "./letters";
// our app components
import App from "./App";
import Error from "./Error";
import "./index.css";

const epicMiddleware = createEpicMiddleware(
  lettersEpic,
  wordSpelledCorrectlyEpic
);

const store = createStore(lettersReducer, applyMiddleware(epicMiddleware));

function renderApp(component) {
  ReactDOM.render(
    <Provider store={store}>
      <App>{component}</App>
    </Provider>,
    document.getElementById("root")
  );
}

function handleRoute(location) {
  router
    .resolve(routes, location)
    .then(renderApp)
    .catch(error => renderApp(<Error message={error.message} />));
}

registerServiceWorker();
handleRoute(history.location);
history.listen(handleRoute);
