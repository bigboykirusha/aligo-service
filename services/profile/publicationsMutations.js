export const normalizePublicationMutationIds = (ids = []) =>
   [
      ...new Set(
         (Array.isArray(ids) ? ids : [])
            .map((id) => Number(id))
            .filter((id) => Number.isFinite(id) && id > 0)
      )
   ]

export const mutatePublicationItems = (items = [], mutation) => {
   const normalizedItems = Array.isArray(items) ? items : []

   if (!mutation || typeof mutation !== 'object') {
      return normalizedItems
   }

   const ids = normalizePublicationMutationIds(mutation.ids)
   if (!ids.length) {
      return normalizedItems
   }

   if (mutation.type === 'remove') {
      return normalizedItems.filter((ad) => !ids.includes(Number(ad.id)))
   }

   if (mutation.type === 'set-published') {
      const nextPublished = Number(mutation.value) === 1 ? 1 : 0
      return normalizedItems.map((ad) => {
         if (!ids.includes(Number(ad.id))) return ad
         return {
            ...ad,
            is_published: nextPublished,
            is_in_archive: 0,
            is_moderation: 0
         }
      })
   }

   if (mutation.type === 'set-moderation') {
      return normalizedItems.map((ad) => {
         if (!ids.includes(Number(ad.id))) return ad
         return {
            ...ad,
            is_published: 0,
            is_in_archive: 0,
            is_moderation: 1
         }
      })
   }

   if (mutation.type === 'set-closed') {
      return normalizedItems.map((ad) => {
         if (!ids.includes(Number(ad.id))) return ad
         return {
            ...ad,
            is_closed: 1,
            is_published: 0,
            is_in_archive: 0,
            is_moderation: 0
         }
      })
   }

   return normalizedItems
}

export const resolvePublicationLocalMutation = (
   { pageType = '', orderBy = 'all' } = {},
   payload
) => {
   if (!payload || typeof payload !== 'object') {
      return { type: 'refresh' }
   }

   const ids = normalizePublicationMutationIds(payload.ids)
   if (!ids.length) {
      return null
   }

   const normalizedPageType = String(pageType || '')
   const normalizedOrderBy = String(orderBy ?? 'all')

   if (payload.type === 'unpublish') {
      if (normalizedPageType === 'all' && normalizedOrderBy === '1') {
         return { type: 'remove', ids }
      }

      return { type: 'set-published', ids, value: 0 }
   }

   if (payload.type === 'republish') {
      if (normalizedPageType === 'all' && normalizedOrderBy === '0') {
         return { type: 'remove', ids }
      }

      return { type: 'set-moderation', ids, value: 1 }
   }

   if (payload.type === 'close') {
      if (normalizedPageType === 'all' && normalizedOrderBy === '1') {
         return { type: 'remove', ids }
      }

      return { type: 'set-closed', ids, value: 1 }
   }

   return { type: 'refresh' }
}
