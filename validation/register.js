const isEmpty = require("is-empty");
const Validator = require("validator");

module.exports = function validateRegisterInput(data) {
  const errors = {};
  const validatedData = {};

  validatedData.email =
    data.email && !isEmpty(data.email) ? data.email.trim() : undefined;
  validatedData.fullName =
    data.fullName && !isEmpty(data.fullName) ? data.fullName.trim() : undefined;
  validatedData.password =
    data.password && !isEmpty(data.password) ? data.password.trim() : undefined;
  validatedData.passwordConfirm =
    data.passwordConfirm && !isEmpty(data.passwordConfirm)
      ? data.passwordConfirm.trim()
      : undefined;

  if (isEmpty(validatedData.email)) {
    errors.email = "Please enter an email";
  } else if (!Validator.isEmail(validatedData.email)) {
    errors.email = "Please enter a valid email";
  }

  if (isEmpty(validatedData.fullName)) {
    errors.fullName = "Please enter your full name";
  }

  if (isEmpty(validatedData.password)) {
    errors.password = "Please enter a password";
  } else if (
    !Validator.isLength(validatedData.password, { min: 8, max: undefined })
  ) {
    errors.password = "Password must be at least 8 characters long";
  }

  if (isEmpty(validatedData.passwordConfirm)) {
    errors.passwordConfirm = "Please enter your password again to confirm it";
  } else if (
    !Validator.equals(validatedData.password, validatedData.passwordConfirm)
  ) {
    errors.passwordConfirm = "Passwords don't match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
    validatedData,
  };
};
