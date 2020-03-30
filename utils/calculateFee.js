const calculateFee = (percentageItems, feeItems) => {
  const calculatedFeeItems = [];
  feeItems.forEach(fEl => {
    percentageItems.forEach(pEl => {
      if (pEl.title === fEl.title) {
        fEl.amount *= pEl.amount;
        calculatedFeeItems.push(fEl);
      }
    });
  });
  return calculatedFeeItems;
};

module.exports = calculateFee;
