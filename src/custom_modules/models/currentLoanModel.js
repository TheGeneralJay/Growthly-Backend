const mongoose = require("mongoose");
const PaymentFrequency = require("../../utils/enums/paymentFrequency");
const LoanStatus = require("../../utils/enums/loanStatus");

const CurrentLoanSchema = new mongoose.Schema({
  loan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  borrower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: mongoose.Schema.Types.Double },
  amount_paid: { type: mongoose.Schema.Types.Double },
  amount_remaining: { type: mongoose.Schema.Types.Double },
  interest_rate: { type: mongoose.Schema.Types.Double },
  interest_paid: { type: mongoose.Schema.Types.Double },
  length_of_loan: { type: mongoose.Schema.Types.Double },
  length_remaining: { type: mongoose.Schema.Types.Double },
  payment_freq: {
    type: String,
    enum: PaymentFrequency,
    uppercase: true,
    required: true,
  },
  loan_status: { type: String, enum: LoanStatus, uppercase: true },
});

const CurrentLoan = mongoose.model("CurrentLoan", CurrentLoanSchema);
module.exports = CurrentLoan;
