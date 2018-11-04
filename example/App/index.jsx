import React, { Component } from 'react';
import { service } from '../glue';
import List from './UserList';
import './style.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      profession: '',
      pet: '',
    };
  }

  handleOnChange = key => (e) => {
    this.setState({
      [key]: e.target.value,
    });
  }

  handleAdd = (e) => {
    e.preventDefault();
    const { name, profession, pet } = this.state;
    let str;
    if (!name) {
      str = '请输入名字[name]';
    } else if (!profession) {
      str = '请输入职业[profession]';
    } else if (!pet) {
      str = '请输入喜欢的宠物[pet]';
    }
    if (str) {
      return window.alert(str);
    }
    const returnData = service.register({
      name,
      profession,
      pet,
    });
    return returnData;
  }

  render() {
    const { name, profession, pet } = this.state;
    return (
      <div className="app">
        <section>
          <div className="row">
            <label htmlFor="name">
              姓名：
              <input value={name} onChange={this.handleOnChange('name')} type="text" id="name" placeholder="请输入姓名" />
            </label>
          </div>
          <div className="row">
            <label htmlFor="profession">
              职业：
              <input value={profession} onChange={this.handleOnChange('profession')} type="text" id="profession" placeholder="请输入职业" />
            </label>
          </div>
          <div className="row">
            <label htmlFor="pet">
              喜欢的宠物：
              <input value={pet} onChange={this.handleOnChange('pet')} type="text" id="pet" placeholder="请输入你喜欢的宠物" />
            </label>
          </div>
          <div className="row">
            <button type="button" onClick={this.handleAdd}>
              添加
            </button>
          </div>
        </section>
        <List />
      </div>
    );
  }
}

export default App;
