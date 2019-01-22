const validateInOperator = (key, target) => {
  let flag;
  try {
    /* eslint-disable */
    flag = key in target;
  } catch (e) {
    flag = false;
  }
  return flag;
};
export default validateInOperator;
