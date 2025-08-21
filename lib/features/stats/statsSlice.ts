import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface StatsOverview {
  totalSongs: number
  totalArtists: number
  totalAlbums: number
  totalGenres: number
}

export interface GenreStats {
  genre: string
  count: number
  percentage?: number
}

export interface ArtistStats {
  artist: string
  songCount: number
  albumCount: number
  albums: string[]
}

export interface AlbumStats {
  album: string
  artist: string
  songCount: number
}

export interface StatsData {
  overview: StatsOverview
  songsByGenre: GenreStats[]
  songsByArtist: ArtistStats[]
  songsByAlbum: AlbumStats[]
  genreDistribution: GenreStats[]
}

export interface StatsState {
  data: StatsData | null
  loading: boolean
  error: string | null
}

const initialState: StatsState = {
  data: null,
  loading: false,
  error: null,
}

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    fetchStatsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchStatsSuccess: (state, action: PayloadAction<StatsData>) => {
      state.loading = false
      state.data = action.payload
      state.error = null
    },
    fetchStatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    clearStatsError: (state) => {
      state.error = null
    },
  },
})

export const { fetchStatsRequest, fetchStatsSuccess, fetchStatsFailure, clearStatsError } = statsSlice.actions

export default statsSlice.reducer
