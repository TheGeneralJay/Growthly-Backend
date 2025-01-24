# Growthly Backend

## Startup Procedure:

1. Clone the `Growthly-Backend` repository.
2. Open your terminal to the local repository.
3. Enter `npm install`.

## TODO:

- [x] Basic user CRUD implementation.
- [x] Basic login implementation.
- [x] Add enums for LENDER / BORROWER.
  - [ ] Add error message for invalid input on user type.
- [ ] Refactor address into object.
- [x] Refactor past loans into its own schema.
  - [ ] Add necessary CRUD implementation for past loans.
  - [x] Add enums for loan_closed_status (COMPLETE, CANCELLED).
- [x] Refactor current loans into its own schema.
  - [ ] Add necessary CRUD implementation for current loans.
  - [x] Add enums for loan_measure (WEEKS, YEARS, MONTHS).
  - [x] Add enums for payment_freq (MONTHLY, WEEKLY).
  - [x] Add enums for loan_status (GOOD, MISSED_PAYMENT).
- [x] Add loanBoard schema.
  - [x] Add necessary CRUD implementation.
  - [ ] Connect loans to current/past loans by ID.
  - [x] Connect a user object ID to the loans.
- [x] Add custom error messages into its own file.
- [ ] Place the try/catch "check for valid ID" block into a function if possible.
- [ ] Fix app hanging when you try to delete something with a valid object ID (i.e. something you've already deleted once and try to delete again).
- [ ] Apply calculations automatically for amount_remaining values in currentLoans.
- [ ] CONTINUOUS: Clean up any messy implementations.
