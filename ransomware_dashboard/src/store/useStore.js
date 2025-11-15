import {create} from 'zustand'

const useStore = create((set) => ({
  events: [],
  alerts: [],
  stats: {},
  addEvent: (e) => set(state => ({ events: [e, ...state.events].slice(0, 500) })),
  setEvents: (ev) => set({ events: ev }),
  addAlert: (a) => set(state => ({ alerts: [a, ...state.alerts].slice(0, 200) })),
  setStats: (s) => set({ stats: s }),
}))

export default useStore
