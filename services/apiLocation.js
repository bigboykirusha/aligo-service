import axios from 'axios'
import { useRuntimeConfig } from '#imports'

export const FALLBACK_CITY = 'Москва'
export const UNKNOWN_LOCATION = 'Неизвестно'
const DEFAULT_LOCATION = { lat: null, lon: null }
const YANDEX_GEOCODER_URL = 'https://geocode-maps.yandex.ru/1.x/'
const YANDEX_MAPS_API_URL = 'https://api-maps.yandex.ru/2.1/'

let yandexMapsPromise = null

const toCoordinateString = (value) => {
   const numeric = Number(value)
   return Number.isFinite(numeric) ? String(numeric) : null
}

const hasCoordinates = (lat, lon) => {
   return Boolean(toCoordinateString(lat) && toCoordinateString(lon))
}

const parseYandexPoint = (geoObject) => {
   const point = geoObject?.Point?.pos?.split(' ') || []
   const lon = toCoordinateString(point[0])
   const lat = toCoordinateString(point[1])

   if (!lat || !lon) {
      return DEFAULT_LOCATION
   }

   return { lat, lon }
}

const buildAddressFromGeoObject = (geoObject) => {
   const name = geoObject?.name || ''
   const description = geoObject?.description || ''
   return [description, name].filter(Boolean).join(', ').trim()
}

const extractAddressComponents = (geoObject) => {
   const components =
      geoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components || []

   const componentNamesByKind = (kind) =>
      components
         .filter((item) => item?.kind === kind)
         .map((item) => item?.name)
         .filter(Boolean)

   const firstComponentByKind = (kind) => componentNamesByKind(kind)[0] || null
   const lastComponentByKind = (kind) => {
      const matches = componentNamesByKind(kind)
      return matches[matches.length - 1] || null
   }

   const administrativeAreaName =
      geoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country
         ?.AdministrativeArea?.AdministrativeAreaName || null

   const city =
      firstComponentByKind('locality') ||
      lastComponentByKind('province') ||
      lastComponentByKind('area') ||
      administrativeAreaName

   return {
      country: firstComponentByKind('country'),
      city,
      street: firstComponentByKind('street'),
      house: firstComponentByKind('house')
   }
}

const normalizeSuggestion = (geoObject) => {
   const { lat, lon } = parseYandexPoint(geoObject)
   const { country, city, street, house } = extractAddressComponents(geoObject)
   const fullAddress = buildAddressFromGeoObject(geoObject)

   return {
      fullAddress,
      city,
      country,
      street,
      house,
      lat,
      lon,
      geoObject
   }
}

const fetchYandexGeocoder = async (params) => {
   const config = useRuntimeConfig()
   const yandexApiKey = config.public.yandexApiKey

   if (!yandexApiKey) {
      return null
   }

   const response = await axios.get(YANDEX_GEOCODER_URL, {
      params: {
         apikey: yandexApiKey,
         format: 'json',
         lang: 'ru_RU',
         ...params
      }
   })

   return response?.data || null
}

const getFeatureMembers = (data) => {
   return data?.response?.GeoObjectCollection?.featureMember || []
}

export const loadYandexMapsApi = async () => {
   if (!import.meta.client) {
      return null
   }

   const config = useRuntimeConfig()
   const yandexApiKey = config.public.yandexApiKey
   if (!yandexApiKey) {
      return null
   }

   if (window.ymaps?.Map) {
      return window.ymaps
   }

   if (yandexMapsPromise) {
      return yandexMapsPromise
   }

   yandexMapsPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
         'script[data-yandex-maps-api="1"]'
      )

      const onReady = () => {
         if (!window.ymaps) {
            reject(new Error('Yandex Maps API is unavailable'))
            return
         }

         window.ymaps.ready(() => resolve(window.ymaps))
      }

      if (existingScript) {
         if (window.ymaps?.Map) {
            onReady()
         } else {
            existingScript.addEventListener('load', onReady, { once: true })
            existingScript.addEventListener(
               'error',
               () => reject(new Error('Failed to load Yandex Maps API')),
               { once: true }
            )
         }
         return
      }

      const script = document.createElement('script')
      script.src = `${YANDEX_MAPS_API_URL}?apikey=${encodeURIComponent(yandexApiKey)}&lang=ru_RU`
      script.async = true
      script.defer = true
      script.dataset.yandexMapsApi = '1'
      script.onload = onReady
      script.onerror = () => reject(new Error('Failed to load Yandex Maps API'))
      document.head.appendChild(script)
   }).catch((error) => {
      yandexMapsPromise = null
      console.error('Ошибка загрузки Yandex Maps API:', error)
      throw error
   })

   return yandexMapsPromise
}

