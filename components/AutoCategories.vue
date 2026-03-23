<template>
   <CatalogCategories
      :items="categoryItems"
      :active-key="activeKey"
      @select="emit('select', $event)"
   />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CatalogCategories from '@/components/catalog/blocks/CatalogCategories.vue'
import { PARTS_CATEGORIES } from '@/composables/catalog/useCatalogData'

defineProps({
   activeKey: {
      type: String,
      default: ''
   }
})

const emit = defineEmits(['select'])

const route = useRoute()
const city = computed(() => String(route.params.city || ''))

const categoryItems = computed(() =>
   PARTS_CATEGORIES.map((category) => ({
      ...category,
      to: `/${city.value}/parts/${category.key}`
   }))
)
</script>
