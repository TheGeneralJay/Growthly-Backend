const mongoose = require("mongoose");
const LoanMeasurements = require("../../utils/enums/loanMeasure");
const PaymentFrequency = require("../../utils/enums/paymentFrequency");
const LoanStatus = require("../../utils/enums/loanStatus");

const CurrentLoanSchema = new mongoose.Schema({
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  borrower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  length_of_loan: Number,
  loan_measure: { type: String, enum: LoanMeasurements, uppercase: true },
  payment_freq: { type: String, enum: PaymentFrequency, uppercase: true },
  min_credit_range: Number,
  max_credit_range: Number,
  interest_rate: Number,
  loan_status: { type: String, enum: LoanStatus, uppercase: true },
  interest_paid: Number,
  amount_remaining: Number,
  payment_amount: Number,
});

const CurrentLoan = mongoose.model("CurrentLoan", CurrentLoanSchema);
module.exports = CurrentLoan;
