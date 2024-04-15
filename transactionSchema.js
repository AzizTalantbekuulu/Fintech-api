const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;