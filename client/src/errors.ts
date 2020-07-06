export const errorNames = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  // RESPONSE_NOT_SUCCESSFUL: "Response not successful",
};

export const errorTypes = {
  USER_ALREADY_EXISTS: {
    message: "This user already exists",
    statusCode: 409,
  },
  COULD_NOT_FIND_BOOK: {
    message: "Could not find this particular book",
    statusCode: 404,
  },
  // RESPONSE_NOT_SUCCESSFUL: {
  //   message: "Something unexpected occurred",
  //   statusCode: 500,
  // },
};

export const getError = (error: string): string => {
  for (const [key, value] of Object.entries(errorTypes)) {
    if (key === error) {
      return value.message;
    }
  }
  return "Something unexpected occurred. Please try again later";
};
