import express from "express";
import Trip from "../models/Trip.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// Create a trip
router.post("/", async (req, res) => {
  try {
    const { title, participants, creator } = req.body;
    const trip = new Trip({
      title,
      createdBy: creator,
      participants: [creator, ...(participants || [])]
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add participant
router.post("/:tripId/join", async (req, res) => {
  try {
    const { userId } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    if (!trip.participants.includes(userId)) trip.participants.push(userId);
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add expense
router.post("/:tripId/expenses", async (req, res) => {
  try {
    const { description, amount, paidBy } = req.body;
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const expense = new Expense({ description, amount, paidBy });
    await expense.save();

    trip.expenses.push(expense._id);
    await trip.save();

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trip details
router.get("/:tripId", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate("participants", "name email")
      .populate("expenses");
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
