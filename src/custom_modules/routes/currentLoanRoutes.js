const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");
const LoanStatus = require("../../utils/enums/loanStatus.js");

// DB Connection.
db.mongoose.connect(db.uri);

// -----------------------------------------------
// *** GET ALL CURRENT LOANS ***
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Grab all current loans from the DB.
    const loanList = await db.currentLoanModel.find({});

    // Return the loans.
    res.status(200).json(loanList);
  } catch (err) {}
});

// -----------------------------------------------
// *** CREATE CURRENT LOAN ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  // Grab request body.
  let newCurrentLoan = {
    loan_id: req.body.loan_id,
    borrower_id: req.body.borrower_id,
    payment_freq: req.body.payment_freq,
  };

  try {
    // If parameters are empty, throw an error.
    if (
      newCurrentLoan.loan_id == undefined ||
      newCurrentLoan.borrower_id == undefined ||
      newCurrentLoan.payment_freq == undefined
    ) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.EMPTY_INPUT_ERROR.status).send(ERR.EMPTY_INPUT_ERROR);
    return;
  }

  try {
    // Check if borrower_id matches a user in the DB.
    if (checkObjectId(newCurrentLoan.borrower_id)) {
      const user = db.userModel.findById(newCurrentLoan.borrower_id);

      if (!user) {
        throw new Error();
      }
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }

  try {
    // Check if the loan_id matches a loan in the DB.
    if (checkObjectId(newCurrentLoan.loan_id)) {
      const loanRes = db.loanBoardModel.findById(newCurrentLoan.loan_id);

      if (!loanRes) {
        throw new Error();
      }
    }
  } catch (err) {
    res.status(ERR.INVALID_LOAN_ERROR.status).send(ERR.INVALID_LOAN_ERROR);
    return;
  }

  // If we make it here, try to make the new loan.
  try {
    const loanObj = await db.loanBoardModel.findById(newCurrentLoan.loan_id);

    const currentLoanObj = {
      loan_id: newCurrentLoan.loan_id,
      borrower_id: newCurrentLoan.borrower_id,
      amount: loanObj.amount,
      amount_paid: 0,
      amount_remaining: loanObj.amount,
      interest_rate: loanObj.interest_rate,
      interest_paid: 0,
      length_of_loan: loanObj.length_of_loan,
      length_remaining: loanObj.length_of_loan,
      payment_freq: newCurrentLoan.payment_freq,
      loan_status: LoanStatus.GOOD,
    };

    // Save and send confirmation.
    const loan = new db.currentLoanModel(currentLoanObj);
    await loan.save();

    res.status(201).send("Current Loan successfully saved.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** UPDATE LOAN ***
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  const currentLoanId = req.params.id;

  // Check for valid ID.
  try {
    checkObjectId(currentLoanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, update as necessary.
  try {
    const currentLoan = await db.currentLoanModel.findById(currentLoanId);

    if (currentLoan) {
      const requestedChanges = req.body;

      // Save JSON keys for easy access.
      const changeKeys = Object.keys(requestedChanges);

      // Loop through keys.
      changeKeys.forEach((key) => {
        if (currentLoan[key]) {
          currentLoan[key] = requestedChanges[key];
        }
        // If the key matches the one in the schema, update it.
        if (currentLoan[key]) {
          currentLoan[key] = requestedChanges[key];
        }
      });

      // Save and confirm.
      await currentLoan.save();
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
  const currentLoanId = req.params.id;

  // Check for valid ID.
  try {
    checkObjectId(currentLoanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find the loan and delete it if it exists.
  try {
    const currentLoan = await db.currentLoanModel.findById(currentLoanId);

    if (currentLoan) {
      await currentLoan.deleteOne({ _id: currentLoanId });

      res.status(200).send("Current loan successfully deleted.");
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** UPDATE AMOUNTS ON LOAN ***
// -----------------------------------------------

router.put("/payment/:id", async (req, res) => {
  const currentLoanId = req.params.id;

  // Check for valid ID.
  try {
    checkObjectId(currentLoanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // Find the loan and attempt to apply the payment if it exists.
  try {
    const currentLoan = await db.currentLoanModel.findById(currentLoanId);

    if (!currentLoan) {
      throw new Error();
    }

    const payment = req.body.amount_paid;

    // Check if the amount_remaining will be valid before attempting to make any true changes.
    try {
      let updatedAmountRemaining = updateAmountRemaining(currentLoan, payment);

      // If the updated amount remaining is greater than / equal to 0, we can proceed with the changes.
      if (updatedAmountRemaining >= 0) {
        currentLoan.amount_remaining = updatedAmountRemaining;
        currentLoan.amount_paid += payment;

        await currentLoan.save();
        res
          .status(200)
          .send(
            `Payment amount of ${payment} applied to loan #${currentLoanId}.`
          );
        return;
      } else {
        // If we get here, it means the updateAmountRemaining exceeds the total amount owed.
        throw new Error();
      }
    } catch (err) {
      res.status(ERR.INVALID_AMT_ERROR.status).send(ERR.INVALID_AMT_ERROR);
      return;
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** HELPER FUNCTIONS ***
// -----------------------------------------------
const updateAmountRemaining = (currentLoan, payment) => {
  if (currentLoan.amount_remaining > 0) {
    let newAmountRemaining = currentLoan.amount_remaining - payment;

    return newAmountRemaining;
  } else {
    throw new Error();
  }
};

module.exports = router;
