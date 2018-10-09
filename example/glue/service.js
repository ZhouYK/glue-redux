import app from './model';

const register = data => app.users(data);
const service = {
  register,
};
export default service;
