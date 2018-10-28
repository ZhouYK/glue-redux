import React, { Component } from 'react';
import { referToState } from '../configStore';
import model from '../glue/model';

class UserList extends Component {
  constructor(props) {
    super(props);
    const data = referToState(model);
    this.state = {
      ...data,
    };
  }

  componentDidMount() {
    // 由于没有监听store变化的钩子，用轮询模拟
    // 针对react的钩子，有另外一个库 react-glue-redux
    setInterval(() => {
      this.setState(referToState(model));
    }, 500);
  }

  renderUsers = () => {
    const { users } = this.state;
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
    return (
      <section>
        { this.renderUsers() }
      </section>
    );
  }
}

export default UserList;
