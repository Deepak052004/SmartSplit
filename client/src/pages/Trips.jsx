import express from "express";
import Trip from "../models/Trip.js";
import Expense from "../models/Expense.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();


// 🔹 Helper function to calculate settlements
function calculateSettlements(balances) {
  let debtors = [];
  let creditors = [];

  for (let userId in balances) {
    if (balances[userId] < 0) {
      debtors.push({ userId, amount: -balances[userId] });
    } else if (balances[userId] > 0) {
      creditors.push({ userId, amount: balances[userId] });
    }
  }

  let settlements = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    let minAmount = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      from: debtors[i].userId,
      to: creditors[j].userId,
      amount: minAmount
    });

    debtors[i].amount -= minAmount;
    creditors[j].amount -= minAmount;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return settlements;
}


// ✅ Create a trip
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    const trip = await Trip.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Join a trip
router.put("/:id/join", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    if (!trip.members.includes(req.user.id)) {
      trip.members.push(req.user.id);
      await trip.save();
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ List all trips for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ members: req.user.id });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get balances + settlements with names
router.get("/:id/balance", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("members", "name email");
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const expenses = await Expense.find({ tripId: req.params.id });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const share = trip.members.length > 0 ? total / trip.members.length : 0;

    let balances = {};
    trip.members.forEach(m => balances[m._id] = -share);
    expenses.forEach(e => { balances[e.paidBy] += e.amount; });

    const settlements = calculateSettlements(balances);

    // Map IDs to names
    const userMap = {};
    trip.members.forEach(m => { userMap[m._id] = m.name; });

    const balancesWithNames = {};
    for (let id in balances) balancesWithNames[userMap[id]] = balances[id];

    const settlementsWithNames = settlements.map(s => ({
      from: userMap[s.from],
      to: userMap[s.to],
      amount: s.amount
    }));

    res.json({
      total,
      share,
      balances: balancesWithNames,
      settlements: settlementsWithNames
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
