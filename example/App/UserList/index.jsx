import React, { Component, Fragment } from 'react';
import { referToState, store, wholeModel } from '../../store';
// import test from '../glue/modelTest';

class Index extends Component {
  constructor(props) {
    super(props);
    const data = referToState(wholeModel.model.app);
    // subscribe
    // here just setState on every dispatch
    store.subscribe(() => {
      this.setState({
        users: referToState(wholeModel.model.app.users),
        country: referToState(wholeModel.model.app.country),
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
        <h4>
          {this.state.country}
        </h4>
        { this.renderUsers() }
      </section>
    );
  }
}

export default Index;
// 你可以使用react-redux从store中获取数据
// const mapStateToProps = (state) => {
//  const { app } = state;
//  return {
//    ...app,
//  },
// };
// 可从props中获取到 const { users } = this.props;
// export default connect(mapStateToProps)(UserList);
