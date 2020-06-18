const isEmpty = require("is-empty");
const Validator = require("validator");

module.exports = function validateLoginInput(data) {
  const errors = {};
  const validatedData = {};

  validatedData.email =
    data.email && !isEmpty(data.email) ? data.email.trim() : undefined;
  validatedData.password =
    data.password && !isEmpty(data.password) ? data.password.trim() : undefined;

  if (isEmpty(validatedData.email)) {
    errors.email = "Email is not provided";
  } else if (!Validator.isEmail(validatedData.email)) {
    errors.email = "Invalid email address";
  }

  if (isEmpty(validatedData.password)) {
    errors.password = "Password is not provided";
  }

  return {
    errors,
    isValid: isEmpty(errors),
    validatedData,
  };
};
