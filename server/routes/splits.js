import express from "express";
import { createSplit, getSplits, addExpense, getSplitDetails } from "../controllers/splitsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // make sure this path is correct

const router = express.Router();

// Auth-protected routes
router.post("/", authMiddleware, createSplit);       // Create trip
router.get("/", authMiddleware, getSplits);          // Get all trips for logged-in user
router.get("/:id", authMiddleware, getSplitDetails); // Get details of one trip
router.post("/expense", authMiddleware, addExpense); // Add expense to a trip

export default router;
