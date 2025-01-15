const mongoose = require("mongoose");
const User = require("./userModel");

const PastLoanSchema = new mongoose.Schema({
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  borrower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  length_of_loan: Number,
  loan_measure: String, // To be enum (WEEKS, YEARS, MONTHS).
  payment_freq: String, // to be enum (MONTHLY, WEEKLY).
  min_credit_range: Number,
  max_credit_range: Number,
  interest: Number,
  loan_closed_status: String, // To be enum (COMPLETE, CANCELLED).
  loan_closure_info: String,
  total_interest_paid: Number,
  loan_total: Number,
});

const PastLoan = mongoose.model("PastLoan", PastLoanSchema);
module.exports = PastLoan;
