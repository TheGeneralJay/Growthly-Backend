const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");

// -----------------------------------------------
// *** GET ALL PAST LOANS ***
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Grab all past loans from the DB.
    const loanList = await db.pastLoanModel.find({});

    // Return the loans.
    res.status(200).json(loanList);
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
  }
});

// -----------------------------------------------
// *** GET PAST LOAN BY ID ***
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  const loanId = req.params.id;

  // Check for valid ID.
  try {
    checkObjectId(loanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find loan and send result.
  try {
    const pastLoan = await db.pastLoanModel.findById(loanId);

    if (pastLoan) {
      res.status(200).send(pastLoan);
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** CREATE CURRENT LOAN ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  // Grab current loan ID from body.
  const currentLoanID = req.body.current_loan_id;

  let currLoan,
    loanBoard = false;

  // Ensure currentLoan exists.
  try {
    if (checkObjectId(currentLoanID)) {
      currLoan = await db.currentLoanModel.findById(currentLoanID);

      if (!currLoan) {
        throw new Error();
      }
    }

    // Grab the loanBoard and currentLoan objects.
    if (checkObjectId(currLoan.loan_id)) {
      loanBoard = await db.loanBoardModel.findById(currLoan.loan_id);

      if (!loanBoard) {
        throw new Error();
      }
    }
  } catch (err) {
    res.status(ERR.INVALID_LOAN_ERROR.status).send(ERR.INVALID_LOAN_ERROR);
  }

  // Attach information to easier variables.
  const [
    lenderID,
    borrowerID,
    loanLength,
    paymentFreq,
    amount,
    interestRate,
    loanTotal,
    totalInterestPaid,
  ] = [
    loanBoard.lender_id,
    currLoan.borrower_id,
    currLoan.length_of_loan,
    currLoan.payment_freq,
    currLoan.amount,
    currLoan.interest_rate,
    currLoan.amount_paid,
    currLoan.interest_paid,
  ];

  // If we make it here, try to make the new loan.
  try {
    const newPastLoan = {
      current_loan_id: currentLoanID,
      loan_board_id: loanBoard._id,
      lender_id: lenderID,
      borrower_id: borrowerID,
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

    res.status(201).send("Past loan successfully saved.");
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

  // Check for valid ID.
  try {
    checkObjectId(pastLoanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, update as necessary.
  try {
    const pastLoan = await db.pastLoanModel.findById(pastLoanId);

    if (pastLoan) {
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
      res.status(200).send("Loan successfully updated.");
    }
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

  // Check for valid ID.
  try {
    checkObjectId(pastLoanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find the loan and delete it if it exists.
  try {
    const pastLoan = await db.pastLoanModel.findById(pastLoanId);

    if (pastLoan) {
      await pastLoan.deleteOne({ _id: pastLoanId });

      res.status(200).send("Past loan successfully deleted.");
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

module.exports = router;
