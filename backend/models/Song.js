const mongoose = require("mongoose")

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    album: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
songSchema.index({ artist: 1 })
songSchema.index({ album: 1 })
songSchema.index({ genre: 1 })

module.exports = mongoose.model("Song", songSchema)
