import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCookie } from '#app'
import { onBeforeRouteLeave, useRoute, useRouter } from '#vue-router'
import { useCreateStore } from '@/store/create.js'
import {
   buildCreateDraftRouteSyncQuery,
   canLoadCreateDraftForUser,
   hasCreateDraftRouteSyncChanged,
   resolveCreateConditionIdFromRouteQuery,
   resolveCreateFlowFromRouteQuery,
   shouldHydrateCreateDraftFromRoute,
   syncCreateStoreCategoryIdsFromRoute
} from '@/store/createStore/routeHelpers'
import {
   buildCreateAdRequiredFieldsMessage,
   CREATE_PUBLISH_COMPLETION_QUERY_KEY,
   CREATE_PUBLISH_LOG_PREFIX,
   CREATE_PUBLISH_SAVE_ERROR_MESSAGE,
   CREATE_PUBLISH_SUCCESS_MESSAGE,
   CREATE_SAVE_DRAFT_LOG_PREFIX
} from '@/store/createStore/publishHelpers'
import {
   createCreateNavigationController,
   runCreateDraftMutationAction
} from '@/store/createStore/pagePublishActions'
import { usePopupErrorStore } from '@/store/popupErrorStore'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user.js'
import { getModerationUserById } from '~/services/api/moderationApi'
import { useModerationCreateStore } from '~/store/moderationCreateStore'
import { useModalStore } from '~/store/modalStore'

const SAVE_AD_EXIT_MODAL_ID = 'createAdSaveExit'
const CREATE_PUBLISH_REDIRECT_DELAY_MS = 500
const CREATE_SAVE_REDIRECT_DELAY_MS = 500
const CREATE_MOBILE_BREAKPOINT_PX = 768
const CREATE_PUBLISHED_ROUTE = '/ads?tab=published'
const CREATE_DRAFTS_ROUTE = '/ads?tab=drafts'
const CREATE_DRAFT_LOAD_ERROR_MESSAGE =
   'Не удалось загрузить черновик. Попробуйте обновить страницу.'

const isCreateRoutePath = (path) => String(path || '').includes('/create')

const getQueryScalar = (query, key) => {
   const value = query?.[key]
   return Array.isArray(value) ? value[0] : value
}

const resolveDraftOwnerId = (draft = {}) =>
   normalizeEntityId(
      draft?.id_user_owner_ads ??
         draft?.idUserOwnerAds ??
         draft?.user?.id ??
         draft?.ads_parameter?.user_id
   )

