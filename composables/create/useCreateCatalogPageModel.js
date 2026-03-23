import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CREATE_FLOW_CARS, useCreateStore } from '~/store/create'
import { useCategorySelectStore } from '~/store/category-select'
import {
   buildCarsCreateRouteQuery,
   isCarsConditionCatalogItem,
   resolveCreateCategoryIdsByFlow,
   resolveCreateFlowFromCatalogItem,
   resolveCreateFlowFromCategoryContext,
   CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
   CREATE_MAIN_CATEGORY_ID_CARS,
   CREATE_MAIN_CATEGORY_ID_MOTO
} from '~/store/createStore/createCategoryFlowRouting'
import { CREATE_AD_EDIT_PATH } from '~/store/createStore/createCatalogHelpers'
import {
   getAutogoodsLastCategory,
   getAutogoodsSubCategory,
   getCarCondition,
   getMainCategory,
   getMotoSubCategory
} from '~/services/apiClient'
import carIcon from '@/assets/icons/car.svg'
import gearIcon from '@/assets/icons/disc.svg'
import motoIcon from '@/assets/icons/moto.svg'
import downIcon from '@/assets/icons/down-wide.svg'

const iconByRootSlug = Object.freeze({
   cars: carIcon,
   moto: motoIcon,
   parts: gearIcon
})

const ROOT_SLUG_BY_MAIN_CATEGORY_ID = Object.freeze({
   [CREATE_MAIN_CATEGORY_ID_CARS]: 'cars',
   [CREATE_MAIN_CATEGORY_ID_MOTO]: 'moto',
   [CREATE_MAIN_CATEGORY_ID_AUTOGOODS]: 'parts'
})

const ROOT_FALLBACK_NAME_BY_MAIN_CATEGORY_ID = Object.freeze({
   [CREATE_MAIN_CATEGORY_ID_CARS]: 'Автомобили',
   [CREATE_MAIN_CATEGORY_ID_MOTO]: 'Мототехника',
   [CREATE_MAIN_CATEGORY_ID_AUTOGOODS]: 'Автотовары'
})

const ROOT_MAIN_CATEGORY_ORDER = Object.freeze([
   CREATE_MAIN_CATEGORY_ID_CARS,
   CREATE_MAIN_CATEGORY_ID_MOTO,
   CREATE_MAIN_CATEGORY_ID_AUTOGOODS
])

const CREATE_CATALOG_BACKEND_CACHE_KEY = 'create:catalog:backend:v1'
const CREATE_CATALOG_BACKEND_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const CREATE_CATALOG_MOBILE_BREAKPOINT_PX = 1024
const CREATE_CATALOG_WIP_PATH = '/wip/'
const createCatalogBackendMemoryCache = {
   payload: null,
   expiresAt: 0
}

const toFiniteNumber = (value) => {
   const normalized = Number(value)
   return Number.isFinite(normalized) ? normalized : null
}

const normalizeCategoryList = (value) => {
   if (!Array.isArray(value)) return []
   return value
      .map((item) => ({
         id: toFiniteNumber(item?.id),
         title: String(item?.title || item?.name || '').trim()
      }))
      .filter((item) => item.id !== null && item.title)
}

const normalizeMainCategories = (value) => {
   const rootIds = new Set(ROOT_MAIN_CATEGORY_ORDER)
   return normalizeCategoryList(value).filter((item) => rootIds.has(item.id))
}

const isCacheEntryValid = ({ payload, expiresAt }) =>
   Boolean(payload) &&
   Number.isFinite(expiresAt) &&
   expiresAt > Date.now()

const readCreateCatalogBackendCacheFromLocalStorage = ({
   allowExpired = false
} = {}) => {
   if (!import.meta.client) return null
   try {
      const raw = localStorage.getItem(CREATE_CATALOG_BACKEND_CACHE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw)
      const payload = parsed?.payload || null
      const expiresAt = Number(parsed?.expiresAt || 0)
      if (!payload) return null

      if (!isCacheEntryValid({ payload, expiresAt }) && !allowExpired) {
         localStorage.removeItem(CREATE_CATALOG_BACKEND_CACHE_KEY)
         return null
      }

      return {
         payload,
         expiresAt
      }
   } catch {
      return null
   }
}

