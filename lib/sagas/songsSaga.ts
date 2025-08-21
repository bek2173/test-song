import { call, put, takeEvery, select } from "redux-saga/effects"
import type { PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import {
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
  type Song,
} from "../features/songs/songsSlice"
import type { RootState } from "../store"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

function* fetchSongsSaga(): Generator<any, void, any> {
  try {
    const filters: RootState["songs"]["filters"] = yield select((state: RootState) => state.songs.filters)

    const params = new URLSearchParams()
    if (filters.genre) params.append("genre", filters.genre)
    if (filters.artist) params.append("artist", filters.artist)
    if (filters.album) params.append("album", filters.album)

    const queryString = params.toString()
    const url = `${API_BASE_URL}/songs${queryString ? `?${queryString}` : ""}`

    const response = yield call(axios.get, url)
    yield put(fetchSongsSuccess(response.data))
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to fetch songs"
    yield put(fetchSongsFailure(message))
    yield put({ type: "SHOW_TOAST", payload: { title: "Error", description: message, variant: "destructive" } })
  }
}

function* createSongSaga(
  action: PayloadAction<Omit<Song, "_id" | "createdAt" | "updatedAt">>,
): Generator<any, void, any> {
  try {
    const response = yield call(axios.post, `${API_BASE_URL}/songs`, action.payload)
    yield put(createSongSuccess(response.data))
    yield put({
      type: "SHOW_TOAST",
      payload: { title: "Success", description: "Song added successfully!", variant: "success" },
    })
    // Refresh stats after creating a song
    yield put({ type: "stats/fetchStatsRequest" })
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to create song"
    yield put(createSongFailure(message))
    yield put({ type: "SHOW_TOAST", payload: { title: "Error", description: message, variant: "destructive" } })
  }
}

function* updateSongSaga(action: PayloadAction<Song>): Generator<any, void, any> {
  try {
    const response = yield call(axios.put, `${API_BASE_URL}/songs/${action.payload._id}`, action.payload)
    yield put(updateSongSuccess(response.data))
    yield put({
      type: "SHOW_TOAST",
      payload: { title: "Success", description: "Song updated successfully!", variant: "success" },
    })
    // Refresh stats after updating a song
    yield put({ type: "stats/fetchStatsRequest" })
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to update song"
    yield put(updateSongFailure(message))
    yield put({ type: "SHOW_TOAST", payload: { title: "Error", description: message, variant: "destructive" } })
  }
}

function* deleteSongSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    yield call(axios.delete, `${API_BASE_URL}/songs/${action.payload}`)
    yield put(deleteSongSuccess(action.payload))
    yield put({
      type: "SHOW_TOAST",
      payload: { title: "Success", description: "Song deleted successfully!", variant: "success" },
    })
    // Refresh stats after deleting a song
    yield put({ type: "stats/fetchStatsRequest" })
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to delete song"
    yield put(deleteSongFailure(message))
    yield put({ type: "SHOW_TOAST", payload: { title: "Error", description: message, variant: "destructive" } })
  }
}

export default function* songsSaga() {
  yield takeEvery(fetchSongsRequest.type, fetchSongsSaga)
  yield takeEvery(createSongRequest.type, createSongSaga)
  yield takeEvery(updateSongRequest.type, updateSongSaga)
  yield takeEvery(deleteSongRequest.type, deleteSongSaga)
}