export const useCreateAdPageModel = () => {
   const createStore = useCreateStore()
   const moderationCreateStore = useModerationCreateStore()
   const userStore = useUserStore()
   const uiStore = useUiStore()
   const modalStore = useModalStore()
   const popupErrorStore = usePopupErrorStore()
   const router = useRouter()
   const route = useRoute()

   const isPublishing = ref(false)
   const isSaving = ref(false)
   const isLoading = ref(true)
   const isMobileViewport = ref(false)
   const skipLeaveAutosaveOnce = ref(false)

   const isAnyFieldFilled = computed(() => createStore.isAnyFieldFilled)
   const isSavePopupOpen = computed(() =>
      modalStore.isVisible(SAVE_AD_EXIT_MODAL_ID)
   )
   const token = useCookie('token').value
   const userId = useCookie('user_id').value

   const { clearCreateNavigationTimer, scheduleCreateNavigation } =
      createCreateNavigationController({
         router,
         delayMs: CREATE_PUBLISH_REDIRECT_DELAY_MS,
         isClient: import.meta.client,
         onNavigationError: (error) => {
            console.error('Create navigation failed:', error)
         }
      })

   const closePopup = () => {
      modalStore.close(SAVE_AD_EXIT_MODAL_ID)
   }

   const applyModerationUserPreset = async () => {
      const createByUserId = String(
         getQueryScalar(route.query, 'create_by_user_id') ||
            getQueryScalar(route.query, 'id_user_owner_ads') ||
            ''
      ).trim()

      if (!createByUserId) {
         moderationCreateStore.reset()
         return
      }

      const moderationUser = await getModerationUserById(createByUserId)
      if (!moderationUser || moderationUser?.success === false) {
         popupErrorStore.showError(
            moderationUser?.message ||
               'Не удалось загрузить пользователя для создания объявления.'
         )
         moderationCreateStore.reset()
         return
      }

      moderationCreateStore.applyUserPreset(moderationUser)

      createStore.create_by_user_id = Number(createByUserId)
      if (!createStore.id_user_owner_ads) {
         createStore.id_user_owner_ads = Number(createByUserId)
      }
      createStore.username = moderationUser.username || null
      createStore.phone = moderationUser.phone || null
      createStore.email = moderationUser.email || null
      createStore.isUserDataInitialized = true
   }

   const updateViewportFlag = () => {
      if (!import.meta.client) return
      isMobileViewport.value = window.innerWidth <= CREATE_MOBILE_BREAKPOINT_PX
   }

   const resetState = ({ refreshUserCounts = true } = {}) => {
      createStore.resetParams()
      if (refreshUserCounts) {
         userStore.fetchUserCounts()
      }
      closePopup()
   }

   const redirectToCreateCompletion = () => {
      skipLeaveAutosaveOnce.value = true
      router
         .replace({
            path: '/ads',
            query: {
               tab: 'published',
               [CREATE_PUBLISH_COMPLETION_QUERY_KEY]: '1'
            }
         })
         .catch((error) => {
            console.error('Create completion navigation failed:', error)
         })
   }

   const handleSendAd = async () => {
      if (isPublishing.value || isSaving.value) return

      if (!createStore.isAdFieldsFilled) {
         popupErrorStore.showError(buildCreateAdRequiredFieldsMessage(createStore))
         return
      }

      const result = await runCreateDraftMutationAction({
         draftValue: 0,
         pendingRef: isPublishing,
         redirectPath: CREATE_PUBLISHED_ROUTE,
         errorLogPrefix: CREATE_PUBLISH_LOG_PREFIX,
         createStore,
         popupErrorStore,
         publishSaveErrorMessage: CREATE_PUBLISH_SAVE_ERROR_MESSAGE,
         scheduleCreateNavigation,
         navigationDelayMs: CREATE_PUBLISH_REDIRECT_DELAY_MS,
         scheduleNavigationOnSuccess: !isMobileViewport.value
      })

      if (!result.success) return

      if (isMobileViewport.value) {
         redirectToCreateCompletion()
         return
      }

      popupErrorStore.showNotification(CREATE_PUBLISH_SUCCESS_MESSAGE)
   }

   const saveAd = async () => {
      if (isPublishing.value || isSaving.value) return

      closePopup()

      await runCreateDraftMutationAction({
         draftValue: 1,
         pendingRef: isSaving,
         redirectPath: CREATE_DRAFTS_ROUTE,
         errorLogPrefix: CREATE_SAVE_DRAFT_LOG_PREFIX,
         createStore,
         popupErrorStore,
         publishSaveErrorMessage: CREATE_PUBLISH_SAVE_ERROR_MESSAGE,
         scheduleCreateNavigation,
         navigationDelayMs: CREATE_SAVE_REDIRECT_DELAY_MS
      })
   }

   watch(
      () => [createStore.id, createStore.id_user_owner_ads],
      ([id]) => {
         if (!id || !createStore.id_user_owner_ads) return

         const nextQuery = buildCreateDraftRouteSyncQuery({
            routeQuery: route.query,
            store: createStore,
            fallbackUserId: userId
         })
         if (!nextQuery) return

         if (
            !hasCreateDraftRouteSyncChanged({
               routeQuery: route.query,
               nextQuery
            })
         ) {
            return
         }

         router.replace({ query: nextQuery }).catch((error) => {
            console.error('Create route sync failed:', error)
         })
      },
      { immediate: true }
   )

   onMounted(async () => {
      try {
         uiStore.setDropdownState(false)
         uiStore.closeUserMenu()
         closePopup()
         updateViewportFlag()
         resetState({ refreshUserCounts: false })

         if (import.meta.client) {
            window.addEventListener('resize', updateViewportFlag, {
               passive: true
            })
         }

         const flow = resolveCreateFlowFromRouteQuery(route.query)
         createStore.setCreateFlow(flow)
         syncCreateStoreCategoryIdsFromRoute({
            store: createStore,
            routeQuery: route.query,
            flow
         })
         await applyModerationUserPreset()

         const routeConditionId = resolveCreateConditionIdFromRouteQuery(route.query)

         if (!route.query.id && routeConditionId) {
            createStore.condition_id = routeConditionId
         }

         const { canLoad, routeId } = canLoadCreateDraftForUser({
            routeQuery: route.query,
            userId
         })

         if (
            token &&
            shouldHydrateCreateDraftFromRoute({
               canLoad,
               routeId,
               storeId: createStore.id
            })
         ) {
            try {
               await createStore.setStoreFromApi(routeId, {
                  routeQuery: route.query
               })
            } catch (error) {
               console.error('Create draft hydrate failed:', error)
               popupErrorStore.showError(CREATE_DRAFT_LOAD_ERROR_MESSAGE)
            }
         }

         if (!createStore.condition_id && routeConditionId) {
            createStore.condition_id = routeConditionId
         }
      } finally {
         isLoading.value = false
      }
   })

   onBeforeRouteLeave(async (to, from, next) => {
      clearCreateNavigationTimer()
      closePopup()
      const isLeavingCreateSection =
         isCreateRoutePath(from.path) && !isCreateRoutePath(to.path)

      if (!createStore.id) {
         if (isLeavingCreateSection) {
            moderationCreateStore.reset()
            resetState({ refreshUserCounts: false })
         }
         next()
         return
      }

      if (!isLeavingCreateSection) {
         next()
         return
      }

      if (skipLeaveAutosaveOnce.value) {
         skipLeaveAutosaveOnce.value = false
         moderationCreateStore.reset()
         resetState()
         next()
         return
      }

      await createStore.autoSaveField('is_finished', 1).catch(() => {})
      moderationCreateStore.reset()
      resetState()
      next()
   })

   onBeforeUnmount(() => {
      clearCreateNavigationTimer()
      if (!import.meta.client) return
      window.removeEventListener('resize', updateViewportFlag)
   })

   return {
      isPublishing,
      isSaving,
      isLoading,
      isAnyFieldFilled,
      isSavePopupOpen,
      handleSendAd,
      saveAd,
      closePopup
   }
}
