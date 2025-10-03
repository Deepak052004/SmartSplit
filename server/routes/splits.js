const express = require("express");
const router = express.Router();
const Split = require("../models/Split");

// ---------------------------
// GET all splits (with balances)
// ---------------------------
router.get("/", async (req, res) => {
  try {
    const splits = await Split.find();

    // Calculate balances for each split
    const splitsWithBalances = splits.map((split) => {
      const balances = {};
      split.participants.forEach((p) => (balances[p] = 0));

      split.expenses.forEach((exp) => {
        const share = exp.amount / split.participants.length;
        split.participants.forEach((p) => {
          if (p === exp.payer) {
            balances[p] += exp.amount - share;
          } else {
            balances[p] -= share;
          }
        });
      });

      return { ...split.toObject(), balances };
    });

    res.json(splitsWithBalances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------
// GET single split by ID
// ---------------------------
router.get("/:id", async (req, res) => {
  try {
    const split = await Split.findById(req.params.id);
    if (!split) return res.status(404).json({ message: "Split not found" });

    // Calculate balances
    const balances = {};
    split.participants.forEach((p) => (balances[p] = 0));
    split.expenses.forEach((exp) => {
      const share = exp.amount / split.participants.length;
      split.participants.forEach((p) => {
        if (p === exp.payer) {
          balances[p] += exp.amount - share;
        } else {
          balances[p] -= share;
        }
      });
    });

    res.json({ ...split.toObject(), balances });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------------------
// CREATE a new split
// ---------------------------
router.post("/", async (req, res) => {
  const { title, total = 0, participants = [], expenses = [] } = req.body;

  const split = new Split({
    title,
    total,
    participants,
    expenses,
  });

  try {
    const newSplit = await split.save();
    res.status(201).json(newSplit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// DELETE a split (trip)
router.delete("/:id", async (req, res) => {
  try {
    const split = await Split.findById(req.params.id);
    if (!split) return res.status(404).json({ message: "Split not found" });

    await split.deleteOne();
    res.json({ message: "Split deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an expense from a split
router.delete("/:id/expenses/:expenseId", async (req, res) => {
  try {
    const split = await Split.findById(req.params.id);
    if (!split) return res.status(404).json({ message: "Split not found" });

    split.expenses = split.expenses.filter(
      (exp) => exp._id.toString() !== req.params.expenseId
    );

    // Recalculate total
    split.total = split.expenses.reduce((sum, e) => sum + e.amount, 0);

    const updatedSplit = await split.save();
    res.json(updatedSplit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ---------------------------
// ADD expense to a split
// ---------------------------
router.post("/:id/expenses", async (req, res) => {
  const { description, amount, payer } = req.body;

  if (!description || !amount || !payer) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const split = await Split.findById(req.params.id);
    if (!split) return res.status(404).json({ message: "Split not found" });

    split.expenses.push({ description, amount, payer });
    split.total += amount;

    const updatedSplit = await split.save();

    // Calculate balances after adding expense
    const balances = {};
    split.participants.forEach((p) => (balances[p] = 0));
    split.expenses.forEach((exp) => {
      const share = exp.amount / split.participants.length;
      split.participants.forEach((p) => {
        if (p === exp.payer) {
          balances[p] += exp.amount - share;
        } else {
          balances[p] -= share;
        }
      });
    });

    res.json({ ...updatedSplit.toObject(), balances });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
