import React, { Component, Fragment } from 'react';
import { referToState, hasModel } from '../configStore';
import model from '../glue/model';
import wholeModel from '../model';

class UserList extends Component {
  constructor(props) {
    super(props);
    const data = referToState(model);
    const wholeUsers = referToState(wholeModel.users);
    const wholeState = referToState(wholeModel);
    this.state = {
      ...data,
      wholeUsers,
      wholeState,
    };
  }

  componentDidMount() {
    // 由于没有监听store变化的钩子，用轮询模拟
    // 针对react的钩子，有另外一个库 react-glue-redux
    setInterval(() => {
      const data = referToState(model);
      console.log('引用model：', hasModel(model));
      const wholeUsers = referToState(wholeModel.users);
      console.log('引用wholeModel.users：', hasModel(wholeModel.users));
      const wholeState = referToState(wholeModel);
      console.log('引用wholeModel：', hasModel(wholeModel));
      console.log('未知的引用返回值：', referToState({}));
      this.setState({ ...data, wholeUsers, wholeState });
    }, 1000);
  }

  renderUsers = () => {
    const { users, wholeUsers, wholeState } = this.state;
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
    const wholeList = wholeUsers.map((user, index) => (
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
    console.log(wholeState);
    return (
      <Fragment>
        {list}
        {wholeList}
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