const writeCreateCatalogBackendCacheToLocalStorage = ({ payload, expiresAt }) => {
   if (!import.meta.client) return
   try {
      localStorage.setItem(
         CREATE_CATALOG_BACKEND_CACHE_KEY,
         JSON.stringify({
            payload,
            expiresAt
         })
      )
   } catch {
      // Ignore storage write errors (for example, private mode/quota limits).
   }
}

const buildCreateCatalogBackendPayload = async () => {
   const [rawMainCategories, rawCarConditions, rawMotoSubCategories, rawAutogoodsSubCategories] =
      await Promise.all([
         getMainCategory().catch(() => []),
         getCarCondition().catch(() => []),
         getMotoSubCategory().catch(() => []),
         getAutogoodsSubCategory().catch(() => [])
      ])

   const mainCategories = normalizeMainCategories(rawMainCategories)
   const carConditions = normalizeCategoryList(rawCarConditions)
   const motoSubCategories = normalizeCategoryList(rawMotoSubCategories)
   const autogoodsSubCategories = normalizeCategoryList(rawAutogoodsSubCategories)

   const lastCategoryEntries = await Promise.all(
      autogoodsSubCategories.map(async (subcategory) => {
         const subCategoryId = subcategory.id
         const rawLastCategories = await getAutogoodsLastCategory(
            subCategoryId
         ).catch(() => [])
         return [String(subCategoryId), normalizeCategoryList(rawLastCategories)]
      })
   )

   return {
      mainCategories,
      carConditions,
      motoSubCategories,
      autogoodsSubCategories,
      autogoodsLastCategoriesBySubCategoryId: Object.fromEntries(lastCategoryEntries)
   }
}

const getCreateCatalogBackendPayloadCached = async () => {
   if (
      isCacheEntryValid({
         payload: createCatalogBackendMemoryCache.payload,
         expiresAt: createCatalogBackendMemoryCache.expiresAt
      })
   ) {
      return createCatalogBackendMemoryCache.payload
   }

   const cachedLocalEntry = readCreateCatalogBackendCacheFromLocalStorage()
   if (cachedLocalEntry) {
      createCatalogBackendMemoryCache.payload = cachedLocalEntry.payload
      createCatalogBackendMemoryCache.expiresAt = cachedLocalEntry.expiresAt
      return cachedLocalEntry.payload
   }

   try {
      const payload = await buildCreateCatalogBackendPayload()
      const expiresAt = Date.now() + CREATE_CATALOG_BACKEND_CACHE_TTL_MS
      createCatalogBackendMemoryCache.payload = payload
      createCatalogBackendMemoryCache.expiresAt = expiresAt
      writeCreateCatalogBackendCacheToLocalStorage({
         payload,
         expiresAt
      })
      return payload
   } catch (error) {
      const staleMemoryPayload = createCatalogBackendMemoryCache.payload
      if (staleMemoryPayload) {
         console.warn(
            'Create catalog backend fetch failed, using stale memory cache.',
            error
         )
         return staleMemoryPayload
      }

      const staleLocalEntry = readCreateCatalogBackendCacheFromLocalStorage({
         allowExpired: true
      })
      if (staleLocalEntry?.payload) {
         console.warn(
            'Create catalog backend fetch failed, using stale local cache.',
            error
         )
         createCatalogBackendMemoryCache.payload = staleLocalEntry.payload
         createCatalogBackendMemoryCache.expiresAt = staleLocalEntry.expiresAt
         return staleLocalEntry.payload
      }

      throw error
   }
}

