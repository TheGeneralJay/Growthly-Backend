const mongoose = require("mongoose");

// Unclaimed fresh loans posted by the lender.
const LoanBoardSchema = new mongoose.Schema({
  lender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: mongoose.Schema.Types.Double },
  interest_rate: { type: mongoose.Schema.Types.Double },
  length_of_loan: { type: mongoose.Schema.Types.Double },
  available: Boolean, // True if not claimed. False if claimed by borrower.
});

const Loan = mongoose.model("Loan", LoanBoardSchema);
module.exports = Loan;
