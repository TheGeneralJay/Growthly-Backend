const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");
const { doesEntryExist } = require("../../utils/doesEntryExist.js");
const ModelNames = require("../../utils/enums/modelNames.js");

// -----------------------------------------------
// *** GET ALL PAST LOANS ***
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Grab all past loans from the DB.
    const loanList = await db.pastLoanModel.find({});

    // Return the loans.
    res.status(200).send(loanList);
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** GET PAST LOAN BY ID ***
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  const loanId = req.params.id;

  // Check if loanId exists in the DB.
  try {
    checkObjectId(loanId);

    if (await doesEntryExist(loanId, ModelNames.PASTLOAN)) {
      const pastLoan = await db.pastLoanModel.findById(loanId);
      res.status(200).send(pastLoan);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_LOAN_ERROR.status).send(ERR.INVALID_LOAN_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** CREATE CURRENT LOAN ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  const currentLoanId = req.body.current_loan_id;

  // Ensure currentLoan exists in the DB.
  try {
    checkObjectId(currentLoanId);

    if (await !doesEntryExist(currentLoanId, ModelNames.CURRENTLOAN)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_LOAN_ERROR.status).send(ERR.INVALID_LOAN_ERROR);
    return;
  }

  const currentLoan = await db.currentLoanModel.findById(currentLoanId);
  const postedLoan = await db.loanBoardModel.findById(currentLoan.loan_id);

  // Attach information to variables for easier access.
  const [
    lenderId,
    borrowerId,
    loanLength,
    paymentFreq,
    amount,
    interestRate,
    loanTotal,
    totalInterestPaid,
  ] = [
    postedLoan.lender_id,
    currentLoan.borrower_id,
    currentLoan.length_of_loan,
    currentLoan.payment_freq,
    currentLoan.amount,
    currentLoan.interest_rate,
    currentLoan.amount_paid,
    currentLoan.interest_paid,
  ];

  // Make the new pastLoan to save to the DB.
  try {
    const newPastLoan = {
      current_loan_id: currentLoanId,
      loan_board_id: postedLoan.id,
      lender_id: lenderId,
      borrower_id: borrowerId,
      length_of_loan: loanLength,
      payment_freq: paymentFreq,
      amount: amount,
      interest_rate: interestRate,
      loan_total: loanTotal,
      total_interest_paid: totalInterestPaid,
      loan_closed_status: req.body.loan_closed_status,
      loan_status_details: req.body.loan_status_details,
    };

    const pastLoan = new db.pastLoanModel(newPastLoan);
    await pastLoan.save();

    // Add pastLoan to borrower / lenders and remove from currentLoan / postedLoans.
    const lender = await db.userModel.findById(newPastLoan.lender_id);
    const borrower = await db.userModel.findById(newPastLoan.borrower_id);

    lender.past_loans.push(pastLoan._id);
    borrower.past_loans.push(pastLoan._id);

    const lenderIndex = lender.posted_loans.indexOf(newPastLoan.loan_board_id);
    const borrowerIndex = borrower.current_loans.indexOf(currentLoanId);

    if (lenderIndex > -1) {
      lender.posted_loans.splice(lenderIndex, 1);
    }

    if (borrowerIndex > -1) {
      borrower.current_loans.splice(borrowerIndex, 1);
    }

    await lender.save();
    await borrower.save();

    res.status(200).send("Past loan has been saved.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** UPDATE PAST LOAN ***
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  const pastLoanId = req.params.id;

  // Check if pastLoan exists in the DB.
  try {
    checkObjectId(pastLoanId);

    if (await !doesEntryExist(pastLoanId, ModelNames.PASTLOAN)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // Update as necessary.
  try {
    const pastLoan = await db.pastLoanModel.findById(pastLoanId);

    const requestedChanges = req.body;

    // Save JSON keys for easy access.
    const changeKeys = Object.keys(requestedChanges);

    // Loop through keys.
    changeKeys.forEach((key) => {
      if (pastLoan[key]) {
        pastLoan[key] = requestedChanges[key];
      }
    });

    // Save and confirm.
    await pastLoan.save();
    res.status(200).send("Past loan successfully updated.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** DELETE LOAN ***
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  const pastLoanId = req.params.id;

  // Check if pastLoan exists in DB.
  try {
    checkObjectId(pastLoanId);

    if (await !doesEntryExist(pastLoanId, ModelNames.PASTLOAN)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // Delete the loan.
  try {
    const pastLoan = await db.pastLoanModel.findById(pastLoanId);

    // Grab the users to delete pastLoan from their accounts.
    const borrower = await db.userModel.findById(pastLoan.borrower_id);
    const lender = await db.userModel.findById(pastLoan.lender_id);

    if (borrower !== null) {
      const borrowerIndex = borrower.past_loans.indexOf(pastLoanId);

      if (borrowerIndex > -1) {
        borrower.past_loans.splice(borrowerIndex, 1);
        await borrower.save();
      }
    }

    if (lender !== null) {
      const lenderIndex = lender.past_loans.indexOf(pastLoanId);

      if (lenderIndex > -1) {
        lender.past_loans.splice(lenderIndex, 1);
        await lender.save();
      }
    }

    // Delete pastLoan entirely.
    await db.pastLoanModel.deleteOne({ _id: pastLoanId });
    res.status(200).send("Past loan has been deleted.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

module.exports = router;
