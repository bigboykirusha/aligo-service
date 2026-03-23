import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    modals: {}
  }),
  getters: {
    isVisible: (state) => (id) => Boolean(state.modals[id]?.visible),
    payload: (state) => (id) => state.modals[id]?.payload || {}
  },
  actions: {
    open(id, payload = {}) {
      this.modals[id] = {
        visible: true,
        payload: { ...payload }
      }
    },
    close(id) {
      if (this.modals[id]) {
        this.modals[id].visible = false
      }
    },
    toggle(id) {
      const current = this.modals[id]?.visible || false
      if (!this.modals[id]) {
        this.modals[id] = { visible: !current, payload: {} }
      } else {
        this.modals[id].visible = !current
      }
    },
    setPayload(id, payload = {}) {
      if (!this.modals[id]) {
        this.modals[id] = { visible: false, payload: {} }
      }
      this.modals[id].payload = { ...payload }
    },
    reset(id) {
      if (this.modals[id]) {
        delete this.modals[id]
      }
    }
  }
})
