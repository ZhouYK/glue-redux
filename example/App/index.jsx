import React, { Component } from 'react';
import List from './UserList/index';
import appModel from '../models/app/model';
import './style.less';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      profession: '',
      pet: '',
      country: '',
    };
  }

  handleOnChange = key => (e) => {
    this.setState({
      [key]: e.target.value,
    });
  }

  addCountry = () => {
    const { country } = this.state;
    appModel.country(country);
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
    const returnData = appModel.users({
      name,
      profession,
      pet,
    });
    return returnData;
  }

  render() {
    const {
      name, profession, pet, country,
    } = this.state;
    return (
      <div className="app">
        <div className="row">
          <label htmlFor="country">
            国家：
            <input value={country} onChange={this.handleOnChange('country')} type="text" id="country" placeholder="请输入国家" />
          </label>
          <button onClick={this.addCountry} type="button">
            修改
          </button>
        </div>
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
