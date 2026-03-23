export const PROFILE_SKELETON_COUNTS = Object.freeze({
   favorites: 3,
   messages: 3,
   reviews: 2,
   notifications: 3,
   reports: 3,
   myAds: 3
})

export const resolveProfileSkeletonCount = (itemsCount, fallbackCount) =>
   Math.max(Number(itemsCount || 0), Number(fallbackCount || 0))
