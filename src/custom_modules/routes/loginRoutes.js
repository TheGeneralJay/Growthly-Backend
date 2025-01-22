const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();

// DB Connection.
db.mongoose.connect(db.uri);

// -----------------------------------------------
// *** LOGIN ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  const existingUser = req.body;

  // Find the user by email or by username.
  let dbResponse = await db.userModel.findOne({
    email: existingUser.email_or_username,
  });

  if (!dbResponse) {
    dbResponse = await db.userModel.findOne({
      username: existingUser.email_or_username,
    });
  }

  // If no matching user exists, notify the user.
  try {
    if (!dbResponse) {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("Email does not exist error.");
    return;
  }

  // Test the entered plaintex password against the hashed version in the DB.
  try {
    const isMatch = await dbResponse.comparePassword(existingUser.password);

    // If the passwords do not match, throw error.
    if (!isMatch) {
      throw new Error();
    }

    // If we get here, send the successful login message.
    res.status(200).json(`Login successful, welcome ${dbResponse.first_name}!`);
  } catch (err) {
    res.status(400).send("Incorrect password error.");
    return;
  }
});

module.exports = router;
