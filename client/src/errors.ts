export const errorNames = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  COULD_NOT_FIND_BOOK: "COULD_NOT_FIND_BOOK",
  SOMETHING_UNEXPECTED_OCCURRED: "SOMETHING_UNEXPECTED_OCCURRED",
  MAIN_DISPLAY_FULL: "MAIN_DISPLAY_FULL",
  NO_BOOKS_TO_TAKE_AWAY: "NO_BOOKS_TO_TAKE_AWAY",
  COULD_NOT_DELETE_BOOK: "COULD_NOT_DELETE_BOOK",
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
  SOMETHING_UNEXPECTED_OCCURRED: {
    message: "Something unexpected occurred. Please try again",
    statusCode: 500,
  },
  MAIN_DISPLAY_FULL: {
    message:
      "Your main display is full. Please take one book off before placing this on the main display",
    statusCode: 409,
  },
  NO_BOOKS_TO_TAKE_AWAY: {
    message:
      "There are no books to take away from the main shelf! This won't work.",
    statusCode: 409,
  },
  COULD_NOT_DELETE_BOOK: {
    message: "Could not find book on shelf to delete.",
    statusCode: 409,
  },
};

export const getError = (error: string): string => {
  for (const [key, value] of Object.entries(errorTypes)) {
    if (key === error) {
      return value.message;
    }
  }
  return "Something unexpected occurred. Please try again later";
};
