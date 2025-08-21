"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Music, BarChart3, Play, Edit, Trash2, Filter, Loader2 } from "lucide-react"

interface Song {
  _id: string
  title: string
  artist: string
  album: string
  genre: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  totalSongs: number
  totalArtists: number
  totalAlbums: number
  totalGenres: number
  genreStats: Array<{
    genre: string
    count: number
    percentage: number
  }>
  artistStats: Array<{
    artist: string
    count: number
    percentage: number
  }>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("songs")
  const [songs, setSongs] = useState<Song[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch songs from API
  const fetchSongs = async (genreFilter?: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (genreFilter && genreFilter !== "All") {
        params.append("genre", genreFilter)
      }

      const queryString = params.toString()
      const url = `${API_BASE_URL}/songs${queryString ? `?${queryString}` : ""}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSongs(data)
    } catch (err) {
      console.error("Failed to fetch songs:", err)
      setError("Failed to fetch songs. Using demo data.")
      // Fallback to demo data
      setSongs([
        {
          _id: "1",
          title: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          genre: "Rock",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          _id: "2",
          title: "Hotel California",
          artist: "Eagles",
          album: "Hotel California",
          genre: "Rock",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          _id: "3",
          title: "Billie Jean",
          artist: "Michael Jackson",
          album: "Thriller",
          genre: "Pop",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch statistics from API
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Failed to fetch stats:", err)
      // Fallback to demo stats
      setStats({
        totalSongs: 3,
        totalArtists: 3,
        totalAlbums: 3,
        totalGenres: 2,
        genreStats: [
          { genre: "Rock", count: 2, percentage: 66.7 },
          { genre: "Pop", count: 1, percentage: 33.3 },
        ],
        artistStats: [
          { artist: "Queen", count: 1, percentage: 33.3 },
          { artist: "Eagles", count: 1, percentage: 33.3 },
          { artist: "Michael Jackson", count: 1, percentage: 33.3 },
        ],
      })
    } finally {
      setStatsLoading(false)
    }
  }

  // Delete song
  const deleteSong = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove from local state
      setSongs(songs.filter((song) => song._id !== songId))
      // Refresh stats
      fetchStats()

      // Show success message
      console.log("Song deleted successfully!")
    } catch (err) {
      console.error("Failed to delete song:", err)
      alert("Failed to delete song")
    }
  }

  useEffect(() => {
    fetchSongs()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchSongs(selectedGenre)
  }, [selectedGenre])

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const availableGenres = ["All", ...Array.from(new Set(songs.map((song) => song.genre)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Music className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Song Manager
                </h1>
                <p className="text-muted-foreground">Manage your music collection with style</p>
              </div>
            </div>
            {activeTab === "songs" && (
              <Button className="gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg">
                <Plus className="h-4 w-4" />
                Add Song
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card/50 backdrop-blur-sm">
            <TabsTrigger
              value="songs"
              className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Music className="h-4 w-4" />
              Songs
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="space-y-0">
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className="w-72 flex-shrink-0">
                <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Filter className="h-5 w-5 text-purple-500" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">Search</label>
                      <Input
                        placeholder="Search songs or artists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">Genre</label>
                      <div className="space-y-2">
                        {availableGenres.map((genre) => (
                          <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedGenre === genre
                                ? "bg-purple-500 text-white shadow-md"
                                : "bg-background/50 hover:bg-background/80 text-foreground"
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Songs ({filteredSongs.length}){loading && <Loader2 className="inline ml-2 h-5 w-5 animate-spin" />}
                  </h2>
                </div>

                {error && (
                  <Card className="mb-6 bg-yellow-500/10 border-yellow-500/20">
                    <CardContent className="p-4">
                      <p className="text-yellow-700">{error}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {filteredSongs.map((song) => (
                    <Card
                      key={song._id}
                      className="bg-card/50 backdrop-blur-sm border-border/40 hover:bg-card/70 transition-all duration-200 hover:shadow-lg"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                              <Music className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-lg">{song.title}</h3>
                              <p className="text-muted-foreground">
                                {song.artist} • {song.album}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge
                              variant="secondary"
                              className="bg-purple-500/10 text-purple-700 border-purple-500/20"
                            >
                              {song.genre}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-500/10">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-purple-500/10">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => deleteSong(song._id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {!loading && filteredSongs.length === 0 && (
                    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                      <CardContent className="p-12 text-center">
                        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No songs found</h3>
                        <p className="text-muted-foreground">
                          {searchTerm || selectedGenre !== "All"
                            ? "Try adjusting your filters"
                            : "Add your first song to get started"}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </main>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-0">
            <div className="grid gap-6">
              {statsLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              )}

              {stats && !statsLoading && (
                <>
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { title: "Total Songs", value: stats.totalSongs, icon: Music },
                      { title: "Artists", value: stats.totalArtists, icon: Music },
                      { title: "Albums", value: stats.totalAlbums, icon: Music },
                      { title: "Genres", value: stats.totalGenres, icon: Music },
                    ].map((stat, index) => (
                      <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.title}</p>
                              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                              <stat.icon className="h-6 w-6 text-purple-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Genre Breakdown */}
                  {stats.genreStats && stats.genreStats.length > 0 && (
                    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                      <CardHeader>
                        <CardTitle className="text-xl">Genre Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stats.genreStats.map((genre) => (
                            <div key={genre.genre} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                                <span className="font-medium">{genre.genre}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-32 bg-muted rounded-full h-2">
                                  <div
                                    className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                                    style={{ width: `${genre.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground w-16 text-right">
                                  {genre.count} ({genre.percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
