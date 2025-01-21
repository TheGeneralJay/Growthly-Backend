const mongoose = require("mongoose");

// Unclaimed fresh loans posted by the lender.
const LoanBoardSchema = new mongoose.Schema({
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  interest_rate: Number,
  length_of_loan: Number,
  available: Boolean, // True if not claimed. False if claimed by borrower.
});

const Loan = mongoose.model("Loan", LoanBoardSchema);
module.exports = Loan;
