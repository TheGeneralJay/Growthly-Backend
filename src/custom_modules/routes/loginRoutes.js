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

  // Test entered password against the one stored in DB.
  try {
    if (existingUser.password == dbResponse.password) {
      res
        .status(200)
        .send(`Login successful. Welcome, ${dbResponse.first_name}!`);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("Incorrect password error.");
  }
});

module.exports = router;
