const express = require('express');
const moment = require('moment');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/transactions', (req, res) => {
  const customers = ['Jim', 'Joe', 'Jack', 'Steve', 'Duke', 'Nick'];
  const transactions = [];

  for (let i = 0; i < 30; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const transaction = {
      custName: customer,
      date: moment().subtract(Math.floor(Math.random() * 90), 'days').format('MM/DD/YYYY'),
      transactionAmt: (Math.floor(Math.random() * 200) + 1).toString(),
      rewardPoints: 0
    };

    // calculate reward points
    const transactionAmt = parseInt(transaction.transactionAmt);
    if (transactionAmt > 100) {
      transaction.rewardPoints += (transactionAmt - 100) * 2;
      transaction.rewardPoints += 50;
    }
    if (transactionAmt > 50 & transactionAmt<=100) {
      transaction.rewardPoints += (transactionAmt - 50);
    }
    transactions.push(transaction);
  }

  // calculate total and monthly reward points for each customer
  const monthlyRewardPoints = {};
  const totalRewardPoints = {};

  transactions.forEach((transaction) => {
    const custName = transaction.custName;
    const month = moment(transaction.date, 'MM/DD/YYYY').format('MMMM YYYY');

    if (!monthlyRewardPoints[custName]) {
      monthlyRewardPoints[custName] = {};
    }

    if (!monthlyRewardPoints[custName][month]) {
      monthlyRewardPoints[custName][month] = 0;
    }

    if (!totalRewardPoints[custName]) {
      totalRewardPoints[custName] = 0;
    }

    monthlyRewardPoints[custName][month] += transaction.rewardPoints;
    totalRewardPoints[custName] += transaction.rewardPoints;
  });

  const result = {
    transactions,
    monthlyRewardPoints,
    totalRewardPoints
  };

  res.json(result);
});

module.exports = app;
