import 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Error from './Error';
import registerServiceWorker from './registerServiceWorker';
import history from './history';
import routes from './routes';
import router from './router';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import appReducer from './reducers/appReducer';

const store = createStore(appReducer);

function renderApp(component) {
  ReactDOM.render(
    <Provider store={store}>
      <App>{ component }</App>
    </Provider>,
    document.getElementById('root'));
}

function handleRoute(location) {
  router.resolve(routes, location)
    .then(renderApp)
    .catch((error) => renderApp(<Error message={ error.message } />))
}

registerServiceWorker();
handleRoute(history.location);
history.listen(handleRoute);