export const fetchLocation = async () => {
   if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return DEFAULT_LOCATION
   }

   return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = toCoordinateString(position?.coords?.latitude)
            const lon = toCoordinateString(position?.coords?.longitude)
            resolve(lat && lon ? { lat, lon } : DEFAULT_LOCATION)
         },
         (error) => {
            console.error('Failed to fetch location:', error)
            resolve(DEFAULT_LOCATION)
         },
         {
            enableHighAccuracy: false,
            timeout: 4000,
            maximumAge: 5 * 60 * 1000
         }
      )
   })
}

export const getCityByIp = async (ip) => {
   if (!ip) {
      return { city: UNKNOWN_LOCATION, country: UNKNOWN_LOCATION }
   }

   try {
      const response = await $fetch(`/api/location/ip/${encodeURIComponent(ip)}`)
      return {
         city: response?.city || UNKNOWN_LOCATION,
         country: response?.country || UNKNOWN_LOCATION
      }
   } catch (error) {
      console.error(`Failed to fetch city by IP ${ip}:`, error)
      return { city: UNKNOWN_LOCATION, country: UNKNOWN_LOCATION }
   }
}

export const fetchCity = async (lat, lon) => {
   if (!hasCoordinates(lat, lon)) {
      return FALLBACK_CITY
   }

   try {
      const data = await fetchYandexGeocoder({
         geocode: `${lon},${lat}`,
         results: 1
      })

      const geoObject = getFeatureMembers(data)?.[0]?.GeoObject
      if (!geoObject) {
         return FALLBACK_CITY
      }

      const countryCode =
         geoObject?.metaDataProperty?.GeocoderMetaData?.AddressDetails?.Country
            ?.CountryNameCode

      if (countryCode && countryCode !== 'RU') {
         return FALLBACK_CITY
      }

      const { city } = extractAddressComponents(geoObject)
      return city || FALLBACK_CITY
   } catch (error) {
      console.error('Ошибка получения города:', error)
      return FALLBACK_CITY
   }
}

export const fetchSuggestions = async (query, options = {}) => {
   const { results = 6 } = options
   const trimmedQuery = String(query || '').trim()

   if (trimmedQuery.length < 3) {
      return []
   }

   try {
      const data = await fetchYandexGeocoder({
         geocode: trimmedQuery,
         results
      })

      const seen = new Set()

      return getFeatureMembers(data)
         .map((item) => normalizeSuggestion(item?.GeoObject))
         .filter((item) => item.fullAddress)
         .filter((item) => {
            if (seen.has(item.fullAddress)) return false
            seen.add(item.fullAddress)
            return true
         })
   } catch (error) {
      console.error('Ошибка получения подсказок по адресу:', error)
      return []
   }
}

export const reverseGeocode = async (lat, lon) => {
   if (!hasCoordinates(lat, lon)) {
      return null
   }

   try {
      const data = await fetchYandexGeocoder({
         geocode: `${lon},${lat}`,
         results: 1
      })

      const geoObject = getFeatureMembers(data)?.[0]?.GeoObject
      return geoObject ? normalizeSuggestion(geoObject) : null
   } catch (error) {
      console.error('Ошибка обратного геокодирования:', error)
      return null
   }
}

export const getMapEmbedUrl = (lat, lon, zoom = 14) => {
   if (!hasCoordinates(lat, lon)) {
      return ''
   }

   const normalizedLat = toCoordinateString(lat)
   const normalizedLon = toCoordinateString(lon)

   return `https://maps.google.com/maps?q=${normalizedLat},${normalizedLon}&z=${zoom}&ie=UTF8&iwloc=&output=embed`
}
