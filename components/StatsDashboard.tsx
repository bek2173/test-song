"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Music, Users, Album, Disc3 } from "lucide-react"
import GenreChart from "./GenreChart"
import ArtistChart from "./ArtistChart"

interface ArtistStats {
  artist: string
  albumCount: number
  songCount: number
}

export default function StatsDashboard() {
  const { data: stats, loading, error } = useSelector((state: RootState) => state.stats)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <h3 className="mb-2 text-lg font-semibold text-foreground">No statistics available</h3>
        <p className="text-muted-foreground">Add some songs to see statistics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.overview.totalSongs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{stats.overview.totalArtists}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Albums</CardTitle>
            <Album className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{stats.overview.totalAlbums}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genres</CardTitle>
            <Disc3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{stats.overview.totalGenres}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GenreChart data={stats.genreDistribution} />
        <ArtistChart data={stats.songsByArtist.slice(0, 10)} />
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.songsByArtist.slice(0, 8).map((artist: ArtistStats, index: number) => (
                <div key={artist.artist} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{artist.artist}</p>
                      <p className="text-xs text-muted-foreground">{artist.albumCount} albums</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{artist.songCount} songs</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Albums */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Album className="h-5 w-5" />
              Top Albums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                {stats.songsByAlbum.slice(0, 8).map(
                (
                  album: {
                  album: string
                  artist: string
                  songCount: number
                  },
                  index: number
                ) => (
                  <div key={`${album.album}-${album.artist}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-2/10 text-xs font-medium text-chart-2">
                    {index + 1}
                    </div>
                    <div>
                    <p className="font-medium text-foreground">{album.album}</p>
                    <p className="text-xs text-muted-foreground">by {album.artist}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{album.songCount} songs</Badge>
                  </div>
                )
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Genre Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Disc3 className="h-5 w-5" />
            Genre Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.songsByGenre.map(     
              (
              genre: { genre: string; count: number },
              index: number
              ) => (
              <div key={genre.genre} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                  backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                  }}
                />
                <span className="font-medium text-foreground">{genre.genre}</span>
                </div>
                <Badge variant="outline">{genre.count}</Badge>
              </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
