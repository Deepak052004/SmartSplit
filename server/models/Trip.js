import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Expense"
  }]
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
