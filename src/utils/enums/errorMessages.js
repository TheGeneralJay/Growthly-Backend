const ErrorMessages = Object.freeze({
  INVALID_ID_ERROR: {
    status: 404,
    message: "ERROR: Invalid ID.",
  },

  EMPTY_INPUT_ERROR: {
    status: 400,
    message: "ERROR: Input parameters cannot be empty.",
  },

  INVALID_EMAIL_ERROR: {
    status: 404,
    message: "ERROR: Account with the given email does not exist.",
  },

  INCORRECT_PASSWORD_ERROR: {
    status: 400,
    message: "ERROR: Incorrect password.",
  },

  INVALID_USER_ERROR: {
    status: 404,
    message: "ERROR: Account with the given ID does not exist.",
  },

  INVALID_USER_TYPE_ERROR: {
    status: 400,
    message:
      "ERROR: User type must be either LENDER, BORROWER, or ADMINISTRATOR.",
  },

  INVALID_LOAN_ERROR: {
    status: 404,
    message: "ERROR: Loan with the given ID does not exist.",
  },

  INVALID_AMT_ERROR: {
    status: 400,
    message: "ERROR: Payment amount exceeds total.",
  },

  // Default fallback error.
  DEFAULT_ERROR: {
    status: 400,
    message: "An error has occured while trying to process the request.",
  },
});

module.exports = ErrorMessages;
