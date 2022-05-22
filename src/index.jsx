import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import moviesApp from './reducers/reducers';

import { MainView } from './components/main-view/main-view';
import './index.scss';

const store = createStore(moviesApp);

class MyFlixApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

const container = document.getElementsByClassName('app-container')[0];

ReactDOM.render(React.createElement(MyFlixApplication), container);
