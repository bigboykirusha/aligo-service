<template>
   <HelpTooltip
      ref="helpRef"
      v-bind="$attrs"
      :title="title"
      :text="text"
      :icon="icon"
      :icon-only="iconOnly"
      :trigger-class="triggerClass"
      :aria-label="resolvedAriaLabel"
      desktop-placement="bottom-center"
      :desktop-width="520"
      :items="vinItems"
   />
</template>

<script setup>
import { computed, ref } from 'vue'
import HelpTooltip from '~/components/ui/HelpTooltip.vue'
import documentIcon from '@/assets/images/toolpic1.png'
import carIcon from '@/assets/images/toolpic2.png'

defineOptions({
   inheritAttrs: false
})

const props = defineProps({
   text: {
      type: String,
      default: 'Где найти VIN номер'
   },
   icon: {
      type: String,
      default: ''
   },
   iconOnly: {
      type: Boolean,
      default: false
   },
   triggerClass: {
      type: String,
      default: ''
   },
   ariaLabel: {
      type: String,
      default: ''
   }
})

const title = 'Где найти VIN номер'
const helpRef = ref(null)

const resolvedAriaLabel = computed(() => props.ariaLabel || title)

const vinItems = [
   {
      image: documentIcon,
      imageAlt: 'VIN в документах',
      title: 'В документах',
      description:
         'Идентификационный номер можно найти в СТС, ПТС и страховом полисе.'
   },
   {
      image: carIcon,
      imageAlt: 'VIN на автомобиле',
      title: 'На транспортном средстве',
      description:
         'VIN обычно расположен под лобовым стеклом, на стойке двери или под капотом.'
   }
]

defineExpose({
   open: () => helpRef.value?.open?.(),
   openIfMobile: () => helpRef.value?.openIfMobile?.()
})
</script>
