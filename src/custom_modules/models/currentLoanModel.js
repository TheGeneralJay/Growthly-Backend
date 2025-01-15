const mongoose = require("mongoose");

const CurrentLoanSchema = new mongoose.Schema({
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  borrower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  length_of_loan: Number,
  loan_measure: String, // To be enum (WEEKS, YEARS, MONTHS).
  payment_freq: String, // to be enum (MONTHLY, WEEKLY).
  min_credit_range: Number,
  max_credit_range: Number,
  interest: Number,
  loan_status: String, // To be enum (GOOD, MISSED_PAYMENT)
  interest_paid: Number,
  amount_remaining: Number,
  payment_amount: Number,
});

const CurrentLoan = mongoose.model("CurrentLoan", CurrentLoanSchema);
module.exports = CurrentLoan;
