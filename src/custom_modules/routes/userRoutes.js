const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");
const UserTypes = require("../../utils/enums/userTypes.js");
const { doesEntryExist } = require("../../utils/doesEntryExist.js");
const ModelNames = require("../../utils/enums/modelNames.js");

// -----------------------------------------------
// *** GET ALL USERS ***
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    // Grab all users.
    const userList = await db.userModel.find({});

    // Return the users in JSON.
    res.status(200).json(userList);
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** GET USER BY ID ***
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  // Check if the ID is a valid ID within the DB.
  try {
    checkObjectId(userId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find the user and send the result if they exist.
  try {
    if (await doesEntryExist(userId, ModelNames.USER)) {
      const user = await db.userModel.findById(userId);
      res.status(200).send(user);
    } else {
      // If we get here, no entry was found using the given ID.
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** CREATE USER *** SIGNUP ***
// -----------------------------------------------
router.post("/register", async (req, res) => {
  // Grab request body.
  let user_type = req.body.user_type;

  // Ensure the user type is valid.
  try {
    isValidUserType(user_type);
  } catch (err) {
    res
      .status(ERR.INVALID_USER_TYPE_ERROR.status)
      .send(ERR.INVALID_USER_TYPE_ERROR);
    return;
  }

  // If we make it here, try to make the new user.
  try {
    const user = new db.userModel(req.body);

    // Save the user and send a confirmation.
    await user.save();
    res.status(201).json({ message: "User successfully created." });
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** UPDATE USER ***
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  // Check for valid ID.
  try {
    checkObjectId(userId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, grab the user and update if they exist.
  try {
    if (await doesEntryExist(userId, ModelNames.USER)) {
      const user = await db.userModel.findById(userId);

      const requestedChanges = req.body;

      // Save the JSON keys for easy access.
      const changeKeys = Object.keys(requestedChanges);

      // Loop through the keys.
      changeKeys.forEach((key) => {
        // If the key matches one in the schema, update.
        if (user[key]) {
          user[key] = requestedChanges[key];
        }
      });

      // Save and confirm.
      await user.save();
      res.status(200).send("User Successfully Updated.");
    } else {
      // If we get here, no entry was found using the given ID.
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** DELETE USER ***
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  // Check for valid ID.
  try {
    checkObjectId(userId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, find the user and delete them if they exist in the system.
  try {
    if (await doesEntryExist(userId, ModelNames.USER)) {
      const user = await db.userModel.findById(userId);

      await user.deleteOne({ _id: userId });

      res.status(200).send("User Successfully Deleted.");
    } else {
      // If we get here, no entry was found using the given ID.
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_USER_ERROR.status).send(ERR.INVALID_USER_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** ADD CURRENT LOAN TO USER ***
// -----------------------------------------------
router.put("/:id/currentLoan/:loanId", async (req, res) => {
  const userId = req.params.id;
  const loanId = req.params.loanId;

  // Check if IDs are valid.
  try {
    checkObjectId(userId);
    checkObjectId(loanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, try to update.
  try {
    const addLoan = await db.userModel.findByIdAndUpdate(userId, {
      $push: { current_loans: loanId },
    });

    await addLoan.save();

    res.status(200).send("Loan successfully added to user.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** ADD PAST LOAN TO USER ***
// -----------------------------------------------
router.put("/:id/pastLoan/:loanId", async (req, res) => {
  const userId = req.params.id;
  const loanId = req.params.loanId;

  // Check if IDs are valid.
  try {
    checkObjectId(userId);
    checkObjectId(loanId);
  } catch (err) {
    res.status(ERR.INVALID_ID_ERROR.status).send(ERR.INVALID_ID_ERROR);
    return;
  }

  // If we get here, try to update.
  try {
    const addLoan = await db.userModel.findByIdAndUpdate(userId, {
      $push: { past_loans: loanId },
    });

    await addLoan.save();

    res.status(200).send("Loan successfully added to user.");
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** HELPER FUNCTIONS ***
// -----------------------------------------------
const isValidUserType = (type) => {
  if (type.toUpperCase() in UserTypes) {
    return;
  } else {
    throw new Error();
  }
};

module.exports = router;
