const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Create
router.post('/', async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ error: 'Not found' });
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!song) return res.status(404).json({ error: 'Not found' });
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;