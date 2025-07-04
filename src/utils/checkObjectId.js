const db = require("../custom_modules/database/dbConnection.js");

const checkObjectId = (givenId) => {
  if (!db.mongoose.isValidObjectId(givenId)) {
    throw new Error();
  } else {
    return true;
  }
};

module.exports = { checkObjectId };
