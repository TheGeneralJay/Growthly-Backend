const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const UserTypes = require("../../utils/enums/userTypes.js");
const { doesEntryExist } = require("../../utils/doesEntryExist.js");
const ModelNames = require("../../utils/enums/modelNames.js");
const ERR = require("../../utils/enums/errorMessages.js");

// -----------------------------------------------
// *** GET ALL LOANS ***
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Grab all loans from the DB.
    const loanList = await db.loanBoardModel.find({});

    // Return the loans.
    res.status(200).json(loanList);
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** GET LOANS BY SEARCH CRITERIA (MATCHES) ***
// -----------------------------------------------
router.post("/matches", async (req, res) => {
  try {
    // Grab loan specifications from body.
    const loanFilters = req.body;

    // Try to find an exact match for the user.
    const exactMatches = await db.loanBoardModel.find({
      $and: [
        { amount: loanFilters.amount },
        { length_of_loan: loanFilters.duration },
      ],
    });

    // If there is an exact match, send this.
    if (exactMatches.length > 0) {
      res.status(200).send(exactMatches);
      return;
    }

    // If we get here, there are no exact matches.
    // Adjust parameters to offer similar loan matches.
    const adjustedHigh = {
      amount: req.body.amount + 500,
      duration: req.body.duration + 3,
    };

    const adjustedLow = {
      amount: req.body.amount - 500,
      duration: req.body.duration - 3,
    };

    const matches = await db.loanBoardModel.find({
      $or: [
        {
          $and: [
            { amount: { $gte: adjustedLow.amount } },
            { amount: { $lte: adjustedHigh.amount } },
          ],
        },

        {
          $and: [
            { length_of_loan: { $gte: adjustedLow.duration } },
            { length_of_loan: { $lte: adjustedHigh.duration } },
          ],
        },
      ],
    });

    res.status(200).json(matches);
    return;
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** GET LOAN BY ID ***
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  const loanId = req.params.id;

  // Check if loanId exists in the DB.
  try {
    // Catches if id is entirely invalid.
    checkObjectId(loanId);

    if (await doesEntryExist(loanId, ModelNames.LOANBOARD)) {
      const loan = await db.loanBoardModel.findById(loanId);
      res.status(200).send(loan);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_LOAN_ERROR.status).send(ERR.INVALID_LOAN_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** CREATE LOAN ***
// -----------------------------------------------

router.post("/", async (req, res) => {
  // Grab the request body.
  const newLoan = {
    lender_id: req.body.lender_id,
    amount: req.body.amount,
    interest_rate: req.body.interest_rate,
    length_of_loan: req.body.length_of_loan,
    available: true,
  };

  // Check if lender_id user exists in the DB.
  try {
    // Catches if id is entirely invalid.
    checkObjectId(newLoan.lender_id);

    if (await !doesEntryExist(newLoan.lender_id, ModelNames.USER)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }

  // Grab user from DB.
  const user = await db.userModel.findById(newLoan.lender_id);

  // Check if user is a lender.
  try {
    if (user.user_type !== UserTypes.LENDER) {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("ERROR: User is not a LENDER.");
    return;
  }

  // If we get here, create the postedLoan and add it to user.
  try {
    const loan = new db.loanBoardModel(newLoan);
    await loan.save();

    // Add loan to user.
    user.posted_loans = loan._id;
    await user.save();

    res.status(200).send("Loan has been posted and added to lender account.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** UPDATE LOAN ***
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  const loanId = req.params.id;

  // Check if the loan exists in the DB.
  try {
    checkObjectId(loanId);

    if (await !doesEntryExist(loanId, ModelNames.LOANBOARD)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // Verify that we are not trying to change the lender the loan is tied to.
  // If we are, probably easier just to make new loan, so error out.
  const loan = await db.loanBoardModel.findById(loanId);
  const requestedChanges = req.body;

  try {
    if (requestedChanges.lender_id !== undefined) {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("ERROR: Cannot change user that the loan is tied to.");
    return;
  }

  // If we get here, loop through the keys and adjust as necessary.
  try {
    // Save JSON keys for easy access.
    const changeKeys = Object.keys(requestedChanges);

    // Loop through keys.
    changeKeys.forEach((key) => {
      // If the key matches one in the schema, update it.
      if (loan[key]) {
        loan[key] = requestedChanges[key];
      }
    });

    // Save and confirm.
    await loan.save();
    res.status(200).send("Posted loan successfully updated.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
  }
});

// -----------------------------------------------
// *** DELETE LOAN ***
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  const loanId = req.params.id;

  // Check if the loan exists in the DB.
  try {
    checkObjectId(loanId);

    if (await !doesEntryExist(loanId, ModelNames.LOANBOARD)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If the loan exists, verify that the lender tied to it also exists.
  const loan = await db.loanBoardModel.findById(loanId);

  try {
    checkObjectId(loan.lender_id);

    if (await !doesEntryExist(loan.lender_id, ModelNames.USER)) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find the loan and delete it.
  try {
    const lender = await db.userModel.findById(loan.lender_id);

    // Remove loan from lender.
    const index = lender.posted_loans.indexOf(loanId);
    // If loan is found, remove it from the lender.
    if (index > -1) {
      lender.posted_loans.splice(index, 1);
    }
    await lender.save();

    // Delete the loan entirely.
    await db.loanBoardModel.deleteOne({ _id: loanId });

    res.status(200).send("Posted loan has been deleted.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

module.exports = router;
