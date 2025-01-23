const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");

// DB Connection.
db.mongoose.connect(db.uri);

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
// *** GET LOAN BY ID ***
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
    const loan = await db.loanBoardModel.findById(loanId);

    if (loan) {
      res.status(200).json(loan);
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** CREATE LOAN ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  // Grab request body.
  let newLoan = {
    lender_id: req.body.lender_id,
    amount: req.body.amount,
    interest_rate: req.body.interest_rate,
    length_of_loan: req.body.length_of_loan,
    available: true, // Make loan available upon creation for borrowers to claim.
  };

  try {
    // If parameters empty, throw error.
    if (
      newLoan.amount == undefined ||
      newLoan.interest_rate == undefined ||
      newLoan.length_of_loan == undefined
    ) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.EMPTY_INPUT_ERROR.status).send(ERR.EMPTY_INPUT_ERROR);
    return;
  }

  try {
    // Check if lender_id matches a user in the DB.
    // *** MAKE IT SO IT ENSURES THE USER IS A LENDER LATER.
    if (checkObjectId(newLoan.lender_id)) {
      const user = db.userModel.findById(newLoan.lender_id);

      if (!user) {
        throw new Error();
      }
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }

  // If we make it here, try to make the new loan.
  try {
    const loan = new db.loanBoardModel(newLoan);

    // Save and send confirmation.
    await loan.save();
    res.status(201).json({ message: "Loan successfully posted." });
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

  // Check for valid ID.
  try {
    checkObjectId(loanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, update as necessary.
  try {
    const loan = await db.loanBoardModel.findById(loanId);

    if (loan) {
      const requestedChanges = req.body;

      // Save JSON keys for easy access.
      const changeKeys = Object.keys(requestedChanges);

      // Loop through keys.
      changeKeys.forEach((key) => {
        // If the key matches the one in the schema, update it.
        if (loan[key]) {
          loan[key] = requestedChanges[key];
        }
      });

      // Save and confirm.
      await loan.save();
      res.status(200).send("Loan Successfully Updated.");
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
  const loanId = req.params.id;

  // Check for valid ID.
  try {
    checkObjectId(loanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find the loan and delete it if it exists.
  try {
    const loan = await db.loanBoardModel.findById(loanId);

    if (loan) {
      await loan.deleteOne({ _id: loanId });

      res.status(200).send("Loan Successfully Deleted.");
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

module.exports = router;
