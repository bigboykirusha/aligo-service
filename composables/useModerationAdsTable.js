import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from '#app'
import archiveIcon from '@/assets/icons/archive.svg'
import deleteIcon from '@/assets/icons/delete.svg'
import editIcon from '@/assets/icons/edit.svg'
import eyeIcon from '@/assets/icons/eye.svg'
import publishIcon from '@/assets/icons/add.svg'
import takeoffIcon from '@/assets/icons/stop.svg'
import {
   archiveModerationAd,
   deleteModerationAd,
   getModerationAds,
   publishAgainModerationAd,
   takeOffPublicationModerationAd
} from '@/services/api/moderationApi'
import { normalizeAdUrl } from '@/services/ads/adUrl'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { buildCreateEditRouteLocation } from '@/store/createStore/createCatalogHelpers'

const STATUS_OPTIONS = Object.freeze([
   { key: 'is_deleted', label: 'Удалённые' },
   { key: 'is_draft', label: 'Черновики' },
   { key: 'is_in_archive', label: 'Архив' },
   { key: 'is_published', label: 'Опубликованные' },
   { key: 'is_closed', label: 'Закрытые' },
   { key: 'is_moderation', label: 'На модерации' },
   { key: 'is_cancelled', label: 'Отменённые' },
   {
      key: 'is_dismissed_from_publication',
      label: 'Снятые с публикации'
   }
])

const ORDER_BY_OPTIONS = Object.freeze([
   { id: 'desc', title: 'Сначала новые' },
   { id: 'asc', title: 'Сначала старые' }
])

const createDefaultFilters = () => ({
   search: '',
   user_id: '',
   order_by: 'desc',
   count: 20,
   is_deleted: false,
   is_draft: false,
   is_in_archive: false,
   is_published: false,
   is_closed: false,
   is_moderation: false,
   is_cancelled: false,
   is_dismissed_from_publication: false
})

const formatDate = (value) => {
   if (!value) return '-'

   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return String(value)

   return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
   }).format(date)
}

const formatPrice = (value) => {
   const amount = Number(value)
   if (!Number.isFinite(amount)) return value || '-'
   return `${new Intl.NumberFormat('ru-RU').format(amount)} ₽`
}

const getTabPresetKey = (filters) => {
   if (filters.is_published) return 'published'
   if (filters.is_draft) return 'drafts'
   return ''
}

const canArchiveAd = (row) =>
   !row?.statusFlags?.is_deleted &&
   !row?.statusFlags?.is_in_archive &&
   !row?.statusFlags?.is_closed

const canDeleteAd = (row) => !row?.statusFlags?.is_deleted

const canPublishAgainAd = (row) =>
   !row?.statusFlags?.is_deleted &&
   !row?.statusFlags?.is_published &&
   (row?.statusFlags?.is_in_archive ||
      row?.statusFlags?.is_dismissed_from_publication ||
      row?.statusFlags?.is_closed ||
      row?.statusFlags?.is_cancelled)

const canTakeOffPublicationAd = (row) =>
   !row?.statusFlags?.is_deleted && row?.statusFlags?.is_published

const canOpenPublicAd = (row) =>
   !row?.statusFlags?.is_deleted && row?.statusFlags?.is_published

const resolvePublicAdPath = (row) =>
   normalizeAdUrl(row?.url, row?.raw || row)

const PUBLIC_SITE_BASE_URL = 'https://aligo.ru'

