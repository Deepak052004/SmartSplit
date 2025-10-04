import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Trip", tripSchema);
