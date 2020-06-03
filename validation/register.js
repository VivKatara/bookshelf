const isEmpty = require("is-empty");
const Validator = require("validator");

module.exports = function validateRegisterInput(data) {
  const errors = {};

  data.email = data.email && !isEmpty(data.email) ? data.email : undefined;
  data.fullName =
    data.fullName && !isEmpty(data.fullName) ? data.fullName : undefined;
  data.password =
    data.password && !isEmpty(data.password) ? data.password : undefined;
  data.passwordConfirm =
    data.passwordConfirm && !isEmpty(data.passwordConfirm)
      ? data.passwordConfirm
      : undefined;

  if (isEmpty(data.email)) {
    errors.email = "Please enter an email";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (isEmpty(data.fullName)) {
    errors.fullName = "Please enter your full name";
  }

  if (isEmpty(data.password)) {
    errors.password = "Please enter a password";
  } else if (!Validator.isLength(data.password, { min: 8, max: undefined })) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (isEmpty(data.passwordConfirm)) {
    errors.passwordConfirm = "Please enter your password again to confirm it";
  } else if (!Validator.equals(data.password, data.passwordConfirm)) {
    errors.passwordConfirm = "Passwords don't match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
