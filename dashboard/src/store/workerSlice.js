import { createSlice } from '@reduxjs/toolkit'
import { WORKERS } from '../services/workers'

const workerSlice = createSlice({
  name: 'workers',
  initialState: {
    list: WORKERS,
    selectedId: null,
  },
  reducers: {
    nudgeWorkers(state) {
      state.list = state.list.map((w) => {
        if (w.status === 'inactive') return w
        const delta = () => (Math.random() - 0.5) * 0.0012
        return {
          ...w,
          lat: parseFloat((w.lat + delta()).toFixed(6)),
          lng: parseFloat((w.lng + delta()).toFixed(6)),
        }
      })
    },
    selectWorker(state, action) {
      state.selectedId = action.payload
    },
    clearSelection(state) {
      state.selectedId = null
    },
  },
})

export const { nudgeWorkers, selectWorker, clearSelection } = workerSlice.actions
export default workerSlice.reducer
