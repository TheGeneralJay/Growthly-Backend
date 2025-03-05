const changeAvailability = (loan, available) => {
  loan.available = available;

  loan.save();

  return loan;
};

module.exports = { changeAvailability };
