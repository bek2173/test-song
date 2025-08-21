const express = require("express")
const router = express.Router()
const Song = require("../models/Song")

// GET /api/songs - Get all songs
router.get("/", async (req, res) => {
  try {
    const { genre, artist, album } = req.query
    const filter = {}

    if (genre) filter.genre = new RegExp(genre, "i")
    if (artist) filter.artist = new RegExp(artist, "i")
    if (album) filter.album = new RegExp(album, "i")

    const songs = await Song.find(filter).sort({ createdAt: -1 })
    res.json(songs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET /api/songs/:id - Get single song
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
    if (!song) {
      return res.status(404).json({ message: "Song not found" })
    }
    res.json(song)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/songs - Create new song
router.post("/", async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body

    if (!title || !artist || !album || !genre) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const song = new Song({
      title,
      artist,
      album,
      genre,
    })

    const savedSong = await song.save()
    res.status(201).json(savedSong)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT /api/songs/:id - Update song
router.put("/:id", async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body

    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { title, artist, album, genre },
      { new: true, runValidators: true },
    )

    if (!song) {
      return res.status(404).json({ message: "Song not found" })
    }

    res.json(song)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE /api/songs/:id - Delete song
router.delete("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id)

    if (!song) {
      return res.status(404).json({ message: "Song not found" })
    }

    res.json({ message: "Song deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
