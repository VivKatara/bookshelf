const isEmpty = require("is-empty");
const Validator = require("validator");

module.exports = function validateLoginInput(data) {
  const errors = {};

  data.email = data.email && !isEmpty(data.email) ? data.email : undefined;
  data.password =
    data.password && !isEmpty(data.password) ? data.password : undefined;

  if (isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
