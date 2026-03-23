<template>
   <CreateAdPage v-if="isCreateAdPageMode" />
   <CreateCatalogPage v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#vue-router'
import CreateAdPage from '@/components/create/pages/CreateAdPage.vue'
import CreateCatalogPage from '@/components/create/pages/CreateCatalogPage.vue'

definePageMeta({
   requiresAuth: true
})

const CREATE_FORM_QUERY_KEYS = Object.freeze([
   'id',
   'main_category_id',
   'sub_category_id',
   'last_category_id'
])

const getQueryScalar = (query, key) => {
   const raw = query?.[key]
   return Array.isArray(raw) ? raw[0] : raw
}

const hasQueryValue = (query, key) => {
   const value = getQueryScalar(query, key)
   return value !== null && value !== undefined && value !== ''
}

const route = useRoute()
const isCreateAdPageMode = computed(() =>
   CREATE_FORM_QUERY_KEYS.some((key) => hasQueryValue(route.query, key))
)
</script>
