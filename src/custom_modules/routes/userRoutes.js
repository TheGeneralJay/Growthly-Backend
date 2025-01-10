const express = require("express");
const db = require("../database/dbConnection.js");
const router = express.Router();

// DB Connection.
db.mongoose.connect(db.uri);

router.get("/", async (req, res) => {
  // Grab all users from the DB.
  const userList = await db.userModel.find({});

  console.log("List of users successfully retrieved.");
  res.status(200).json(userList);
});

module.exports = router;
