import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => {
   const useRuntimeConfig = vi.fn(() => ({
      public: {
         yandexApiKey: 'yandex-key'
      }
   }))

   const axiosGet = vi.fn()
   const fetchMock = vi.fn()
   const getCurrentPosition = vi.fn()

   return {
      useRuntimeConfig,
      axiosGet,
      fetchMock,
      getCurrentPosition
   }
})

vi.mock(
   '#imports',
   () => ({
      useRuntimeConfig: hoisted.useRuntimeConfig
   }),
   { virtual: true }
)

vi.mock('axios', () => ({
   default: {
      get: hoisted.axiosGet
   }
}))

describe('apiLocation', () => {
   beforeEach(() => {
      hoisted.useRuntimeConfig.mockClear()
      hoisted.useRuntimeConfig.mockReturnValue({
         public: {
            yandexApiKey: 'yandex-key'
         }
      })
      hoisted.axiosGet.mockReset()
      hoisted.fetchMock.mockReset()
      hoisted.getCurrentPosition.mockReset()
      vi.stubGlobal('$fetch', hoisted.fetchMock)
      vi.stubGlobal('navigator', {
         geolocation: {
            getCurrentPosition: hoisted.getCurrentPosition
         }
      })
      vi.resetModules()
   })

   afterEach(() => {
      vi.unstubAllGlobals()
   })

   it('normalizes browser geolocation coordinates and falls back on errors', async () => {
      hoisted.getCurrentPosition.mockImplementationOnce((success) => {
         success({
            coords: {
               latitude: '55.75',
               longitude: '37.61'
            }
         })
      })

      const apiLocation = await import('../services/apiLocation.js')

      await expect(apiLocation.fetchLocation()).resolves.toEqual({
         lat: '55.75',
         lon: '37.61'
      })

      hoisted.getCurrentPosition.mockImplementationOnce((success) => {
         success({
            coords: {
               latitude: 'abc',
               longitude: null
            }
         })
      })

      await expect(apiLocation.fetchLocation()).resolves.toEqual({
         lat: null,
         lon: null
      })

      hoisted.getCurrentPosition.mockImplementationOnce((success, error) => {
         error(new Error('denied'))
      })

      await expect(apiLocation.fetchLocation()).resolves.toEqual({
         lat: null,
         lon: null
      })
   })

   it('uses stable unknown fallback for IP lookup', async () => {
      const apiLocation = await import('../services/apiLocation.js')

      await expect(apiLocation.getCityByIp('')).resolves.toEqual({
         city: apiLocation.UNKNOWN_LOCATION,
         country: apiLocation.UNKNOWN_LOCATION
      })

      hoisted.fetchMock.mockRejectedValueOnce(new Error('network'))

      await expect(apiLocation.getCityByIp('127.0.0.1')).resolves.toEqual({
         city: apiLocation.UNKNOWN_LOCATION,
         country: apiLocation.UNKNOWN_LOCATION
      })
   })

   it('falls back to Moscow when reverse geocoder has no russian city match', async () => {
      hoisted.axiosGet.mockResolvedValueOnce({
         data: {
            response: {
               GeoObjectCollection: {
                  featureMember: [
                     {
                        GeoObject: {
                           metaDataProperty: {
                              GeocoderMetaData: {
                                 AddressDetails: {
                                    Country: {
                                       CountryNameCode: 'BY'
                                    }
                                 },
                                 Address: {
                                    Components: []
                                 }
                              }
                           }
                        }
                     }
                  ]
               }
            }
         }
      })

      const apiLocation = await import('../services/apiLocation.js')

      await expect(apiLocation.fetchCity('53.9', '27.56')).resolves.toBe(
         apiLocation.FALLBACK_CITY
      )
   })

   it('deduplicates address suggestions by full address', async () => {
      hoisted.axiosGet.mockResolvedValueOnce({
         data: {
            response: {
               GeoObjectCollection: {
                  featureMember: [
                     {
                        GeoObject: {
                           name: 'Тверская, 1',
                           description: 'Москва',
                           Point: { pos: '37.61 55.75' },
                           metaDataProperty: {
                              GeocoderMetaData: {
                                 Address: {
                                    Components: [
                                       { kind: 'country', name: 'Россия' },
                                       { kind: 'locality', name: 'Москва' },
                                       { kind: 'street', name: 'Тверская' },
                                       { kind: 'house', name: '1' }
                                    ]
                                 }
                              }
                           }
                        }
                     },
                     {
                        GeoObject: {
                           name: 'Тверская, 1',
                           description: 'Москва',
                           Point: { pos: '37.61 55.75' },
                           metaDataProperty: {
                              GeocoderMetaData: {
                                 Address: {
                                    Components: [
                                       { kind: 'country', name: 'Россия' },
                                       { kind: 'locality', name: 'Москва' },
                                       { kind: 'street', name: 'Тверская' },
                                       { kind: 'house', name: '1' }
                                    ]
                                 }
                              }
                           }
                        }
                     }
                  ]
               }
            }
         }
      })

      const apiLocation = await import('../services/apiLocation.js')

      await expect(apiLocation.fetchSuggestions('Твер')).resolves.toHaveLength(1)
   })

   it('uses the innermost province as city for Moscow geocoder responses', async () => {
      hoisted.axiosGet.mockResolvedValueOnce({
         data: {
            response: {
               GeoObjectCollection: {
                  featureMember: [
                     {
                        GeoObject: {
                           name: 'Москва',
                           description: 'Россия',
                           Point: { pos: '37.617698 55.755864' },
                           metaDataProperty: {
                              GeocoderMetaData: {
                                 Address: {
                                    Components: [
                                       { kind: 'country', name: 'Россия' },
                                       {
                                          kind: 'province',
                                          name: 'Центральный федеральный округ'
                                       },
                                       { kind: 'province', name: 'Москва' }
                                    ]
                                 },
                                 AddressDetails: {
                                    Country: {
                                       CountryNameCode: 'RU',
                                       AdministrativeArea: {
                                          AdministrativeAreaName: 'Москва'
                                       }
                                    }
                                 }
                              }
                           }
                        }
                     }
                  ]
               }
            }
         }
      })

      const apiLocation = await import('../services/apiLocation.js')

      await expect(apiLocation.fetchSuggestions('Мос')).resolves.toMatchObject([
         {
            city: 'Москва',
            country: 'Россия',
            fullAddress: 'Россия, Москва'
         }
      ])
   })
})
