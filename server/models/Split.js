import mongoose from "mongoose";

const splitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    expenses: [
      {
        amount: { type: Number, required: true },
        description: { type: String },
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    total: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Split", splitSchema);
