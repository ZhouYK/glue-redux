import PT from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent, Fragment } from 'react';
import appGlue from '../glue';

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
    // 直接从对应的glue对象调用action
    appGlue.getName(this.ref.current.value);
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
  const { app } = state;
  const { name } = app;
  return {
    name,
  };
};

export default connect(mapStateToProps)(App);
