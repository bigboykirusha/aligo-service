import { createUserState, normalizeFavoriteId } from './shared'

export { createUserState }

export const userGetters = {
   hasFavorite: (state) => (itemId) => {
      const normalizedId = normalizeFavoriteId(itemId)
      return (
         normalizedId !== null && state.favoritesItems.includes(normalizedId)
      )
   },
   isFavoritePending: (state) => (itemId) => {
      const normalizedId = normalizeFavoriteId(itemId)
      return (
         normalizedId !== null &&
         state.favoritesPendingItemIds.includes(normalizedId)
      )
   }
}
