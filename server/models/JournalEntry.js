const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    selectedMood: {
      type: String,
      enum: ["happy", "neutral", "sad"],
      required: true,
    },
    sentimentScore: {
      type: Number,
    },
    sentimentLabel: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JournalEntry", JournalEntrySchema);
