const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const ERR = require("../../utils/enums/errorMessages.js");

// DB Connection.
db.mongoose.connect(db.uri);

// -----------------------------------------------
// *** LOGIN ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  const existingUser = req.body;

  // Find the user by email or by username.
  const dbUser = await db.userModel.findOne({
    $or: [
      { email: existingUser.email_or_username },
      { username: existingUser.email_or_username },
    ],
  });

  console.log(dbUser);

  // If no matching user exists, notify the user.
  try {
    if (dbUser === null) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_EMAIL_ERROR.status).send(ERR.INVALID_EMAIL_ERROR);
    return;
  }

  // Test the entered plaintext password against the hashed version in the DB.
  try {
    // const isMatch = await dbUser.comparePassword(existingUser.password);

    // // If the passwords do not match, throw error.
    // if (!isMatch) {
    //   throw new Error();
    // }

    if (dbUser.password !== existingUser.password) {
      throw new Error();
    }

    // If we get here, send the user that logged in.
    res.status(200).json(dbUser);
  } catch (err) {
    res
      .status(ERR.INCORRECT_PASSWORD_ERROR.status)
      .send(ERR.INCORRECT_PASSWORD_ERROR);
    return;
  }
});

module.exports = router;
