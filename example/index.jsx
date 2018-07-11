import React, { PureComponent, Fragment } from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import PT from 'prop-types';

import appGlue from './glue';
import { destruct } from '../src';

const store = createStore(() => {});
const { dispatch } = store;
// 处理
const { reducers, actions } = destruct({ dispatch })({ app: appGlue });
store.replaceReducer(combineReducers(reducers));

const root = document.getElementById('bd');

const { app: appAction } = actions;
class App extends PureComponent {
  static propTypes = {
    name: PT.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleClick = (evt) => {
    evt.preventDefault();
    appAction.name(this.ref.current.value);
  }

  render() {
    return (
      <Fragment>
        <form action="/" method="get">
          <label htmlFor="name">
            输入名字：
            <input ref={this.ref} type="text" id="name" />
          </label>
          <button type="button" onClick={this.handleClick}>
              提交
          </button>
        </form>
        输入的名字为：
        { this.props.name }
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('默认值：', state);
  const { app } = state;
  const { name } = app;
  return {
    name,
  };
};

const WrappedApp = connect(mapStateToProps)(App);

WrappedApp.displayName = 'App';

render(
  <Provider store={store}>
    <WrappedApp />
  </Provider>, root,
);
