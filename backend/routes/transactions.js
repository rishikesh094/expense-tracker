const express = require("express");
const Transaction = require("../models/Transaction");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// GET all transactions for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST add transaction
router.post("/", verifyToken, async (req, res) => {
  const { amount, description, category, date } = req.body;
  if (!amount || !description || !category || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      description,
      category,
      date,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update transaction
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE transaction
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
