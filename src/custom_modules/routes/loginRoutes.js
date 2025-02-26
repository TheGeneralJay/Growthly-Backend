const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();
const ERR = require("../../utils/enums/errorMessages.js");

// -----------------------------------------------
// *** SEND BACK STORED HASH PASSWORD ***
// -----------------------------------------------
router.post("/", async (req, res) => {
  const existingUser = req.body;

  const dbUser = await db.userModel.findOne({
    $or: [
      { email: existingUser.email_or_username },
      { username: existingUser.email_or_username },
    ],
  });

  // If no matching user exists, notify the user.
  try {
    if (dbUser === null) {
      throw new Error();
    }
  } catch (err) {
    res.status(ERR.INVALID_EMAIL_ERROR.status).send(ERR.INVALID_EMAIL_ERROR);
    return;
  }

  // Return the dbUser password hash.
  res.status(200).send({ stored_password: dbUser.password });
});

// -----------------------------------------------
// *** ALLOW LOGIN ***
// -----------------------------------------------
router.post("/auth", async (req, res) => {
  const userAuth = req.body;

  // If request sent without validated login, deny access.
  try {
    if (!userAuth.login_validated) {
      throw new Error();
    }
  } catch (err) {
    res
      .status(ERR.USER_UNAUTHORIZED_ERROR.status)
      .send(ERR.USER_UNAUTHORIZED_ERROR);
    return;
  }

  // If we make it here, find the user and send the response.
  try {
    const dbUser = await db.userModel.findOne({
      $or: [
        { email: userAuth.email_or_username },
        { username: userAuth.email_or_username },
      ],
    });

    // If for whatever reason the user is null, error out.
    if (dbUser === null) {
      throw new Error();
    }

    res.status(200).send(dbUser);
  } catch (err) {
    res.status(ERR.INVALID_EMAIL_ERROR.status).send(ERR.INVALID_EMAIL_ERROR);
    return;
  }
});

module.exports = router;
