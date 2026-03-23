import { describe, expect, it } from 'vitest'
import { buildReportInitialSections, buildReportSections, buildReportSummary } from '../services/report/sections.js'

describe('report section builders', () => {
   it('creates stable placeholder section list', () => {
      const sections = buildReportInitialSections()

      expect(sections.length).toBe(17)
      expect(sections[0]?.id).toBe('pts-data')
      expect(sections[sections.length - 1]?.id).toBe('fines')
      expect(sections.some((section) => section.id === 'repair-cost')).toBe(true)
   })

   it('builds sections from report payload without breaking ordering', () => {
      const sections = buildReportSections({
         info_pts: {
            title: 'Данные из ПТС',
            checkDateTime: '2026-01-10',
            value: { model: 'Camry', vin: 'VIN123' }
         },
         info_fines: {
            title: 'Штрафы',
            checkDateTime: '2026-01-10',
            info: 'Нет штрафов',
            color_baige: 'green'
         }
      })

      expect(sections[0].id).toBe('pts-data')
      expect(sections[sections.length - 1].id).toBe('fines')
      expect(sections.find((section) => section.id === 'pts-data')?.title).toBe('Данные из ПТС')
   })

   it('builds short summary fallback list', () => {
      const summary = buildReportSummary(null)
      expect(summary.length).toBe(17)
      expect(summary[0].status).toBe(4)
   })
})
