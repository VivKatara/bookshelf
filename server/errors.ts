export const errorNames = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  COULD_NOT_FIND_BOOK: "COULD_NOT_FIND_BOOK",
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
};
