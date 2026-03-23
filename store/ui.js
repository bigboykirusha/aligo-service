import { defineStore } from 'pinia'

const canUseDom = () =>
   import.meta.client && typeof document !== 'undefined' && typeof window !== 'undefined'

const isMobileViewport = () => {
   if (!canUseDom()) return false
   return window.matchMedia('(max-width: 768px)').matches
}

export const useUiStore = defineStore('ui', {
   state: () => ({
      isBurgerOpen: false,
      isUserMenuOpen: false,
      showDropdown: false,
      activeDropdownId: null,
      scrollLocks: new Set()
   }),
   getters: {
      overlaysCount(state) {
         return state.scrollLocks.size
      }
   },
   actions: {
      lockScroll(reason = 'default') {
         if (!canUseDom()) return
         if (!isMobileViewport()) return
         if (!this.scrollLocks.has(reason)) {
            this.scrollLocks.add(reason)
         }
         if (this.scrollLocks.size === 1) {
            document.body.classList.add('no-scroll')
         }
      },
      unlockScroll(reason = 'default') {
         if (!canUseDom()) return
         if (this.scrollLocks.has(reason)) {
            this.scrollLocks.delete(reason)
         }
         if (this.scrollLocks.size === 0) {
            document.body.classList.remove('no-scroll')
         }
      },
      setFloatingDropdownState(show, id = null) {
         this.activeDropdownId = show ? id : null
      },
      clearFloatingDropdown(id = null) {
         if (id == null || this.activeDropdownId === id) {
            this.activeDropdownId = null
         }
      },
      toggleBurger() {
         this.isBurgerOpen = !this.isBurgerOpen
      },
      openBurger() {
         if (!this.isBurgerOpen) {
            this.isBurgerOpen = true
         }
      },
      closeBurger() {
         if (this.isBurgerOpen) {
            this.isBurgerOpen = false
         }
      },
      toggleUserMenu() {
         this.isUserMenuOpen = !this.isUserMenuOpen
      },
      openUserMenu() {
         if (!this.isUserMenuOpen) {
            this.isUserMenuOpen = true
         }
      },
      closeUserMenu() {
         if (this.isUserMenuOpen) {
            this.isUserMenuOpen = false
         }
      },
      toggleDropdown(id = null) {
         const nextState = !this.showDropdown
         this.setDropdownState(nextState, id)
      },
      setDropdownState(show, id = null) {
         // Backward-compatible API: the header/catalog dropdown does not use ids.
         // Floating controls (selects/tooltips) must use setFloatingDropdownState().
         if (id !== null) {
            this.setFloatingDropdownState(show, id)
            return
         }
         this.showDropdown = show
      },
      closeAllOverlays() {
         this.isBurgerOpen = false
         this.isUserMenuOpen = false
         this.showDropdown = false
         this.activeDropdownId = null
         this.scrollLocks.clear()
         if (canUseDom()) {
            document.body.classList.remove('no-scroll')
         }
      }
   }
})
