# Growthly Backend

## Startup Procedure:

1. Clone the `Growthly-Backend` repository.
2. Open your terminal to the local repository.
3. Enter `npm install`.
4. Enter `npm start` to start the app.

## TODO:

- [x] Basic user CRUD implementation.
- [x] Basic login implementation.
- [x] Add enums for LENDER / BORROWER.
  - [x] Add error message for invalid input on user type.
- [x] Refactor past loans into its own schema.
  - [x] Add necessary CRUD implementation for past loans.
  - [x] Add enums for loan_closed_status (COMPLETE, CANCELLED).
- [x] Refactor current loans into its own schema.
  - [x] Add necessary CRUD implementation for current loans.
  - [x] Add enums for payment_freq (MONTHLY, WEEKLY).
  - [x] Add enums for loan_status (GOOD, MISSED_PAYMENT).
- [x] Add loanBoard schema.
  - [x] Add necessary CRUD implementation.
  - [x] Connect loans to current/past loans by ID.
  - [x] Connect a user object ID to the loans.
- [x] Add custom error messages into its own file.
- [x] Apply calculations automatically for amount_remaining values in currentLoans.
- [ ] Refactor address into object.
- [ ] Apply interest calculations automatically where necessary.
- [ ] CONTINUOUS: Clean up any messy implementations.

## TODO [FIXES]:

- [x] Change schema to force input as required instead.
  - [x] User.
  - [x] LoanBoard.
  - [x] CurrentLoan.
  - [x] PastLoan.
- [ ] Place the try/catch "check for valid ID" block into a function if possible.
- [ ] Validate if user is a lender when trying to post a loan.
- [ ] Fix app hanging when you try to delete something with a valid object ID (i.e. something you've already deleted once and try to delete again).
- [ ] Error handle changeAvailability export.
- [ ] Place update logic into its own helper function.
