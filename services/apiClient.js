/**
 * Главный файл API клиента
 * Экспортирует все функции из модулей для обратной совместимости
 */

// Объявления
export {
   getAdsHistory,
   getAdsSimilar,
   getMyAds,
   getMyAdsCount,
   getCarsFiltered,
   getCarsSearch,
   getCars,
   createCarAd,
   updateCarAd,
   deleteAds,
   takeOffPublication,
   getDismissedFromPublicationReasonsByOwner,
   getTakeOffPublicationReasons,
   dismissFromPublicationByOwnerAds,
   closeAdsSuccessSell,
   publishAgainSelected,
   getDrafts,
   deleteFromDrafts,
   getCancelledAds,
   getArchives,
   deleteFromArchive,
   publishFromArchive,
   publishFromMainTab,
   getModerationAds,
   seeContact
} from './api/listingsApi'

// Автомобили и характеристики
export {
   getCarById,
   getCarBrands,
   getCarModels,
   getCarGenerations,
   getCarEquipment,
   getCarModifications,
   getAutoFullInfo,
   getCarTransmission,
   getCarBodyType,
   getCarEngineType,
   getCarState,
   getCarCondition,
   getCarDrive,
   getCarCountry,
   getColors,
   getYear,
   getCarsOwners,
   getCarsPts,
   getCarsDamage,
   getCarsPowerSteering,
   getCarsSalon,
   getCarsElectricWindow,
   getCarsWheels,
   getCarsAudioSystem,
   getCarsHeadlight,
   getCarsClimate,
   getCarsHandlebar,
   getCommunicationMethod
} from './api/carsApi'

// Мототехника
export {
   getMotoCondition,
   getMotoAvailability,
   getMotoEngineType,
   getMotoFuelFeed,
   getMotoStroke,
   getMotoPts,
   getMotoTransmission,
   getMotoCountOwner,
   getMotoSubCategory,
   getMopedType,
   getMopedBrand,
   getMopedModel,
   getMotorcycleType,
   getMotorcycleBrand,
   getMotorcycleModel,
   getMotoDriveType,
   getMotoCountCylinder,
   getMotoNumberOfGears,
   getMotoCylinderPosition,
   getMotoEngineCooling,
   getMotoById,
   getMotos,
   getMotosFilters,
   createMotoAd,
   updateMotoAd
} from './api/motoApi'