export const useModerationAdsTable = () => {
   const route = useRoute()
   const router = useRouter()
   const popupErrorStore = usePopupErrorStore()

   const ads = ref([])
   const totalAds = ref(0)
   const currentPage = ref(1)
   const isLoading = ref(false)
   const errorMessage = ref('')

   const filters = reactive(createDefaultFilters())

   const statusMultiOptions = STATUS_OPTIONS.map((option) => ({
      id: option.key,
      title: option.label
   }))

   const selectedStatusKeys = computed(() =>
      STATUS_OPTIONS.filter((option) => filters[option.key]).map(
         (option) => option.key
      )
   )

   const getRowMenuItems = (row) => {
      const items = [
         {
            key: 'open_public',
            text: 'Перейти к объявлению',
            icon: eyeIcon
         },
         { key: 'edit', text: 'Редактировать', icon: editIcon }
      ]

      if (canArchiveAd(row)) {
         items.push({
            key: 'archive',
            text: 'Архивировать',
            icon: archiveIcon
         })
      }

      if (canPublishAgainAd(row)) {
         items.push({
            key: 'publish_again',
            text: 'Опубликовать снова',
            icon: publishIcon
         })
      }

      if (canTakeOffPublicationAd(row)) {
         items.push({
            key: 'take_off_publication',
            text: 'Снять с публикации',
            icon: takeoffIcon
         })
      }

      if (canDeleteAd(row)) {
         items.push({
            key: 'delete',
            text: 'Удалить',
            icon: deleteIcon
         })
      }

      return canOpenPublicAd(row)
         ? items
         : items.filter((item) => item.key !== 'open_public')
   }

   const columns = computed(() => [
      {
         key: 'autoId',
         label: 'ID',
         width: '72px',
         align: 'center',
         nowrap: true,
         columnClass: 'id'
      },
      {
         key: 'title',
         label: 'Объявление',
         width: '320px',
         columnClass: 'title',
         format: (row) => ({
            title: row.title,
            subtitle: ''
         })
      },
      {
         key: 'location',
         label: 'Локация',
         width: '220px',
         columnClass: 'location',
         format: (row) => ({
            title: row.cityLabel || 'Город не указан',
            subtitle: row.raw?.ads_parameter?.place_inspection || ''
         })
      },
      {
         key: 'owner',
         label: 'Пользователь',
         width: '240px',
         columnClass: 'owner',
         format: (row) => ({
            title: row.userName || 'Без имени',
            subtitle: row.userId ? `user_id: ${row.userId}` : 'Без user_id'
         })
      },
      {
         key: 'statusLabel',
         label: 'Статус',
         width: '172px',
         type: 'status',
         columnClass: 'status',
         getTone: (row) => row.statusTone
      },
      {
         key: 'price',
         label: 'Цена',
         width: '124px',
         align: 'center',
         nowrap: true,
         columnClass: 'price',
         format: (row) => formatPrice(row.price)
      },
      {
         key: 'updatedAt',
         label: 'Обновлено',
         width: '132px',
         align: 'center',
         nowrap: true,
         columnClass: 'date',
         format: (row) => formatDate(row.updatedAt || row.createdAt)
      },
      {
         key: 'menu',
         label: 'Действия',
         width: '64px',
         type: 'menu',
         align: 'center',
         nowrap: true,
         columnClass: 'menu',
         menuItems: getRowMenuItems
      }
   ])

   const applyRoutePreset = () => {
      const tab = String(route.query.tab || '').toLowerCase()
      if (tab === 'drafts') filters.is_draft = true
      if (tab === 'published') filters.is_published = true

      const userId = String(route.query.user_id || '').trim()
      if (userId) filters.user_id = userId
   }

   const syncRouteQuery = async () => {
      const tab = getTabPresetKey(filters)
      const nextQuery = {
         ...(filters.user_id ? { user_id: String(filters.user_id) } : {}),
         ...(tab ? { tab } : {})
      }

      const currentUserId = String(route.query.user_id || '')
      const currentTab = String(route.query.tab || '')

      if (
         currentUserId === String(nextQuery.user_id || '') &&
         currentTab === String(nextQuery.tab || '')
      ) {
         return
      }

      await router.replace({ query: nextQuery })
   }

   const loadAds = async (page = 1) => {
      currentPage.value = Number(page) || 1
      isLoading.value = true
      errorMessage.value = ''

      const result = await getModerationAds({
         ...filters,
         page: currentPage.value
      })

      isLoading.value = false

      if (result?.success === false) {
         ads.value = []
         totalAds.value = 0
         errorMessage.value =
            result.message || 'Не удалось загрузить объявления.'
         return
      }

      ads.value = Array.isArray(result?.items) ? result.items : []
      totalAds.value = Number(result?.total) || ads.value.length
   }

   const handleStatusesChange = (keys) => {
      const normalizedKeys = new Set(Array.isArray(keys) ? keys : [])

      STATUS_OPTIONS.forEach((option) => {
         filters[option.key] = normalizedKeys.has(option.key)
      })
   }

   const applyFilters = async () => {
      await syncRouteQuery()
      await loadAds(1)
   }

   const handlePerPageChange = async (value) => {
      filters.count = Number(value) || 20
      await loadAds(1)
   }

   const runAdAction = async ({
      row,
      action,
      confirmationText,
      successFallback
   }) => {
      if (!row?.autoId || !row?.mainCategoryId) return
      if (!window.confirm(confirmationText)) return

      const result = await action({
         ads_id: row.autoId,
         main_category_id: row.mainCategoryId
      })

      if (result?.success === false) {
         popupErrorStore.showError(result.message || 'Не удалось выполнить действие.')
         return
      }

      popupErrorStore.showNotification(result?.message || successFallback)
      await loadAds(currentPage.value)
   }

   const handleRowAction = async (actionKey, row) => {
      if (actionKey === 'open_public') {
         const publicPath = resolvePublicAdPath(row)
         if (!publicPath || !import.meta.client) return

         const targetHref = router.resolve(publicPath).href
         const absoluteHref = `${PUBLIC_SITE_BASE_URL}${targetHref}`
         window.open(absoluteHref, '_blank', 'noopener,noreferrer')
         return
      }

      if (actionKey === 'edit') {
         const location = buildCreateEditRouteLocation({
            source: row?.raw || row,
            userId: row?.userId
         })

         if (!location) return
         location.query = {
            ...location.query,
            create_by_user_id: row?.userId || ''
         }
         await router.push(location)
         return
      }

      if (actionKey === 'archive') {
         await runAdAction({
            row,
            action: archiveModerationAd,
            confirmationText: `Архивировать объявление #${row.autoId}?`,
            successFallback: 'Объявление архивировано.'
         })
         return
      }

      if (actionKey === 'publish_again') {
         await runAdAction({
            row,
            action: publishAgainModerationAd,
            confirmationText: `Опубликовать снова объявление #${row.autoId}?`,
            successFallback: 'Объявление опубликовано снова.'
         })
         return
      }

      if (actionKey === 'take_off_publication') {
         await runAdAction({
            row,
            action: takeOffPublicationModerationAd,
            confirmationText: `Снять с публикации объявление #${row.autoId}?`,
            successFallback: 'Объявление снято с публикации.'
         })
         return
      }

      if (actionKey === 'delete') {
         await runAdAction({
            row,
            action: deleteModerationAd,
            confirmationText: `Удалить объявление #${row.autoId}?`,
            successFallback: 'Объявление удалено.'
         })
      }
   }

   onMounted(async () => {
      applyRoutePreset()
      await loadAds(1)
   })

   return {
      ads,
      columns,
      currentPage,
      errorMessage,
      filters,
      formatDate,
      formatPrice,
      handlePerPageChange,
      handleRowAction,
      handleStatusesChange,
      isLoading,
      loadAds,
      orderByOptions: ORDER_BY_OPTIONS,
      applyFilters,
      selectedStatusKeys,
      statusMultiOptions,
      totalAds
   }
}
