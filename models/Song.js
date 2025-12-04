const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  year: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);