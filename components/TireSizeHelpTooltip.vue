<template>
   <HelpTooltip
      title="Как читать маркировку шины"
      aria-label="Подсказка по параметрам шины"
      :scheme-image="tireSchemeImage"
      scheme-image-alt="Схема маркировки шины"
      :points="tooltipPoints"
      :desktop-placement="'right-start'"
      :desktop-width="460"
   />
</template>

<script setup>
import HelpTooltip from '~/components/ui/HelpTooltip.vue'
import tireSchemeImage from '@/assets/images/shina.png'

const tooltipPoints = [
   {
      color: '#3366FF',
      code: '195',
      text: 'Ширина профиля шины в миллиметрах.'
   },
   {
      color: '#8E44FF',
      code: '65',
      text: 'Высота профиля в процентах от ширины. Этот показатель часто называют «профиль».'
   },
   {
      color: '#22B573',
      code: 'R15',
      text: 'Монтажный диаметр обода в дюймах при радиальной конструкции шины.'
   },
   {
      color: '#FFC928',
      code: '91',
      text: 'Индекс нагрузки — максимальная допустимая нагрузка на колесо.'
   },
   {
      color: '#F567F9',
      code: 'V',
      text: 'Индекс скорости — максимально допустимая скорость для шины.'
   }
]
</script>

