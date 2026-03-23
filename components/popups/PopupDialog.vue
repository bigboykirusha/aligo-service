<template>
  <BaseModal
    :model-value="modelValue"
    :title="resolvedTitle"
    size="sm"
    :show-body="showBody"
    :footer-align="'end'"
    :footer-direction="'row'"
    :footer-minimized="true"
    v-bind="attrs"
    @update:model-value="closePopup"
  >
    <PopupStack v-if="showBody" gap="lg" :top-pad="true">
      <slot name="body">
        <PopupText v-if="showMessage">{{ message }}</PopupText>
      </slot>
    </PopupStack>
    <template #footer>
      <UIButton
        variant="primary"
        :disabled="confirmDisabled"
        :loading="confirmLoading"
        @click="confirmAction"
      >
        {{ confirmText }}
      </UIButton>
      <UIButton
        variant="secondary"
        :disabled="cancelDisabled || confirmLoading"
        @click="cancelAction"
      >
        {{ cancelText }}
      </UIButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, useAttrs, useSlots } from 'vue'
import BaseModal from './BaseModal.vue'
import PopupStack from '~/components/popups/blocks/PopupStack.vue'
import PopupText from '~/components/popups/blocks/PopupText.vue'
import UIButton from '~/components/ui/UIButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: 'Вы уверены?'
  },
  confirmText: {
    type: String,
    default: 'Да'
  },
  cancelText: {
    type: String,
    default: 'Нет'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  cancelDisabled: {
    type: Boolean,
    default: false
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  showMessage: {
    type: Boolean,
    default: true
  }
})

const attrs = useAttrs()
const slots = useSlots()
const resolvedTitle = computed(() => props.title || props.message)
const showBody = computed(() => {
  if (attrs['show-body'] !== undefined) {
    return Boolean(attrs['show-body'])
  }

  return Boolean(slots.body || props.showMessage)
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const closePopup = () => {
  emit('close')
}

const confirmAction = () => {
  emit('confirm')
}

const cancelAction = () => {
  emit('cancel')
}
</script>
