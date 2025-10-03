import Split from "../models/Split.js";

export const createSplit = async (req, res) => {
  try {
    const { title, total, participants } = req.body;
    const split = await Split.create({ userId: req.userId, title, total, participants });
    res.status(201).json(split);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSplits = async (req, res) => {
  try {
    const splits = await Split.find({ userId: req.userId });
    res.json(splits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
