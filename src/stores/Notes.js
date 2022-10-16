import { defineStore } from 'pinia'
import { useTunerStore } from "stores/Tuner";
const tuner = useTunerStore()
export const useCounterStore = defineStore('counter', {
  state: () => ({
    tuner: tuner,
    isAutoMode: true,
    
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {

  }
})
