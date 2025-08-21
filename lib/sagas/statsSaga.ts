import { call, put, takeEvery } from "redux-saga/effects"
import axios from "axios"
import { fetchStatsRequest, fetchStatsSuccess, fetchStatsFailure } from "../features/stats/statsSlice"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

function* fetchStatsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(axios.get, `${API_BASE_URL}/stats`)
    yield put(fetchStatsSuccess(response.data))
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Failed to fetch statistics"
    yield put(fetchStatsFailure(message))
    yield put({ type: "SHOW_TOAST", payload: { title: "Error", description: message, variant: "destructive" } })
  }
}

export default function* statsSaga() {
  yield takeEvery(fetchStatsRequest.type, fetchStatsSaga)
}
