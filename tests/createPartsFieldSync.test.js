import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useCreatePartsFieldSync } from '../composables/create/parts/useCreatePartsFieldSync'

describe('useCreatePartsFieldSync', () => {
   it('clears scalar fields and option fields', () => {
      const state = {
         first: 1,
         second: 2,
         optionA: 10,
         optionB: 20
      }
      const updateField = (field, value) => {
         state[field] = value
      }
      const { clearFields, clearOptionFields } = useCreatePartsFieldSync(updateField)

      clearFields(['first', 'second'])
      clearOptionFields([{ field: 'optionA' }, { field: 'optionB' }])

      expect(state).toEqual({
         first: null,
         second: null,
         optionA: null,
         optionB: null
      })
   })

   it('runs reset callback only when watched source is false', async () => {
      const enabled = ref(false)
      const calls = []
      const { watchWhenFalseReset } = useCreatePartsFieldSync(() => {})

      const stop = watchWhenFalseReset(() => enabled.value, () => {
         calls.push('reset')
      })

      await nextTick()
      expect(calls).toHaveLength(1)

      enabled.value = true
      await nextTick()
      expect(calls).toHaveLength(1)

      enabled.value = false
      await nextTick()
      expect(calls).toHaveLength(2)

      stop()
   })

   it('keeps defect flags mutually exclusive with "none"', () => {
      const state = {
         none: 0,
         scratch: 0,
         crack: 0
      }
      const updateField = (field, value) => {
         state[field] = value
      }

      const { createExclusiveDefectUpdater } = useCreatePartsFieldSync(updateField)
      const updateDefect = createExclusiveDefectUpdater({
         noneField: 'none',
         defectOptions: [
            { field: 'none' },
            { field: 'scratch' },
            { field: 'crack' }
         ]
      })

      updateDefect('none', 1)
      expect(state).toEqual({
         none: 1,
         scratch: 0,
         crack: 0
      })

      updateDefect('scratch', 1)
      expect(state).toEqual({
         none: 0,
         scratch: 1,
         crack: 0
      })

      updateDefect('scratch', 0)
      expect(state).toEqual({
         none: 0,
         scratch: 0,
         crack: 0
      })
   })
})
