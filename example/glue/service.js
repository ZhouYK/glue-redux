import app from './model';

const register = (data) => {
  console.log(`the action type is ${app.users.actionType}`);
  app.users(data);
};
const service = {
  register,
};
export default service;
