import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import songsReducer from "./features/songs/songsSlice"
import statsReducer from "./features/stats/statsSlice"
import rootSaga from "./sagas/rootSaga"

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    songs: songsReducer,
    stats: statsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