// Автотовары
export {
   createAutogoodsAd,
   getAutogoodsById,
   getAutogoodsFiltered,
   updateAutogoodsAd,
   getAutogoodsSubCategory,
   getAutogoodsLastCategory,
   getAutogoodsDiskBrand,
   getAutogoodsDiskModel,
   getAutogoodsDiskCondition,
   getAutogoodsDiskCount,
   getAutogoodsDiskRimWidth,
   getAutogoodsDiskRimDiameter,
   getAutogoodsDiskRimOffset,
   getAutogoodsDiskRimBolt,
   getAutogoodsDiskRimBoltDiameter,
   getAutogoodsDiskRimDia,
   getAutogoodsDiskRimType,
   getAutogoodsDiskRepairStatus,
   getAutogoodsDiskStraightenedCount,
   getAutogoodsDiskWeldedCount,
   getAutogoodsDiskCrackCount,
   getAutogoodsDiskGeometryChangeCount,
   getAutogoodsDiskColoringType,
   getAutogoodsDiskCentralCap,
   getAutogoodsDiskPressureSensor,
   getAutogoodsTireBrand,
   getAutogoodsTireCondition,
   getAutogoodsTireCount,
   getAutogoodsTireModel,
   getAutogoodsTireSeasonality,
   getAutogoodsTireYear,
   getAutogoodsTireStaggeredSet,
   getAutogoodsTireWidth,
   getAutogoodsTireHeight,
   getAutogoodsTireDiameter,
   getAutogoodsTireWidthRear,
   getAutogoodsTireHeightRear,
   getAutogoodsTireDiameterRear,
   getAutogoodsTireLoadIndex,
   getAutogoodsTireSpeedIndex,
   getAutogoodsTireRunFlat,
   getAutogoodsTireTreadDepth,
   getAutogoodsTireBulgeCounts,
   getAutogoodsTireSideRepairCount,
   getAutogoodsMotoTireCondition,
   getAutogoodsMotoTireBrand,
   getAutogoodsMotoTireWidth,
   getAutogoodsMotoTireHeight,
   getAutogoodsMotoTireDiameter,
   getAutogoodsMotoTireAxle,
   getAutogoodsMotorOilCondition,
   getAutogoodsMotorOilBrand,
   getAutogoodsMotorOilViscosityClassSae,
   getAutogoodsMotorOilVolume,
   getAutogoodsMotorOilStandartAcea,
   getAutogoodsMotorOilStandartApi,
   getAutogoodsMotorOilAllowOem,
   getAutogoodsMotorOilArticle,
   getAutogoodsWheelCondition,
   getAutogoodsWheelCount,
   getAutogoodsWheelBrand,
   getAutogoodsWheelModel,
   getAutogoodsWheelStaggeredSet,
   getAutogoodsWheelWidth,
   getAutogoodsWheelHeight,
   getAutogoodsWheelDiameter,
   getAutogoodsWheelWidthRear,
   getAutogoodsWheelHeightRear,
   getAutogoodsWheelDiameterRear,
   getAutogoodsWheelLoadIndex,
   getAutogoodsWheelSpeedIndex,
   getAutogoodsWheelSeasonality,
   getAutogoodsWheelRunFlat,
   getAutogoodsWheelTreadDepth,
   getAutogoodsWheelYear,
   getAutogoodsWheelDiskDiameter,
   getAutogoodsWheelDiskHoleCounts,
   getAutogoodsWheelDiskHoleDiameter,
   getAutogoodsWheelDiskType,
   getAutogoodsWheelDiskDia,
   getAutogoodsWheelOffsetEt,
   getAutogoodsWheelDiskWidth,
   getAutogoodsTireSectionWidth,
   getAutogoodsTireRimDiameter,
   getAutogoodsTireAspectRatio,
   getAutogoodsTireLoadIndice,
   getAutogoodsTireSpeedIndice,
   getAutogoodsTireHomologation
} from './api/autogoodsApi'

// Сообщения и чаты
export {
   fetchMessages,
   sendMessage,
   fetchLastMessages,
   deleteChats,
   markChatsAsRead,
   markDefinedMessagesAsRead
} from './api/messagesApi'

// Пользователи
export {
   getUser,
   getUserOtherInfo,
   getUserOtherAds,
   getUserOtherReviews,
   getUserPhoneEmail,
   getUserCount,
   updateUserInfo,
   getUsers,
   blockUser,
   getBlockedUsers,
   unblockUser,
   submitComplaint
} from './api/usersApi'

// Отзывы
export {
   sendReview,
   getAboutMeReviews,
   getLeftToAnotherReviews,
   deleteReview,
   replyToReview,
   deleteReviewReply
} from './api/reviewsApi'

// Уведомления
export {
   getNotifications,
   deleteNotificationById,
   deleteAllNotifications,
   markAllNotificationsAsRead,
   markNotificationAsRead
} from './api/notificationsApi'

// Локация
export {
   getRegions,
   getCitiesByRegion,
   getCityById,
   searchCitiesByName
} from './api/locationApi'

// Аутентификация
export {
   loginUserByPhone,
   confirmPhoneCode,
   confirmCode,
   getMyselfAuthEvents,
   logoutUser,
   logoutEverywhere
} from './api/authApi'

// Фильтры
export {
   getUserSavedFilters,
   saveFilter,
   fetchSavedFilters,
   updateNotifyFilters,
   deleteFilters
} from './api/filtersApi'

// Отчеты
export {
   requireReport,
   requireReportByVin,
   getReportById,
   fetchUserReports,
   getFullReportPrice
} from './api/reportsApi'

export {
   getWallet,
   getWalletTransactions,
   downloadWalletTransaction,
   depositWallet
} from './api/walletApi'

export {
   getPaidServicesList,
   calculateReportPurchase,
   submitReportPurchase,
   calculatePaidServicesPurchase,
   submitPaidServicesPurchase
} from './api/purchasesApi'

// Поддержка
export {
   sendSupport,
   getTechSupportThemes,
   getTechSupport
} from './api/supportApi'

// Прочее (SEO, документы, избранное)
export {
   getMainCategory,
   getSeoPage,
   getSiteDocuments,
   getSiteDocumentById
} from './api/miscApi'
