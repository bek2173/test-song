const express = require("express")
const router = express.Router()
const Song = require("../models/Song")

// GET /api/stats - Get comprehensive statistics
router.get("/", async (req, res) => {
  try {
    // Total counts
    const totalSongs = await Song.countDocuments()
    const totalArtists = await Song.distinct("artist").then((artists) => artists.length)
    const totalAlbums = await Song.distinct("album").then((albums) => albums.length)
    const totalGenres = await Song.distinct("genre").then((genres) => genres.length)

    // Songs by genre
    const songsByGenre = await Song.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Songs and albums by artist
    const songsByArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          songCount: { $sum: 1 },
          albums: { $addToSet: "$album" },
        },
      },
      {
        $project: {
          artist: "$_id",
          songCount: 1,
          albumCount: { $size: "$albums" },
          albums: 1,
        },
      },
      { $sort: { songCount: -1 } },
    ])

    // Songs by album
    const songsByAlbum = await Song.aggregate([
      {
        $group: {
          _id: { album: "$album", artist: "$artist" },
          songCount: { $sum: 1 },
        },
      },
      {
        $project: {
          album: "$_id.album",
          artist: "$_id.artist",
          songCount: 1,
        },
      },
      { $sort: { songCount: -1 } },
    ])

    // Genre distribution
    const genreDistribution = await Song.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $project: {
          genre: "$_id",
          count: 1,
          percentage: {
            $multiply: [{ $divide: ["$count", totalSongs] }, 100],
          },
        },
      },
    ])

    res.json({
      overview: {
        totalSongs,
        totalArtists,
        totalAlbums,
        totalGenres,
      },
      songsByGenre: songsByGenre.map((item) => ({
        genre: item._id,
        count: item.count,
      })),
      songsByArtist: songsByArtist.map((item) => ({
        artist: item.artist,
        songCount: item.songCount,
        albumCount: item.albumCount,
        albums: item.albums,
      })),
      songsByAlbum: songsByAlbum.map((item) => ({
        album: item.album,
        artist: item.artist,
        songCount: item.songCount,
      })),
      genreDistribution: genreDistribution.map((item) => ({
        genre: item.genre,
        count: item.count,
        percentage: Math.round(item.percentage * 100) / 100,
      })),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
