import PT from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent, Fragment } from 'react';
import Sub from './Sub';
import subGlue from './Sub/glue';
import appGlue from './glue';

const sexes = ['男', '女', '中性', '薛定谔的猫'];
class Index extends PureComponent {
  static propTypes = {
    name: PT.string.isRequired,
    sex: PT.string.isRequired,
    height: PT.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleClick = (evt) => {
    const rn = Math.random();
    evt.preventDefault();
    // App
    appGlue.asyncGetName(this.ref.current.value);
    const index = Math.floor(rn * 4);
    appGlue.sex(sexes[index]);
    appGlue.height(100 + window.parseInt(rn * 10));
    // Sub;
    subGlue.asyncGetHeight({ height: 160 + window.parseInt(rn * 10) });
    const r = Math.random();
    const i = Math.floor(r * 4);
    subGlue.sex(sexes[i]);
  }

  render() {
    const { name, sex, height } = this.props;
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
        <h4>
        APP：
        </h4>
        your name is：
        {name}
        <div>
          app的身高：
          {height}
          cm
        </div>
        <div>
          app的性别：
          {sex}
        </div>
        <h4>
        SUB：
        </h4>
        <Sub />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { app } = state;
  const { name, sex, height } = app;
  return {
    name,
    sex,
    height,
  };
};

export default connect(mapStateToProps)(Index);
