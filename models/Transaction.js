const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  datetime: { type: Date, default: Date.now },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
