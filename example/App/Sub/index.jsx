import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

const Sub = (props) => {
  const { height, name, sex } = props;
  return (
    <div>
      <h4>
        {name}
        的档案：
      </h4>
      <div>
        sub的身高：
        <span>
          {height}
          cm
        </span>
      </div>
      <div>
        sub的性别：
        <span>
          {sex}
        </span>
      </div>
    </div>
  );
};
Sub.propTypes = {
  height: PT.number.isRequired,
  name: PT.string.isRequired,
  sex: PT.string.isRequired,
};

const mapStateToProps = (state) => {
  const { app } = state;
  const { sub, name } = app;
  const { height, sex } = sub;
  return {
    height,
    name,
    sex,
  };
};
export default connect(mapStateToProps)(Sub);