const buildRootCategoryNode = (mainCategory) => {
   const id = toFiniteNumber(mainCategory?.id)
   if (!id) return null

   const slug = ROOT_SLUG_BY_MAIN_CATEGORY_ID[id]
   if (!slug) return null

   return {
      id,
      slug,
      name: String(mainCategory?.title || ROOT_FALLBACK_NAME_BY_MAIN_CATEGORY_ID[id] || ''),
      main_category_id: id,
      icon: iconByRootSlug[slug] || null,
      subcategories: []
   }
}

const buildMinimalCreateCatalogCategories = () =>
   ROOT_MAIN_CATEGORY_ORDER.map((id) => {
      const slug = ROOT_SLUG_BY_MAIN_CATEGORY_ID[id]
      if (!slug) return null

      return {
         id,
         slug,
         name: ROOT_FALLBACK_NAME_BY_MAIN_CATEGORY_ID[id],
         main_category_id: id,
         icon: iconByRootSlug[slug] || null,
         subcategories: []
      }
   }).filter(Boolean)

const resolveCarsCategoryNode = ({
   rootNode,
   carConditions = []
} = {}) => {
   if (!rootNode) return null

   const conditionItems = normalizeCategoryList(carConditions)

   return {
      ...rootNode,
      subcategories: conditionItems.map((item) => ({
         id: item.id,
         slug: `cars-condition-${item.id}`,
         name: item.title,
         main_category_id: CREATE_MAIN_CATEGORY_ID_CARS
      }))
   }
}

const resolveMotoCategoryNode = ({
   rootNode,
   motoSubCategories = []
} = {}) => {
   if (!rootNode) return null

   return {
      ...rootNode,
      subcategories: motoSubCategories.map((item) => ({
         id: item.id,
         slug: `moto-sub-${item.id}`,
         name: item.title,
         main_category_id: CREATE_MAIN_CATEGORY_ID_MOTO,
         sub_category_id: item.id
      }))
   }
}

const resolveAutogoodsCategoryNode = ({
   rootNode,
   autogoodsSubCategories = [],
   autogoodsLastCategoriesBySubCategoryId = {}
} = {}) => {
   if (!rootNode) return null

   return {
      ...rootNode,
      subcategories: autogoodsSubCategories.map((subcategory) => {
         const subCategoryId = subcategory.id
         const mappedSubcategory = {
            id: subCategoryId,
            slug: `parts-sub-${subCategoryId}`,
            name: subcategory.title,
            main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
            sub_category_id: subCategoryId
         }

         const rawLastCategories =
            autogoodsLastCategoriesBySubCategoryId[String(subCategoryId)] || []
         const lastCategories = normalizeCategoryList(rawLastCategories)
         if (lastCategories.length) {
            mappedSubcategory.items = lastCategories.map((lastCategory) => ({
               id: lastCategory.id,
               slug: `parts-last-${lastCategory.id}`,
               name: lastCategory.title,
               main_category_id: CREATE_MAIN_CATEGORY_ID_AUTOGOODS,
               sub_category_id: subCategoryId,
               last_category_id: lastCategory.id
            }))
         }

         return mappedSubcategory
      })
   }
}

const buildCreateCategoriesFromBackendPayload = (payload) => {
   const mainCategories = normalizeMainCategories(payload?.mainCategories)
   const mainCategoryMap = new Map(mainCategories.map((item) => [item.id, item]))

   const carsRoot = buildRootCategoryNode(mainCategoryMap.get(CREATE_MAIN_CATEGORY_ID_CARS))
   const motoRoot = buildRootCategoryNode(mainCategoryMap.get(CREATE_MAIN_CATEGORY_ID_MOTO))
   const autogoodsRoot = buildRootCategoryNode(mainCategoryMap.get(CREATE_MAIN_CATEGORY_ID_AUTOGOODS))

   const carsNode = resolveCarsCategoryNode({
      rootNode: carsRoot,
      carConditions: normalizeCategoryList(payload?.carConditions)
   })
   const motoNode = resolveMotoCategoryNode({
      rootNode: motoRoot,
      motoSubCategories: normalizeCategoryList(payload?.motoSubCategories)
   })
   const autogoodsNode = resolveAutogoodsCategoryNode({
      rootNode: autogoodsRoot,
      autogoodsSubCategories: normalizeCategoryList(payload?.autogoodsSubCategories),
      autogoodsLastCategoriesBySubCategoryId:
         payload?.autogoodsLastCategoriesBySubCategoryId || {}
   })

   const categoryById = new Map(
      [carsNode, motoNode, autogoodsNode]
         .filter(Boolean)
         .map((node) => [node.id, node])
   )

   return ROOT_MAIN_CATEGORY_ORDER.map((id) => categoryById.get(id)).filter(Boolean)
}

