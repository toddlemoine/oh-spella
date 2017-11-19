import "rxjs";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// service worker
// import registerServiceWorker from "./registerServiceWorker";
// routing
import history from "./history";
import routes from "./routes";
import router from "./router";
// our app components
import store from "./stores";
import App from "./App";
import Error from "./Error";
import "./index.css";

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

// registerServiceWorker();
handleRoute(history.location);
history.listen(handleRoute);
