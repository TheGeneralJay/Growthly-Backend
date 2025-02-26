const db = require("../custom_modules/database/dbConnection.js");
const ModelNames = require("./enums/modelNames.js");

const doesEntryExist = async (id, model) => {
  switch (model) {
    case ModelNames.USER:
      const user = await db.userModel.exists({ _id: id });

      if (user != null) {
        return true;
      } else {
        return false;
      }

    case ModelNames.LOANBOARD:
      const loanBoard = await db.loanBoardModel.exists({ _id: id });

      if (loanBoard != null) {
        return true;
      } else {
        return false;
      }

    case ModelNames.CURRENTLOAN:
      const currentLoan = await db.currentLoanModel.exists({ _id: id });

      if (currentLoan != null) {
        return true;
      } else {
        return false;
      }

    case ModelNames.PASTLOAN:
      const pastLoan = await db.pastLoanModel.exists({ _id: id });

      if (pastLoan != null) {
        return true;
      } else {
        return false;
      }
  }
};

module.exports = { doesEntryExist };
