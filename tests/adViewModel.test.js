import { describe, expect, it } from 'vitest'

import {
  buildCarContactProps,
  getCarEquipmentLabels,
  getCarDescription,
  getMaskedVin,
  resolveFullReportPrice
} from '../services/auto/adViewModel'

describe('adViewModel', () => {
  it('builds contact props with safe fallbacks', () => {
    const props = buildCarContactProps({
      id: '42',
      user_id: '7',
      ads_parameter: {
        amount: '650000',
        username: '',
        login: 'seller',
        place_inspection: '',
        latitude: '47.22',
        longitude: '39.72'
      },
      auto_technical_specifications: [
        {
          brand: { title: 'Renault' },
          model: { title: 'Clio' },
          year_release: { title: '2008' }
        }
      ]
    })

    expect(props).toEqual({
      id: 42,
      idUserOwnerAds: 7,
      brand: 'Renault',
      model: 'Clio',
      year: '2008',
      amount: 650000,
      username: 'seller',
      place: 'Не указано',
      isInFavorites: 0,
      latitude: 47.22,
      longitude: 39.72,
      photos: []
    })
  })

  it('extracts equipment labels from boolean flags', () => {
    const labels = getCarEquipmentLabels({
      auto_additional_options_heating: [
        {
          is_front_seats: true,
          is_rear_window: true
        }
      ],
      auto_additional_headlights: [
        {
          is_led_headlights: 1,
          is_fog_lights: false
        }
      ]
    })

    expect(labels).toEqual([
      'Подогрев передних сидений',
      'Подогрев заднего стекла',
      'Светодиодные фары'
    ])
  })

  it('normalizes description and masks vin', () => {
    const ad = {
      ads_parameter: {
        ads_description: '  Первая строка  \nВторая строка  '
      },
      auto_registration_data: [{ vin: 'VF1BR2J0A40446853' }]
    }

    expect(getCarDescription(ad)).toBe('Первая строка\nВторая строка')
    expect(getMaskedVin(ad)).toBe('VF1B****6853')
  })

  it('resolves report price from multiple response shapes', () => {
    expect(resolveFullReportPrice(85)).toBe(85)
    expect(resolveFullReportPrice({ price: 120 })).toBe(120)
    expect(resolveFullReportPrice({ data: 62 })).toBe(62)
    expect(resolveFullReportPrice({ data: { amount: '95' } })).toBe(95)
    expect(resolveFullReportPrice({ success: true, data: { value: '73 ₽' } })).toBe(
      73
    )
    expect(resolveFullReportPrice({})).toBe(85)
    expect(resolveFullReportPrice({}, 99)).toBe(99)
  })
})
