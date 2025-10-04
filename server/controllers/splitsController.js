import Split from "../models/Split.js";
import User from "../models/User.js";

// Create a new trip/split
export const createSplit = async (req, res) => {
  try {
    const { title, participants } = req.body;

    if (!title || !participants || participants.length === 0)
      return res.status(400).json({ error: "Title and participants are required." });

    // Add the creator automatically if not in participants
    const createdBy = req.user._id;
    if (!participants.includes(createdBy.toString())) {
      participants.push(createdBy);
    }

    const newSplit = new Split({
      title,
      participants,
      createdBy,
      expenses: []
    });

    await newSplit.save();
    res.status(201).json(newSplit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create split." });
  }
};

// Get all trips where the logged-in user is a participant
export const getSplits = async (req, res) => {
  try {
    const userId = req.user._id;
    const splits = await Split.find({ participants: userId }).populate("participants", "name email");
    res.status(200).json(splits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch splits." });
  }
};

// Get details of a single trip including expenses
export const getSplitDetails = async (req, res) => {
  try {
    const split = await Split.findById(req.params.id)
      .populate("participants", "name email")
      .populate("expenses.paidBy", "name email");

    if (!split) return res.status(404).json({ error: "Split not found." });

    // Only allow participants to view
    if (!split.participants.some((p) => p._id.toString() === req.user._id.toString()))
      return res.status(403).json({ error: "Access denied." });

    res.status(200).json(split);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch split details." });
  }
};

// Add expense to a trip
export const addExpense = async (req, res) => {
  try {
    const { splitId, amount, description } = req.body;
    const userId = req.user._id;

    const split = await Split.findById(splitId);
    if (!split) return res.status(404).json({ error: "Split not found." });

    // Only participants can add expense
    if (!split.participants.includes(userId))
      return res.status(403).json({ error: "Access denied." });

    split.expenses.push({ amount, description, paidBy: userId });
    split.total = split.expenses.reduce((sum, e) => sum + e.amount, 0);

    await split.save();
    res.status(200).json(split);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expense." });
  }
};
