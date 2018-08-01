import PT from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent, Fragment } from 'react';
import appGlue from './glue';

class Index extends PureComponent {
  static propTypes = {
    name: PT.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleClick = (evt) => {
    evt.preventDefault();
    appGlue.getName(this.ref.current.value);
  }

  render() {
    return (
      <Fragment>
        <form action="/" method="get">
          <label htmlFor="name">
            Input your name：
            <input ref={this.ref} type="text" id="name" />
          </label>
          <button type="button" onClick={this.handleClick}>
            Submit
          </button>
        </form>
        your name is：
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

export default connect(mapStateToProps)(Index);
