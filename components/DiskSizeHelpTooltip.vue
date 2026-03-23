<template>
   <HelpTooltip
      title="Как читать маркировку диска"
      aria-label="Подсказка по параметрам диска"
      :scheme-image="diskSchemeImage"
      scheme-image-alt="Схема маркировки диска"
      :points="tooltipPoints"
      :desktop-placement="'right-start'"
      :desktop-width="460"
   />
</template>

<script setup>
import HelpTooltip from '~/components/ui/HelpTooltip.vue'
import diskSchemeImage from '@/assets/images/disctooltip.png'

const tooltipPoints = [
   {
      color: '#F567F9',
      code: 'D',
      text: 'Монтажный диаметр диска в дюймах.'
   },
   {
      color: '#3366FF',
      code: 'B',
      text: 'Посадочная ширина диска в дюймах.'
   },
   {
      color: '#FFC928',
      code: 'PCD',
      text: 'Количество крепёжных отверстий × диаметр расположения отверстий под болты в мм.'
   },
   {
      color: '#22B573',
      code: 'ET',
      text: 'Вылет колеса. Расстояние в мм между привалочной плоскостью и серединой ширины диска.'
   },
   {
      color: '#8E44FF',
      code: 'DIA',
      text: 'Диаметр центрального (ступичного) отверстия в мм.'
   }
]
</script>

