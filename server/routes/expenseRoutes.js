import express from "express";
import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();


// ✅ Add an expense to a trip
router.post("/:tripId", authMiddleware, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const { tripId } = req.params;

    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // Check if user is a member of the trip
    if (!trip.members.includes(req.user.id)) {
      return res.status(403).json({ error: "You are not a member of this trip" });
    }

    // Create expense
    const expense = await Expense.create({
      tripId,
      paidBy: req.user.id,
      amount,
      description
    });

    // Add expense to trip
    trip.expenses.push(expense._id);
    await trip.save();

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get all expenses of a trip
router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId })
      .populate("paidBy", "name email");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
