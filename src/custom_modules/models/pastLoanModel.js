const mongoose = require("mongoose");
const LoanClosedStatus = require("../../utils/enums/loanClosedStatus");
const LoanMeasurements = require("../../utils/enums/loanMeasure");
const PaymentFrequency = require("../../utils/enums/paymentFrequency");

const PastLoanSchema = new mongoose.Schema({
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  borrower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  length_of_loan: Number,
  loan_measure: { type: String, enum: LoanMeasurements, uppercase: true },
  payment_freq: { type: String, enum: PaymentFrequency, uppercase: true },
  min_credit_range: Number,
  max_credit_range: Number,
  interest: Number,
  loan_closed_status: { type: String, enum: LoanClosedStatus, uppercase: true },
  loan_closure_info: String,
  total_interest_paid: Number,
  loan_total: Number,
});

const PastLoan = mongoose.model("PastLoan", PastLoanSchema);
module.exports = PastLoan;
