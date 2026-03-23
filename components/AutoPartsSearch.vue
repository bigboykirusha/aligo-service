<template>
   <CatalogVehicleSearch
      title="Подбор запчастей по автомобилю"
      @submit="emit('search', $event)"
      @change="emit('change', $event)"
   />
</template>

<script setup>
import CatalogVehicleSearch from '@/components/catalog/blocks/CatalogVehicleSearch.vue'

const emit = defineEmits(['search', 'change'])
</script>
