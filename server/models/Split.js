const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  payer: { type: String, required: true },
  participants: [{ type: String, required: true }] // participants sharing this expense
});

const splitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  total: { type: Number, default: 0 },
  participants: [{ type: String, required: true }],
  expenses: [expenseSchema],
  balances: { type: Map, of: Number, default: {} } // participant balances
}, { timestamps: true });

module.exports = mongoose.model("Split", splitSchema);
