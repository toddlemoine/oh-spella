import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Error from './Error';
import registerServiceWorker from './registerServiceWorker';
import history from './history';
import routes from './routes';
import router from './router';

function renderApp(component) {
  ReactDOM.render(
    <App>{ component }</App>,
    document.getElementById('root'));
}

function render(location) {
  router.resolve(routes, location)
    .then(renderApp)
    .catch((error) => renderApp(<Error message={ error.message } />))
}

registerServiceWorker();
render(history.location);
history.listen(render);
