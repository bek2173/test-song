"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { setFilters, clearFilters, fetchSongsRequest } from "@/lib/features/songs/songsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Filter } from "lucide-react"

export default function FilterSidebar() {
  const dispatch = useDispatch()
  const { filters, songs } = useSelector((state: RootState) => state.songs)
  const [localFilters, setLocalFilters] = useState(filters)

  // Get unique values for filter options
  interface Song {
    genre: string
    artist: string
    album: string
    [key: string]: any
  }

  interface Filters {
    genre: string
    artist: string
    album: string
  }

  const uniqueGenres: string[] = [...new Set((songs as Song[]).map((song: Song) => song.genre))].sort()
  const uniqueArtists: string[] = [...new Set((songs as Song[]).map((song: Song) => song.artist))].sort()
  const uniqueAlbums: string[] = [...new Set((songs as Song[]).map((song: Song) => song.album))].sort()

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    dispatch(setFilters(newFilters))
    dispatch(fetchSongsRequest())
  }

  const handleClearFilters = () => {
    setLocalFilters({ genre: "", artist: "", album: "" })
    dispatch(clearFilters())
    dispatch(fetchSongsRequest())
  }

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== "")

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="ml-auto h-6 px-2 text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="genre-filter" className="text-sm font-medium">
            Genre
          </Label>
          <Input
            id="genre-filter"
            placeholder="Filter by genre..."
            value={localFilters.genre}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
            className="h-8"
          />
          {uniqueGenres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {uniqueGenres.slice(0, 5).map((genre) => (
                <Button
                  key={genre}
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("genre", genre)}
                  className="h-6 px-2 text-xs"
                >
                  {genre}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="artist-filter" className="text-sm font-medium">
            Artist
          </Label>
          <Input
            id="artist-filter"
            placeholder="Filter by artist..."
            value={localFilters.artist}
            onChange={(e) => handleFilterChange("artist", e.target.value)}
            className="h-8"
          />
          {uniqueArtists.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {uniqueArtists.slice(0, 3).map((artist) => (
                <Button
                  key={artist}
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("artist", artist)}
                  className="h-6 px-2 text-xs"
                >
                  {artist}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="album-filter" className="text-sm font-medium">
            Album
          </Label>
          <Input
            id="album-filter"
            placeholder="Filter by album..."
            value={localFilters.album}
            onChange={(e) => handleFilterChange("album", e.target.value)}
            className="h-8"
          />
          {uniqueAlbums.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {uniqueAlbums.slice(0, 3).map((album) => (
                <Button
                  key={album}
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange("album", album)}
                  className="h-6 px-2 text-xs"
                >
                  {album}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
