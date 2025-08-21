import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Song {
  _id: string
  title: string
  artist: string
  album: string
  genre: string
  createdAt: string
  updatedAt: string
}

export interface SongsState {
  songs: Song[]
  loading: boolean
  error: string | null
  filters: {
    genre: string
    artist: string
    album: string
  }
}

const initialState: SongsState = {
  songs: [],
  loading: false,
  error: null,
  filters: {
    genre: "",
    artist: "",
    album: "",
  },
}

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // Fetch songs actions
    fetchSongsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.loading = false
      state.songs = action.payload
      state.error = null
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Create song actions
    createSongRequest: (state, action: PayloadAction<Omit<Song, "_id" | "createdAt" | "updatedAt">>) => {
      state.loading = true
      state.error = null
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false
      state.songs.unshift(action.payload)
      state.error = null
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Update song actions
    updateSongRequest: (state, action: PayloadAction<Song>) => {
      state.loading = true
      state.error = null
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false
      const index = state.songs.findIndex((song) => song._id === action.payload._id)
      if (index !== -1) {
        state.songs[index] = action.payload
      }
      state.error = null
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Delete song actions
    deleteSongRequest: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.songs = state.songs.filter((song) => song._id !== action.payload)
      state.error = null
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Filter actions
    setFilters: (state, action: PayloadAction<Partial<SongsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        genre: "",
        artist: "",
        album: "",
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  setFilters,
  clearFilters,
  clearError,
} = songsSlice.actions

export default songsSlice.reducer
