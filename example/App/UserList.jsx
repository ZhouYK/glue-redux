import React, { Component } from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { referToState } from '../configStore';
import model from '../glue/model';

const mapStateToProps = (state) => {
  const { app: { users } } = state;
  return {
    users,
  };
};

class UserList extends Component {
  static propTypes = {
    users: pt.array.isRequired,
  }

  renderUsers = () => {
    const { users } = this.props;
    if (Object.is(users.length, 0)) {
      return (
        <section>
          no users
        </section>
      );
    }
    const list = users.map((user, index) => (
      /* eslint-disable react/no-array-index-key */
      <section
        key={index}
      >
        <div className="row">
          <h4>
            user
            {' '}
            {index}
            :
          </h4>
          <p>
            name:
            {user.name}
          </p>
          <p>
            profession：
            {user.profession}
          </p>
          <p>
            pet:
            {user.pet}
          </p>
        </div>
      </section>
    ));
    return list;
  }

  render() {
    console.log('获取的数据结构为：', referToState(model));
    return (
      <section>
        { this.renderUsers() }
      </section>
    );
  }
}

export default connect(mapStateToProps)(UserList);
