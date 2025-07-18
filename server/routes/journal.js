const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Sentiment = require("sentiment");
const JournalEntry = require("../models/JournalEntry");

const sentiment = new Sentiment();

// Protected route to post a journal
router.post("/", verifyToken, async (req, res) => {
  try {
    const { text, selectedMood } = req.body;
    // console.log("📩 Incoming journal entry:", req.body);
    // console.log("🔐 Authenticated user:", req.auth?.payload?.sub);

    if (!req.auth?.payload?.sub) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const result = sentiment.analyze(text);
    const label =
      result.score > 1
        ? "positive"
        : result.score < -1
        ? "negative"
        : "neutral";

    const newEntry = new JournalEntry({
      userId: req.auth.payload.sub,
      text,
      selectedMood,
      sentimentScore: result.score,
      sentimentLabel: label,
    });

    await newEntry.save();
    // console.log("🔐 Authenticated user:", req.auth);
    res.status(201).json({ message: "Journal saved.", entry: newEntry });
  } catch (err) {
    // console.error("❌ Error in POST /journal:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// GET /api/journal - Fetch user's journal entries
router.get("/", verifyToken, async (req, res) => {
  try {
    // console.log("🔐 Token payload from middleware:", req.auth);

    const userId = req.auth?.payload?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const entries = await JournalEntry.find({ userId }).sort({ createdAt: -1 });
    // console.log("📄 Entries retrieved for:", userId);
    res.status(200).json(entries);
  } catch (err) {
    // console.error("❌ Error in GET /journal:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// DELETE /api/journal/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth?.payload.sub;

    const entry = await JournalEntry.findOneAndDelete({ _id: id, userId });

    if (!entry) return res.status(404).json({ error: "Entry not found" });

    res.status(200).json({ message: "Entry deleted" });
  } catch (err) {
    console.error("❌ Error in DELETE /journal/:id:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/journal/:id - Update a journal entry
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { text, selectedMood } = req.body;

    const result = sentiment.analyze(text);
    const sentimentLabel =
      result.score > 1
        ? "positive"
        : result.score < -1
        ? "negative"
        : "neutral";

    const updatedEntry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.payload.sub },
      {
        text,
        selectedMood,
        sentimentScore: result.score,
        sentimentLabel,
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: "Entry not found." });
    }

    res.json({ message: "Journal updated.", entry: updatedEntry });
  } catch (err) {
    console.error("❌ Error in PUT /journal/:id:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
