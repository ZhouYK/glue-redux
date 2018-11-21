import React, { Component, Fragment } from 'react';
import { referToState, store } from '../store';
import model from '../glue/model';
// import test from '../glue/modelTest';

class UserList extends Component {
  constructor(props) {
    super(props);
    const data = referToState(model);
    // subscribe
    // here just setState on every dispatch
    store.subscribe(() => {
      this.setState({
        users: referToState(model.users),
      });
    });
    this.state = {
      ...data,
    };
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
    return (
      <Fragment>
        {list}
      </Fragment>
    );
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
// 你可以使用react-redux从store中获取数据
// const mapStateToProps = (state) => {
//  const { app } = state;
//  return {
//    ...app,
//  },
// };
// 可从props中获取到 const { users } = this.props;
// export default connect(mapStateToProps)(UserList);
