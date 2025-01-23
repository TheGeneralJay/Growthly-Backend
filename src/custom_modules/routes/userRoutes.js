const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const { checkObjectId } = require("../../utils/checkObjectId.js");
const ERR = require("../../utils/enums/errorMessages.js");

// DB Connection.
db.mongoose.connect(db.uri);

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

  // If we get here, find the user and send the result.
  try {
    const user = await db.userModel.findById(userId);

    if (user) {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

// -----------------------------------------------
// *** CREATE USER *** SIGNUP ***
// -----------------------------------------------
router.post("/register", async (req, res) => {
  // Grab request body.
  let {
    first_name,
    last_name,
    phone_number,
    email,
    password,
    street_address,
    province,
    postal_code,
    username,
    user_type,
    sin_number,
  } = req.body;

  try {
    // If any parameters are empty, throw error.
    if (
      first_name == undefined ||
      last_name == undefined ||
      phone_number == undefined ||
      email == undefined ||
      password == undefined ||
      street_address == undefined ||
      province == undefined ||
      postal_code == undefined ||
      username == undefined ||
      user_type == undefined ||
      sin_number == undefined
    ) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.EMPTY_INPUT_ERROR.status).send(ERR.EMPTY_INPUT_ERROR);
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

  // If we get here, grab the user and update as necessary.
  try {
    const user = await db.userModel.findById(userId);

    if (user) {
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
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
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
    const user = await db.userModel.findById(userId);

    if (user) {
      await user.deleteOne({ _id: userId });

      res.status(200).send("User Successfully Deleted.");
    }
  } catch (err) {
    res.status(ERR.DEFAULT_ERROR.status).send(ERR.DEFAULT_ERROR);
    return;
  }
});

module.exports = router;
