const mongoose = require("mongoose");
const LoanClosedStatus = require("../../utils/enums/loanClosedStatus");
const PaymentFrequency = require("../../utils/enums/paymentFrequency");

const PastLoanSchema = new mongoose.Schema({
  current_loan_id: { type: mongoose.Schema.Types.ObjectId, ref: "CurrentLoan" },
  loan_board_id: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  borrower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  length_of_loan: { type: mongoose.Schema.Types.Double },
  payment_freq: { type: String, enum: PaymentFrequency, uppercase: true },
  amount: { type: mongoose.Schema.Types.Double },
  interest_rate: { type: mongoose.Schema.Types.Double },
  loan_total: { type: mongoose.Schema.Types.Double },
  total_interest_paid: { type: mongoose.Schema.Types.Double },
  loan_closed_status: { type: String, enum: LoanClosedStatus, uppercase: true },
  loan_status_details: String,
});

const PastLoan = mongoose.model("PastLoan", PastLoanSchema);
module.exports = PastLoan;
