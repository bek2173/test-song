import { all, takeEvery } from "redux-saga/effects"
import songsSaga from "./songsSaga"
import statsSaga from "./statsSaga"

function* toastSaga() {
  // This saga can be extended to handle toast notifications
  // For now, it's a placeholder that can be used by other sagas
}

function* showToastSaga(action: any) {
  // Toast notifications are handled by the ToastProvider
  // This saga is here for future extensions
}

export default function* rootSaga() {
  yield all([songsSaga(), statsSaga(), takeEvery("SHOW_TOAST", showToastSaga)])
}