const resolveFlowByCatalogNode = ({
   node = null,
   selectedCategory = null
} = {}) => {
   const mainCategoryId = toFiniteNumber(
      node?.main_category_id ?? selectedCategory?.main_category_id ?? selectedCategory?.id
   )
   const subCategoryId = toFiniteNumber(node?.sub_category_id)
   const lastCategoryId = toFiniteNumber(node?.last_category_id)
   const slug = String(node?.slug || '')

   return (
      resolveCreateFlowFromCategoryContext({
         mainCategoryId,
         subCategoryId,
         lastCategoryId,
         slug
      }) || resolveCreateFlowFromCatalogItem(node)
   )
}

const appendQueryNumberIfPresent = (query, key, value) => {
   const normalized = toFiniteNumber(value)
   if (normalized === null) return
   query[key] = normalized
}

const appendQueryScalarIfPresent = (query, key, value) => {
   if (value === null || value === undefined || value === '') return
   query[key] = value
}

export const useCreateCatalogPageModel = () => {
   const route = useRoute()
   const router = useRouter()
   const createStore = useCreateStore()
   const categorySelectStore = useCategorySelectStore()

   const selectedCategory = ref(null)
   const selectedSub = ref(null)
   const categories = ref([])
   const isCatalogLoading = ref(true)
   const isMobile = ref(false)
   const currentCategories = ref([])
   const subcategories = computed(
      () => selectedCategory.value?.subcategories || []
   )
   const canGoBack = computed(
      () => isMobile.value && categorySelectStore.history.length > 1
   )

   const updateIsMobile = () => {
      if (!import.meta.client) return
      isMobile.value = window.innerWidth <= CREATE_CATALOG_MOBILE_BREAKPOINT_PX
   }

   const goToWip = () => {
      router.push(CREATE_CATALOG_WIP_PATH)
   }

   const goToCreateAd = (conditionOption) => {
      createStore.setCreateFlow(CREATE_FLOW_CARS)

      if (conditionOption?.id) {
         createStore.condition_id = conditionOption.id
      }

      const query = buildCarsCreateRouteQuery(conditionOption)
      appendQueryScalarIfPresent(
         query,
         'create_by_user_id',
         route.query?.create_by_user_id
      )
      router.push({ path: CREATE_AD_EDIT_PATH, query })
   }

   const goToCreateAdByFlow = (flow, selectedNode = null) => {
      const categoryIdsByFlow = resolveCreateCategoryIdsByFlow(flow)
      const query = {}

      appendQueryNumberIfPresent(
         query,
         'main_category_id',
         selectedNode?.main_category_id ?? categoryIdsByFlow.main_category_id
      )
      appendQueryNumberIfPresent(
         query,
         'sub_category_id',
         selectedNode?.sub_category_id ?? categoryIdsByFlow.sub_category_id
      )
      appendQueryNumberIfPresent(
         query,
         'last_category_id',
         selectedNode?.last_category_id ?? categoryIdsByFlow.last_category_id
      )
      appendQueryScalarIfPresent(
         query,
         'create_by_user_id',
         route.query?.create_by_user_id
      )

      if (!query.main_category_id) {
         goToWip()
         return
      }

      createStore.setCreateFlow(flow)
      router.push({
         path: CREATE_AD_EDIT_PATH,
         query
      })
   }

   const isCarsConditionOption = (item) => {
      const rootCategory = categorySelectStore.selectedCategories[0]?.slug
      const currentRootCategory =
         rootCategory || selectedCategory.value?.slug || null

      return isCarsConditionCatalogItem({
         item,
         rootCategorySlug: currentRootCategory
      })
   }

   const finalSelect = (item) => {
      categorySelectStore.addSelectedCategory(item)

      const flow = resolveFlowByCatalogNode({
         node: item,
         selectedCategory: selectedCategory.value
      })
      if (flow) {
         goToCreateAdByFlow(flow, item)
         return
      }

      goToWip()
   }

   const handleCategoryClick = (categoryItem) => {
      if (isMobile.value) {
         categorySelectStore.addSelectedCategory(categoryItem)
         const nextCategories = categoryItem.subcategories || categoryItem.items
         if (nextCategories) {
            categorySelectStore.setHistory([
               ...categorySelectStore.history,
               nextCategories
            ])
            currentCategories.value = nextCategories
         } else {
            if (isCarsConditionOption(categoryItem)) {
               goToCreateAd(categoryItem)
               return
            }
            finalSelect(categoryItem)
         }
         return
      }

      selectedCategory.value = categoryItem
      selectedSub.value = null
      categorySelectStore.addSelectedCategory(categoryItem)
   }

   const handleSubClick = (subcategory) => {
      selectedSub.value = subcategory
      categorySelectStore.addSelectedCategory(subcategory)
      if (subcategory.items) return

      if (selectedCategory.value?.slug === 'cars') {
         goToCreateAd(subcategory)
         return
      }

      const flow = resolveFlowByCatalogNode({
         node: subcategory,
         selectedCategory: selectedCategory.value
      })
      if (flow) {
         goToCreateAdByFlow(flow, subcategory)
         return
      }

      goToWip()
   }

   const goBack = () => {
      if (categorySelectStore.history.length <= 1) {
         currentCategories.value = categories.value
         categorySelectStore.setHistory([categories.value])
         return
      }

      categorySelectStore.goBack()
      const history = categorySelectStore.history
      const newHistory = history.slice(0, history.length - 1)
      currentCategories.value = newHistory[newHistory.length - 1]
      categorySelectStore.setHistory(newHistory)
   }

   const hydrateCreateCatalogCategories = async () => {
      isCatalogLoading.value = true
      const fallbackCategories = buildMinimalCreateCatalogCategories()
      try {
         const backendPayload = await getCreateCatalogBackendPayloadCached()
         const backendCategories =
            buildCreateCategoriesFromBackendPayload(backendPayload)

         if (!backendCategories.length) {
            categories.value = fallbackCategories
            currentCategories.value = categories.value
            return
         }

         categories.value = backendCategories
      } catch (error) {
         console.error(
            'Failed to load backend-driven create catalog categories:',
            error
         )
         categories.value = fallbackCategories
      } finally {
         isCatalogLoading.value = false
      }

      currentCategories.value = categories.value
   }

   onMounted(async () => {
      updateIsMobile()
      if (import.meta.client) {
         window.addEventListener('resize', updateIsMobile, {
            passive: true
         })
      }

      await hydrateCreateCatalogCategories()
      categorySelectStore.clearSelectedCategories()
      categorySelectStore.setHistory([categories.value])
   })

   onUnmounted(() => {
      if (!import.meta.client) return
      window.removeEventListener('resize', updateIsMobile)
   })

   return {
      downIcon,
      categories,
      isCatalogLoading,
      currentCategories,
      selectedCategory,
      selectedSub,
      subcategories,
      isMobile,
      canGoBack,
      handleCategoryClick,
      handleSubClick,
      finalSelect,
      goBack
   }
}
