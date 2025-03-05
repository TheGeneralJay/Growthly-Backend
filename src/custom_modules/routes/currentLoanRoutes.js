const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");
const LoanStatus = require("../../utils/enums/loanStatus.js");
const UserTypes = require("../../utils/enums/userTypes.js");
const { doesEntryExist } = require("../../utils/doesEntryExist.js");
const ModelNames = require("../../utils/enums/modelNames.js");
const { changeAvailability } = require("../../utils/changeAvailability.js");

// -----------------------------------------------
// *** GET ALL CURRENT LOANS ***
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Grab all current loans from the DB.
    const loanList = await db.currentLoanModel.find({});

    // Return the loans.
    res.status(200).send(loanList);
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** GET CURRENT LOAN BY ID ***
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  const loanId = req.params.id;

  // Check if loanId exists in the DB.
  try {
    // Catches if id is entirely invalid.
    checkObjectId(loanId);

    if (await doesEntryExist(loanId, ModelNames.CURRENTLOAN)) {
      const currentLoan = await db.currentLoanModel.findById(loanId);
      res.status(200).send(currentLoan);
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
  // Grab request body.
  const newCurrentLoan = req.body;

  // Check if loan_id exists in the DB.
  try {
    checkObjectId(newCurrentLoan.loan_id);

    if (await !doesEntryExist(newCurrentLoan.loan_id, ModelNames.LOANBOARD)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_LOAN_ERROR.status).send(ERR.INVALID_LOAN_ERROR);
    return;
  }

  const loan = await db.loanBoardModel.findById(newCurrentLoan.loan_id);

  // If the loan is unavailable, do not proceed.
  try {
    if (!loan.available) {
      throw new Error();
    }
  } catch (err) {
    res
      .status(ERR.LOAN_UNAVAILABLE_ERROR.status)
      .send(ERR.LOAN_UNAVAILABLE_ERROR);
    return;
  }

  // Check if borrower_id exists in the DB.
  try {
    checkObjectId(newCurrentLoan.borrower_id);

    if (await !doesEntryExist(newCurrentLoan.borrower_id, ModelNames.USER)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }

  const borrower = await db.userModel.findById(newCurrentLoan.borrower_id);
  // Make sure user is a borrower.
  try {
    if (borrower.user_type !== UserTypes.BORROWER) {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("ERROR: User is not a BORROWER.");
    return;
  }

  // Finally, if we make it here, create the currentLoan and add it to the user.
  try {
    const currentLoan = {
      loan_id: newCurrentLoan.loan_id,
      borrower_id: newCurrentLoan.borrower_id,
      amount: loan.amount,
      amount_paid: 0,
      amount_remaining: loan.amount,
      interest_rate: loan.interest_rate,
      interest_paid: 0,
      length_of_loan: loan.length_of_loan,
      length_remaining: loan.length_of_loan,
      payment_freq: newCurrentLoan.payment_freq,
      loan_status: LoanStatus.GOOD,
    };

    // Save and confirm.
    const saveLoan = new db.currentLoanModel(currentLoan);
    await saveLoan.save();

    // Set the loan to unavailable.
    changeAvailability(loan, false);

    // Add the loan to the borrower.
    borrower.current_loans.push(saveLoan._id);
    await borrower.save();

    res
      .status(200)
      .send("Current loan has been accepted and added to borrower account.");
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

  // Check if the currentLoan exists in the DB.
  try {
    checkObjectId(currentLoanId);

    if (await !doesEntryExist(currentLoanId, ModelNames.CURRENTLOAN)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // Verify that we are not trying to change the user that the loan is tied to.
  const currentLoan = await db.currentLoanModel.findById(currentLoanId);
  const requestedChanges = req.body;

  try {
    if (requestedChanges.borrower_id !== undefined) {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("ERROR: Cannot change user that loan is tied to.");
    return;
  }

  // If we get here, loop through the keys and adjust as necessary.
  try {
    // Save JSON keys for easy access.
    const changeKeys = Object.keys(requestedChanges);

    // Loop through keys.
    changeKeys.forEach((key) => {
      // If the key matches one in the schema, update it.
      if (currentLoan[key]) {
        currentLoan[key] = requestedChanges[key];
      }
    });

    // Save and confirm.
    await currentLoan.save();
    res.status(200).send("Current loan successfully updated.");
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

  // Check if the loan exists in the DB.
  try {
    checkObjectId(currentLoanId);

    if (await !doesEntryExist(currentLoanId, ModelNames.CURRENTLOAN)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If loan exists, verify that the borrower exists.
  const currentLoan = await db.currentLoanModel.findById(currentLoanId);

  try {
    checkObjectId(currentLoan.borrower_id);

    if (await !doesEntryExist(currentLoan.borrower_id, ModelNames.USER)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }

  // If we get here, find the loan and delete it.
  try {
    const borrower = await db.userModel.findById(currentLoan.borrower_id);

    // Remove the loan from the borrower.
    const index = borrower.current_loans.indexOf(currentLoanId);
    // If loan is found, remove it from borrower.
    if (index > -1) {
      borrower.current_loans.splice(index, 1);
    }
    await borrower.save();

    // Delete the loan entirely.
    await db.currentLoanModel.deleteOne({ _id: currentLoanId });

    res.status(200).send("Current loan has been deleted.");
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

    // Send to default error if the body sent undefined.
    if (payment == undefined) {
      throw new Error();
    }

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
