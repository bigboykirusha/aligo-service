import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import axios from 'axios'
import { readCookieFromString } from '@/services/apiUtils'

export default defineNuxtPlugin(() => {
   const config = useRuntimeConfig()

   const getToken = () => {
      if (!import.meta.client) return null
      return readCookieFromString(document.cookie || '', 'token')
   }

   const createClient = (contentType) => {
      const client = axios.create({
         baseURL: `${config.public.apiBaseUrl}/api`,
         withCredentials: true,
         headers: { 'Content-Type': contentType }
      })

      client.interceptors.request.use((cfg) => {
         const token = getToken()
         cfg.headers = cfg.headers || {}

         if (token) {
            cfg.headers.Authorization = `Bearer ${token}`
         } else if ('Authorization' in cfg.headers) {
            delete cfg.headers.Authorization
         }

         return cfg
      })

      return client
   }

   const apiClient = createClient('application/json')
   const apiClientData = createClient('multipart/form-data')

   return {
      provide: {
         apiClient,
         apiClientData
      }
   }
})
