# Growthly Backend

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
  - [X] Add necessary CRUD implementation.
  - [ ] Connect loans to current/past loans by ID.
- [ ] Add custom error messages into its own file.
- [ ] Place the try/catch "check for valid ID" block into a function if possible.
- [ ] CONTINUOUS: Clean up any messy implementations.
