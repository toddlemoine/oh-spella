import "rxjs";
import React from "react";
import ReactDOM from "react-dom";
// service worker
import registerServiceWorker from "./registerServiceWorker";
// routing
import history from "./history";
import routes from "./routes";
import router from "./router";
// our app components
import App from "./App";
import Error from "./Error";
import "./index.css";

function renderApp(component) {
  ReactDOM.render(<App>{component}</App>, document.getElementById("root"));
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
