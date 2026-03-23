import { describe, expect, it } from 'vitest'

import {
   mutatePublicationItems,
   normalizePublicationMutationIds,
   resolvePublicationLocalMutation
} from '../services/profile/publicationsMutations'

const itemsFixture = [
   {
      id: 1,
      is_published: 1,
      is_moderation: 0,
      is_in_archive: 0,
      is_closed: 0
   },
   {
      id: 2,
      is_published: 0,
      is_moderation: 0,
      is_in_archive: 1,
      is_closed: 0
   }
]

describe('publicationsMutations', () => {
   it('normalizes and deduplicates mutation ids', () => {
      expect(normalizePublicationMutationIds(['1', 2, '2', 0, null, 'abc'])).toEqual([1, 2])
   })

   it('removes items for published filter after unpublish', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: '1' },
            { type: 'unpublish', ids: ['1'] }
         )
      ).toEqual({ type: 'remove', ids: [1] })
   })

   it('marks item as unpublished outside published-only filter', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: 'all' },
            { type: 'unpublish', ids: ['1'] }
         )
      ).toEqual({ type: 'set-published', ids: [1], value: 0 })
   })

   it('removes items for unpublished filter after republish', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: '0' },
            { type: 'republish', ids: [1] }
         )
      ).toEqual({ type: 'remove', ids: [1] })
   })

   it('moves republished items to moderation when current filter keeps them visible', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'drafts', orderBy: 'all' },
            { type: 'republish', ids: [1] }
         )
      ).toEqual({ type: 'set-moderation', ids: [1], value: 1 })
   })

   it('removes items for published filter after close', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: '1' },
            { type: 'close', ids: [1] }
         )
      ).toEqual({ type: 'remove', ids: [1] })
   })

   it('marks item as closed outside published-only filter', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: 'all' },
            { type: 'close', ids: [1] }
         )
      ).toEqual({ type: 'set-closed', ids: [1], value: 1 })
   })

   it('requests refresh for unknown payload types', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: 'all' },
            { type: 'unknown', ids: [1] }
         )
      ).toEqual({ type: 'refresh' })
   })

   it('returns null when payload ids are invalid', () => {
      expect(
         resolvePublicationLocalMutation(
            { pageType: 'all', orderBy: 'all' },
            { type: 'unpublish', ids: [0, 'x'] }
         )
      ).toBeNull()
   })

   it('applies remove mutation to publication items', () => {
      expect(mutatePublicationItems(itemsFixture, { type: 'remove', ids: [1] })).toEqual([
         itemsFixture[1]
      ])
   })

   it('applies set-published mutation to publication items', () => {
      expect(
         mutatePublicationItems(itemsFixture, {
            type: 'set-published',
            ids: [2],
            value: 1
         })
      ).toEqual([
         itemsFixture[0],
         {
            ...itemsFixture[1],
            is_published: 1,
            is_in_archive: 0,
            is_moderation: 0
         }
      ])
   })

   it('applies set-moderation mutation to publication items', () => {
      expect(
         mutatePublicationItems(itemsFixture, {
            type: 'set-moderation',
            ids: [1]
         })
      ).toEqual([
         {
            ...itemsFixture[0],
            is_published: 0,
            is_in_archive: 0,
            is_moderation: 1
         },
         itemsFixture[1]
      ])
   })

   it('applies set-closed mutation to publication items', () => {
      expect(
         mutatePublicationItems(itemsFixture, {
            type: 'set-closed',
            ids: [1]
         })
      ).toEqual([
         {
            ...itemsFixture[0],
            is_closed: 1,
            is_published: 0,
            is_in_archive: 0,
            is_moderation: 0
         },
         itemsFixture[1]
      ])
   })
})
