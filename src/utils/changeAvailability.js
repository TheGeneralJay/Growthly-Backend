const changeAvailability = (loan, available) => {
  console.log(loan);
  console.log(available);

  loan.available = available;

  loan.save();

  return loan;
};

module.exports = { changeAvailability };
