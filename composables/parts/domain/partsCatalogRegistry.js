const node = (config) => ({
   children: [],
   filterPresetKey: 'catalog.base',
   filterSummary: [],
   description: '',
   ...config
})

const withChildren = (config, children) => node({ ...config, children })

const CATALOG_REQUEST_PATCH_BY_PATH_KEY = Object.freeze({
   'tires-disks-wheels': { sub_category_id: 1 },
   'tires-disks-wheels/passenger-tires': {
      sub_category_id: 1,
      last_category_id: 1
   },
   'tires-disks-wheels/disks': {
      sub_category_id: 1,
      last_category_id: 2
   },
   'tires-disks-wheels/disks/forged': {
      sub_category_id: 1,
      last_category_id: 2
   },
   'tires-disks-wheels/disks/alloy': {
      sub_category_id: 1,
      last_category_id: 2
   },
   'tires-disks-wheels/disks/stamped': {
      sub_category_id: 1,
      last_category_id: 2
   },
   'tires-disks-wheels/disks/spoked': {
      sub_category_id: 1,
      last_category_id: 2
   },
   'tires-disks-wheels/disks/composite': {
      sub_category_id: 1,
      last_category_id: 2
   },
   'tires-disks-wheels/wheels': {
      sub_category_id: 1,
      last_category_id: 3
   },
   'tires-disks-wheels/moto-tires': {
      sub_category_id: 1,
      last_category_id: 5
   },
   'tires-disks-wheels/moto-tires/front': {
      sub_category_id: 1,
      last_category_id: 5
   },
   'tires-disks-wheels/moto-tires/rear': {
      sub_category_id: 1,
      last_category_id: 5
   },
   'oils-and-chemistry': { sub_category_id: 10 },
   'oils-and-chemistry/motor-oils': {
      sub_category_id: 10,
      last_category_id: 7
   }
})

const ROOT_NODES = [
   withChildren(
      {
         key: 'tires-disks-wheels',
         slug: 'tires-disks-wheels',
         payloadPatch: { sub_category_id: 1 },
         title: 'Шины, диски и колеса',
         description:
            'Раздел шин, дисков и колес с подкатегориями для легковых, грузовых, мотошин, колпаков и колес в сборе. Тут могла быть ваша реклама.',
         filterSummary: [
            'Легковые шины: размеры, индексы, омологация, сезонность, комплектность',
            'Диски: бренд/модель, обод, ET, PCD, DIA (типы дисков вынесены в подразделы)',
            'Колеса в сборе: параметры шин + параметры диска + сезонность',
            'Грузовые/спецшины, мотошины, колпаки: профильные фильтры + цена/состояние/поиск'
         ],
         filterPresetKey: 'catalog.base'
      },
      [
         node({
            key: 'passenger-tires',
            slug: 'passenger-tires',
            payloadPatch: { sub_category_id: 1, last_category_id: 1 },
            title: 'Легковые шины',
            filterPresetKey: 'tires.passenger',
            filterSummary: [
               'Бренд > модель, размеры, индексы, сезонность, комплектность, год, состояние, цена, поиск'
            ]
         }),
         withChildren(
            {
               key: 'disks',
               slug: 'disks',
               payloadPatch: { sub_category_id: 1, last_category_id: 2 },
               title: 'Диски',
               filterPresetKey: 'tires.disks'
            },
            [
               node({ key: 'disks-forged', slug: 'forged', title: 'Кованые', filterPresetKey: 'tires.disks' }),
               node({ key: 'disks-alloy', slug: 'alloy', title: 'Литые', filterPresetKey: 'tires.disks' }),
               node({ key: 'disks-stamped', slug: 'stamped', title: 'Штампованные', filterPresetKey: 'tires.disks' }),
               node({ key: 'disks-spoked', slug: 'spoked', title: 'Спицованные', filterPresetKey: 'tires.disks' }),
               node({ key: 'disks-composite', slug: 'composite', title: 'Сборные', filterPresetKey: 'tires.disks' })
            ]
         ),
         node({ key: 'wheels', slug: 'wheels', title: 'Колёса (в сборе)', filterPresetKey: 'tires.wheels' }),
         node({ key: 'truck-tires', slug: 'truck-tires', title: 'Шины для грузовиков и спецтехники', filterPresetKey: 'tires.truck' }),
         withChildren(
            {
               key: 'moto-tires',
               slug: 'moto-tires',
               title: 'Мотошины',
               filterPresetKey: 'tires.moto'
            },
            [
               node({
                  key: 'moto-tires-front',
                  slug: 'front',
                  title: 'Передняя ось',
                  filterPresetKey: 'tires.moto.front',
                  payloadPatch: { moto_tires_axle_id: 2 }
               }),
               node({
                  key: 'moto-tires-rear',
                  slug: 'rear',
                  title: 'Задняя ось',
                  filterPresetKey: 'tires.moto.rear',
                  payloadPatch: { moto_tires_axle_id: 1 }
               })
            ]
         ),
         node({ key: 'hubcaps', slug: 'hubcaps', title: 'Колпаки', filterPresetKey: 'tires.hubcaps' })
      ]
   ),
   withChildren(
      {
         key: 'spare-parts',
         slug: 'spare-parts',
         title: 'Запчасти',
         filterPresetKey: 'parts.base',
         description:
            'Общий раздел запчастей с базовым подбором по авто (Марка → Модель → Поколение) и подкатегориями для автомобилей, грузовиков/спецтехники, мототехники и водного транспорта.',
         filterSummary: [
            'Подбор по авто: Марка → Модель → Поколение (последовательное отображение)',
            'Цена',
            'Состояние',
            'Поиск по описанию'
         ]
      },
      [
         withChildren(
            {
               key: 'for-cars',
               slug: 'for-cars',
               title: 'Для автомобилей',
               filterPresetKey: 'parts.cars.base',
               filterSummary: [
                  'Подбор по авто + текстовый поиск',
                  'Вид запчасти',
                  'Производитель (бренды, чекбоксы)',
                  'Цена, состояние, поиск'
               ]
            },
            [
               node({ key: 'autolight', slug: 'autolight', title: 'Автосвет', filterPresetKey: 'parts.cars.autolight' }),
               node({ key: 'car-for-parts', slug: 'car-for-parts', title: 'Автомобиль на запчасти', filterPresetKey: 'parts.cars.car-for-parts' }),
               node({ key: 'battery', slug: 'battery', title: 'Аккумуляторы', filterPresetKey: 'parts.cars.battery' }),
               node({ key: 'engine', slug: 'engine', title: 'Двигатель', filterPresetKey: 'parts.cars.engine' }),
               node({ key: 'body', slug: 'body', title: 'Кузов', filterPresetKey: 'parts.cars.body' }),
               node({ key: 'suspension', slug: 'suspension', title: 'Подвеска', filterPresetKey: 'parts.cars.suspension' }),
               node({ key: 'steering', slug: 'steering', title: 'Рулевое управление', filterPresetKey: 'parts.cars.steering' }),
               node({ key: 'interior', slug: 'interior', title: 'Салон', filterPresetKey: 'parts.cars.interior' }),
               node({ key: 'cooling', slug: 'cooling', title: 'Система охлаждения', filterPresetKey: 'parts.cars.cooling' }),
               node({ key: 'transmission-drive', slug: 'transmission-drive', title: 'Трансмиссия и привод', filterPresetKey: 'parts.cars.transmission-drive' }),
               node({ key: 'electrics', slug: 'electrics', title: 'Электрооборудование', filterPresetKey: 'parts.cars.electrics' })
            ]
         ),
         withChildren(
            {
               key: 'for-trucks-special',
               slug: 'for-trucks-special',
               title: 'Для грузовиков и спецтехники',
               filterPresetKey: 'parts.truck.base',
               filterSummary: [
                  'Вид запчасти',
                  'Тип техники',
                  'Марка → Модель → Поколение (марка после выбора типа техники)',
                  'Цена, состояние, поиск'
               ]
            },
            [
               node({ key: 'truck-engines', slug: 'truck-engines', title: 'Двигатели и комплектующие', filterPresetKey: 'parts.truck.engines' }),
               node({ key: 'truck-transmission', slug: 'truck-transmission', title: 'Трансмиссия', filterPresetKey: 'parts.truck.transmission' }),
               node({ key: 'truck-suspension-steering', slug: 'truck-suspension-steering', title: 'Подвеска и рулевое управление', filterPresetKey: 'parts.truck.suspension-steering' }),
               node({ key: 'truck-cab', slug: 'truck-cab', title: 'Кабина', filterPresetKey: 'parts.truck.cab' }),
               node({ key: 'truck-frames-bodies', slug: 'truck-frames-bodies', title: 'Рамы, кузова и надстройки', filterPresetKey: 'parts.truck.frames-bodies' }),
               node({ key: 'truck-electronics-light', slug: 'truck-electronics-light', title: 'Электроника и свет', filterPresetKey: 'parts.truck.electronics-light' }),
               node({ key: 'truck-hydraulic-pneumatic', slug: 'truck-hydraulic-pneumatic', title: 'Гидравлические и пневмосистемы', filterPresetKey: 'parts.truck.hydraulic-pneumatic' }),
               node({ key: 'truck-brakes', slug: 'truck-brakes', title: 'Тормозная система', filterPresetKey: 'parts.truck.brakes' }),
               node({ key: 'truck-attachments', slug: 'truck-attachments', title: 'Для навесного оборудования', filterPresetKey: 'parts.truck.attachments' }),
               node({ key: 'truck-trailer-parts', slug: 'truck-trailer-parts', title: 'Для прицепной техники', filterPresetKey: 'parts.truck.trailer-parts' }),
               node({ key: 'truck-disassembly', slug: 'truck-disassembly', title: 'Техника на разбор', filterPresetKey: 'parts.truck.disassembly' })
            ]
         ),
         node({
            key: 'for-moto',
            slug: 'for-moto',
            title: 'Для мототехники',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         }),
         node({
            key: 'for-water',
            slug: 'for-water',
            title: 'Для водного транспорта',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         }),
      ]
   ),
   withChildren(
      {
         key: 'consumables-maintenance',
         slug: 'consumables-maintenance',
         title: 'Расходники для ТО',
         filterPresetKey: 'parts.consumables.base',
         description:
            'Раздел расходников для ТО с главным фильтром "Тип товара" и зависимым подбором по авто (Марка → Модель → Поколение).',
         filterSummary: [
            'Тип товара (главный параметр)',
            'Марка → Модель → Поколение (Марка после выбора типа товара)',
            'Цена, состояние, поиск по описанию'
         ]
      },
      [
         node({ key: 'consumables-brake-pads', slug: 'brake-pads', title: 'Тормозные колодки', filterPresetKey: 'parts.consumables.brake-pads' }),
         node({ key: 'consumables-wear-sensors', slug: 'wear-sensors', title: 'Датчики износа тормозных колодок', filterPresetKey: 'parts.consumables.wear-sensors' }),
         node({ key: 'consumables-spark-plugs', slug: 'spark-plugs', title: 'Свечи зажигания', filterPresetKey: 'parts.consumables.spark-plugs' }),
         node({ key: 'consumables-oil-filters', slug: 'oil-filters', title: 'Масляные фильтры', filterPresetKey: 'parts.consumables.oil-filters' }),
         node({ key: 'consumables-drain-plug', slug: 'drain-plug', title: 'Сливная пробка поддона', filterPresetKey: 'parts.consumables.drain-plug' }),
         node({ key: 'consumables-drain-plug-gasket', slug: 'drain-plug-gasket', title: 'Прокладка сливной пробки поддона', filterPresetKey: 'parts.consumables.drain-plug-gasket' }),
         node({ key: 'consumables-air-filter', slug: 'air-filter', title: 'Воздушный фильтр', filterPresetKey: 'parts.consumables.air-filter' }),
         node({ key: 'consumables-cabin-filter', slug: 'cabin-filter', title: 'Салонный фильтр', filterPresetKey: 'parts.consumables.cabin-filter' }),
         node({ key: 'consumables-fuel-filter', slug: 'fuel-filter', title: 'Топливный фильтр', filterPresetKey: 'parts.consumables.fuel-filter' }),
         node({ key: 'consumables-brake-disc', slug: 'brake-disc', title: 'Тормозной диск', filterPresetKey: 'parts.consumables.brake-disc' }),
         node({ key: 'consumables-brake-drum', slug: 'brake-drum', title: 'Тормозной барабан', filterPresetKey: 'parts.consumables.brake-drum' }),
         node({ key: 'consumables-wiper-blades', slug: 'wiper-blades', title: 'Щётки стеклоочистителя', filterPresetKey: 'parts.consumables.wiper-blades' }),
         node({ key: 'consumables-engine-oil', slug: 'engine-oil', title: 'Моторное масло', filterPresetKey: 'parts.consumables.engine-oil' }),
         node({ key: 'consumables-brake-fluid', slug: 'brake-fluid', title: 'Тормозная жидкость', filterPresetKey: 'parts.consumables.brake-fluid' }),
         node({ key: 'consumables-coolant', slug: 'coolant', title: 'Охлаждающая жидкость', filterPresetKey: 'parts.consumables.coolant' }),
         node({ key: 'consumables-hydraulic-fluid', slug: 'hydraulic-fluid', title: 'Гидравлическая жидкость', filterPresetKey: 'parts.consumables.hydraulic-fluid' }),
         node({ key: 'consumables-transmission-oil', slug: 'transmission-oil', title: 'Трансмиссионное масло', filterPresetKey: 'parts.consumables.transmission-oil' })
      ]
   ),
   node({
      key: 'tools',
      slug: 'tools',
      title: 'Инструменты',
      filterPresetKey: 'catalog.base',
      description: 'Раздел инструментов с базовыми фильтрами: цена, состояние и поиск.',
      filterSummary: ['Цена', 'Состояние', 'Поиск']
   }),
   withChildren(
      {
         key: 'audio-video',
         slug: 'audio-video',
         title: 'Аудио- и видеотехника',
         filterPresetKey: 'catalog.base',
         description:
            'Раздел аудио- и видеотехники для авто с базовыми фильтрами на уровне раздела и специализированными фильтрами в подкатегориях (магнитолы, акустика, видеорегистраторы, усилители).',
         filterSummary: [
            'Цена',
            'Состояние',
            'Поиск'
         ]
      },
      [
         node({
            key: 'head-units',
            slug: 'head-units',
            title: 'Магнитолы',
            filterPresetKey: 'audio.head-units',
            filterSummary: [
               'Состояние',
               'Производитель',
               'Типоразмер (1DIN / 2DIN / штатное место)',
               'Android (Все / Да / Нет)',
               'Цена, Поиск'
            ]
         }),
         node({
            key: 'acoustics',
            slug: 'acoustics',
            title: 'Автоакустика',
            filterPresetKey: 'audio.acoustics',
            filterSummary: [
               'Цена, Состояние, Производитель',
               'Тип акустики, количество полос, типоразмер',
               'Номинальная мощность, импеданс, поиск'
            ]
         }),
         node({
            key: 'dashcams',
            slug: 'dashcams',
            title: 'Видеорегистраторы',
            filterPresetKey: 'audio.dashcams',
            filterSummary: [
               'Цена, Состояние, Производитель',
               'Конструкция, количество камер',
               'Макс. разрешение видеозаписи, поиск'
            ]
         }),
         node({
            key: 'amplifiers',
            slug: 'amplifiers',
            title: 'Усилители',
            filterPresetKey: 'audio.amplifiers',
            filterSummary: [
               'Цена, Состояние, Производитель',
               'Тип (штатный / универсальный)',
               'Поиск'
            ]
         }),
         node({
            key: 'frames',
            slug: 'frames',
            title: 'Переходные рамки',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         }),
         node({
            key: 'boxes-podiums',
            slug: 'boxes-podiums',
            title: 'Короба и подиумы',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         }),
         node({
            key: 'audio-accessories',
            slug: 'audio-accessories',
            title: 'Аксессуары для автоакустики',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         }),
         node({
            key: 'other',
            slug: 'other',
            title: 'Другое',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         })
      ]
   ),
   withChildren(
      {
         key: 'anti-theft',
         slug: 'anti-theft',
         title: 'Противоугонные устройства',
         filterPresetKey: 'catalog.base',
         description:
            'Противоугонные устройства с базовыми фильтрами и подкатегориями: сигнализации, иммобилайзеры, механические блокираторы и спутниковые системы.',
         filterSummary: ['Цена', 'Состояние', 'Поиск']
      },
      [
         node({ key: 'alarms', slug: 'alarms', title: 'Автосигнализации', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'immobilizers', slug: 'immobilizers', title: 'Иммобилайзеры', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'mechanical-locks', slug: 'mechanical-locks', title: 'Механические блокираторы', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'satellite-systems', slug: 'satellite-systems', title: 'Спутниковые системы', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] })
      ]
   ),
   node({
      key: 'gps',
      slug: 'gps',
      title: 'GPS-навигаторы',
      filterPresetKey: 'catalog.base',
      description: 'GPS-навигаторы с базовыми фильтрами: цена, состояние и поиск.',
      filterSummary: ['Цена', 'Состояние', 'Поиск']
   }),
   withChildren(
      {
         key: 'accessories',
         slug: 'accessories',
         title: 'Аксессуары',
         filterPresetKey: 'catalog.base',
         description:
            'Раздел аксессуаров с базовыми фильтрами на уровне раздела и специализированными фильтрами для щеток стеклоочистителя, наборов автомобилиста, ухода, ковриков и чехлов.',
         filterSummary: ['Цена', 'Состояние', 'Поиск']
      },
      [
         node({
            key: 'wiper-blades',
            slug: 'wiper-blades',
            title: 'Щётки стеклоочистителя',
            filterPresetKey: 'accessories.wipers',
            filterSummary: [
               'Место установки, длина щетки, длина второй щетки',
               'Тип крепления, производитель, тип щетки',
               'Цена, состояние, поиск'
            ]
         }),
         withChildren(
            {
               key: 'protection-decor',
               slug: 'protection-decor',
               title: 'Защита и декор',
               filterPresetKey: 'catalog.base',
               description:
                  'Раздел защиты и декора с базовыми фильтрами и специализированными фильтрами для элементов защиты кузова, дефлекторов, брызговиков и силовых бамперов.',
               filterSummary: ['Цена', 'Состояние', 'Поиск']
            },
            [
               node({
                  key: 'headlights-sills-bumpers',
                  slug: 'headlights-sills-bumpers',
                  title: 'Для фар, порогов и бамперов',
                  filterPresetKey: 'protection.headlights-sills-bumpers',
                  filterSummary: ['Материал', 'Назначение', 'Цена', 'Состояние', 'Поиск']
               }),
               node({ key: 'badges-stickers', slug: 'badges-stickers', title: 'Наклейки, шильдики и значки', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({
                  key: 'deflectors',
                  slug: 'deflectors',
                  title: 'Дефлекторы',
                  filterPresetKey: 'protection.deflectors',
                  filterSummary: ['Место установки', 'Цена', 'Состояние', 'Поиск']
               }),
               node({ key: 'engine-gearbox-protection', slug: 'engine-gearbox-protection', title: 'Для картера и КПП', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({
                  key: 'mudguards-liners',
                  slug: 'mudguards-liners',
                  title: 'Брызговики и подкрылки',
                  filterPresetKey: 'protection.mudguards',
                  filterSummary: ['Место крепления', 'Цена', 'Состояние', 'Поиск']
               }),
               node({ key: 'plate-frames', slug: 'plate-frames', title: 'Рамки номерного знака', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({
                  key: 'power-bumpers-sills',
                  slug: 'power-bumpers-sills',
                  title: 'Силовые бамперы и пороги',
                  filterPresetKey: 'protection.power-bumpers',
                  filterSummary: ['Вид защиты', 'Цена', 'Состояние', 'Поиск']
               }),
               node({ key: 'insulation', slug: 'insulation', title: 'Утеплители', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'additional-light', slug: 'additional-light', title: 'Дополнительный свет', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'snorkels', slug: 'snorkels', title: 'Шноркели', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] })
            ]
         ),
         withChildren(
            {
               key: 'interior-accessories',
               slug: 'interior-accessories',
               title: 'Для салона',
               filterPresetKey: 'catalog.base',
               filterSummary: ['Цена', 'Состояние', 'Поиск']
            },
            [
               node({ key: 'mats', slug: 'mats', title: 'Коврики', filterPresetKey: 'accessories.mats', filterSummary: ['Бренд, материал, тип коврика', 'Цена, состояние, поиск'] }),
               node({ key: 'covers-capes', slug: 'covers-capes', title: 'Чехлы и накидки', filterPresetKey: 'accessories.covers', filterSummary: ['Бренд, материал, тип чехла', 'Цена, состояние, поиск'] }),
               node({ key: 'keys-fobs', slug: 'keys-fobs', title: 'Ключи и брелоки', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'curtains', slug: 'curtains', title: 'Шторки', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'bags-organizers', slug: 'bags-organizers', title: 'Сумки и органайзеры', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'steering-wheel-covers', slug: 'steering-wheel-covers', title: 'Оплётка на руль', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'armrests', slug: 'armrests', title: 'Подлокотники', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'phone-holders', slug: 'phone-holders', title: 'Держатели для телефона', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'gear-knobs', slug: 'gear-knobs', title: 'Ручки КПП', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'car-refrigerators', slug: 'car-refrigerators', title: 'Автохолодильники', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'air-fresheners', slug: 'air-fresheners', title: 'Ароматизаторы', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'sound-vibration-insulation', slug: 'sound-vibration-insulation', title: 'Шумо- и виброизоляция', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'tinting', slug: 'tinting', title: 'Тонировка', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
               node({ key: 'accessories-other', slug: 'other', title: 'Другое', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] })
            ]
         ),
         node({ key: 'wheel-accessories', slug: 'wheel-accessories', title: 'Для колёс', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'moto-water-accessories', slug: 'moto-water-accessories', title: 'Для мото- и водного транспорта', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         withChildren(
            {
               key: 'heating-equipment',
               slug: 'heating-equipment',
               title: 'Отопительное оборудование',
               filterPresetKey: 'catalog.base',
               description:
                  'Отопительное оборудование с базовыми фильтрами на уровне раздела и специализированными фильтрами для автономных отопителей и подогревателей.',
               filterSummary: ['Цена', 'Состояние', 'Поиск']
            },
            [
               node({
                  key: 'autonomous-heaters',
                  slug: 'autonomous-heaters',
                  title: 'Автономные отопители',
                  filterPresetKey: 'heating.fuel-brand',
                  filterSummary: ['Бренд', 'Тип топлива', 'Цена', 'Состояние', 'Поиск']
               }),
               node({
                  key: 'preheaters',
                  slug: 'preheaters',
                  title: 'Автономные подогреватели',
                  filterPresetKey: 'heating.fuel-brand',
                  filterSummary: ['Бренд', 'Тип топлива', 'Цена', 'Состояние', 'Поиск']
               }),
               node({
                  key: 'aircon-refrigeration',
                  slug: 'aircon-refrigeration',
                  title: 'Кондиционеры и рефрижераторы',
                  filterPresetKey: 'catalog.base',
                  filterSummary: ['Цена', 'Состояние', 'Поиск']
               }),
               node({
                  key: 'heating-parts',
                  slug: 'heating-parts',
                  title: 'Запчасти и комплектующие',
                  filterPresetKey: 'catalog.base',
                  filterSummary: ['Цена', 'Состояние', 'Поиск']
               }),
               node({
                  key: 'heating-other',
                  slug: 'heating-other',
                  title: 'Другое',
                  filterPresetKey: 'catalog.base',
                  filterSummary: ['Цена', 'Состояние', 'Поиск']
               })
            ]
         ),
         node({
            key: 'motorist-kit',
            slug: 'motorist-kit',
            title: 'Набор автомобилиста',
            filterPresetKey: 'accessories.motorist-kit',
            filterSummary: ['Тип аксессуара', 'Цена', 'Состояние', 'Поиск']
         }),
         node({
            key: 'care',
            slug: 'care',
            title: 'Уход',
            filterPresetKey: 'accessories.care',
            filterSummary: ['Тип аксессуара', 'Цена', 'Состояние', 'Поиск']
         })
      ]
   ),
   node({
      key: 'equipment',
      slug: 'equipment',
      title: 'Экипировка',
      filterPresetKey: 'catalog.base',
      description: 'Раздел экипировки с базовыми фильтрами: цена, состояние и поиск.',
      filterSummary: ['Цена', 'Состояние', 'Поиск']
   }),
   withChildren(
      {
         key: 'oils-and-chemistry',
         slug: 'oils-and-chemistry',
         title: 'Масла и автохимия',
         filterPresetKey: 'catalog.base',
         description:
            'Масла и автохимия с базовыми фильтрами на уровне раздела и специализированными пресетами для масел и жидкостей.',
         filterSummary: ['Цена', 'Состояние', 'Поиск']
      },
      [
         node({
            key: 'motor-oils',
            slug: 'motor-oils',
            title: 'Моторные масла',
            filterPresetKey: 'fluids.engine-oil',
            filterSummary: ['Производитель, SAE, объем', 'ACEA, API, допуски OEM', 'Цена, состояние, поиск']
         }),
         node({
            key: 'transmission-oils',
            slug: 'transmission-oils',
            title: 'Трансмиссионные масла',
            filterPresetKey: 'fluids.transmission-oil',
            filterSummary: ['Производитель, SAE, объем', 'ATF, API, допуски OEM', 'Цена, состояние, поиск']
         }),
         node({
            key: 'coolants',
            slug: 'coolants',
            title: 'Охлаждающие жидкости',
            filterPresetKey: 'fluids.coolant',
            filterSummary: ['Производитель, цвет, объем', 'ASTM, допуски OEM', 'Цена, состояние, поиск']
         }),
         node({ key: 'brake-fluids', slug: 'brake-fluids', title: 'Тормозные жидкости', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({
            key: 'hydraulic-fluids',
            slug: 'hydraulic-fluids',
            title: 'Гидравлические жидкости',
            filterPresetKey: 'fluids.hydraulic',
            filterSummary: ['Производитель, объем', 'Допуски OEM', 'Цена, состояние, поиск']
         }),
         node({ key: 'washer-fluids', slug: 'washer-fluids', title: 'Жидкости для омывателя стекла', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'additives-lubricants', slug: 'additives-lubricants', title: 'Промывочные жидкости, присадки и смазки', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'other-oils', slug: 'other-oils', title: 'Другие масла', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'autocosmetics', slug: 'autocosmetics', title: 'Автокосметика и аксессуары', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'fuel', slug: 'fuel', title: 'Топливо', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] })
      ]
   ),
   withChildren(
      {
         key: 'trailers',
         slug: 'trailers',
         title: 'Прицепы',
         filterPresetKey: 'catalog.base',
         description:
            'Прицепы с базовыми фильтрами на уровне раздела и специализированными фильтрами для бортовых, водных прицепов и комплектующих.',
         filterSummary: ['Цена', 'Состояние', 'Поиск']
      },
      [
         node({
            key: 'flatbed',
            slug: 'flatbed',
            title: 'Бортовые',
            filterPresetKey: 'trailers.flatbed',
            filterSummary: ['Производитель, количество осей', 'Полная масса (от/до), функция самосвала', 'Цена, состояние, поиск']
         }),
         node({
            key: 'water-transport',
            slug: 'water-transport',
            title: 'Для водного транспорта',
            filterPresetKey: 'trailers.water',
            filterSummary: ['Производитель, вид водной техники', 'Цена, состояние, поиск']
         }),
         node({ key: 'tow-trailers', slug: 'tow-trailers', title: 'Эвакуаторы', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({
            key: 'trailer-parts',
            slug: 'trailer-parts',
            title: 'Запчасти и комплектующие',
            filterPresetKey: 'trailers.parts',
            filterSummary: ['Тип', 'Цена', 'Состояние', 'Поиск']
         }),
         node({ key: 'trailers-other', slug: 'trailers-other', title: 'Другое', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] })
      ]
   ),
   withChildren(
      {
         key: 'roof-racks-towbars',
         slug: 'roof-racks-towbars',
         title: 'Багажники и фаркопы',
         filterPresetKey: 'catalog.base',
         description:
            'Багажники и фаркопы с базовыми фильтрами на уровне раздела и фильтром по бренду для поперечных дуг и комплектующих.',
         filterSummary: ['Цена', 'Состояние', 'Поиск']
      },
      [
         node({
            key: 'crossbars',
            slug: 'crossbars',
            title: 'Поперечные дуги и комплектующие',
            filterPresetKey: 'roof-racks.crossbars',
            filterSummary: ['Бренд', 'Цена', 'Состояние', 'Поиск']
         }),
         node({
            key: 'roof-rails',
            slug: 'roof-rails',
            title: 'Рейлинги на крышу',
            filterPresetKey: 'catalog.base',
            filterSummary: ['Цена', 'Состояние', 'Поиск']
         }),
         node({ key: 'towbars-parts', slug: 'towbars-parts', title: 'Фаркопы и комплектующие', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'bike-ski-racks', slug: 'bike-ski-racks', title: 'Крепления для велосипедов и лыж', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'expedition-racks', slug: 'expedition-racks', title: 'Экспедиционные багажники', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'roof-boxes', slug: 'roof-boxes', title: 'Автобоксы', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] }),
         node({ key: 'kung', slug: 'kung', title: 'КУНГ', filterPresetKey: 'catalog.base', filterSummary: ['Цена', 'Состояние', 'Поиск'] })
      ]
   )
]

const attachMeta = (nodes, parent = null, trail = []) =>
   nodes.map((source) => {
      const nextTrail = [...trail, source.slug]
      const children = attachMeta(source.children || [], source, nextTrail)
      const pathKey = nextTrail.join('/')
      const payloadPatch = {
         ...(CATALOG_REQUEST_PATCH_BY_PATH_KEY[pathKey] || {}),
         ...((source.payloadPatch && typeof source.payloadPatch === 'object')
            ? source.payloadPatch
            : {})
      }
      return {
         ...source,
         parentKey: parent?.key || null,
         trail: nextTrail,
         pathKey,
         depth: nextTrail.length - 1,
         ...(Object.keys(payloadPatch).length ? { payloadPatch } : {}),
         children
      }
   })

const ROOT_TREE = attachMeta(ROOT_NODES)
const PARTS_CATALOG_VIRTUAL_ROOT_NODE = Object.freeze({
   key: 'parts-catalog-root',
   slug: '',
   title: 'Автотовары',
   description:
      'Корневой раздел автотоваров. Для большинства категорий доступны базовые фильтры: цена, состояние и поиск по описанию.',
   filterPresetKey: 'catalog.base',
   filterSummary: [
      'Цена (от/до)',
      'Состояние (Все / Новые / Б/у)',
      'Поиск по описанию'
   ],
   trail: [],
   pathKey: '',
   depth: -1,
   parentKey: null,
   children: ROOT_TREE
})

const flattenTree = (nodes, result = []) => {
   for (const item of nodes) {
      result.push(item)
      if (Array.isArray(item.children) && item.children.length) {
         flattenTree(item.children, result)
      }
   }
   return result
}

const FLAT_NODES = flattenTree(ROOT_TREE)
const NODE_BY_PATH_KEY = new Map(FLAT_NODES.map((item) => [item.pathKey, item]))

export const AUTOGOODS_ROOT_CATEGORIES = ROOT_TREE
export const AUTOGOODS_ROOT_NODE = PARTS_CATALOG_VIRTUAL_ROOT_NODE

export const getPartsCatalogRootCategories = () => ROOT_TREE
export const getPartsCatalogRootNode = () => PARTS_CATALOG_VIRTUAL_ROOT_NODE

export const getPartsCatalogCategoryByPathKey = (pathKey) =>
   NODE_BY_PATH_KEY.get(String(pathKey || '')) || null

export const resolvePartsCatalogCategoryBySlugTrail = (slugTrail) => {
   const normalizedTrail = Array.isArray(slugTrail)
      ? slugTrail.map((item) => String(item || '').toLowerCase()).filter(Boolean)
      : []

   if (!normalizedTrail.length) {
      return {
         matched: false,
         node: null,
         trail: [],
         pathKey: '',
         matchedDepth: -1,
         isRootListing: true
      }
   }

   let currentNodes = ROOT_TREE
   let currentNode = null
   let matchedDepth = -1

   for (let index = 0; index < normalizedTrail.length; index += 1) {
      const segment = normalizedTrail[index]
      const nextNode = currentNodes.find((item) => item.slug === segment) || null
      if (!nextNode) break
      currentNode = nextNode
      currentNodes = nextNode.children || []
      matchedDepth = index
   }

   const matched = Boolean(currentNode) && matchedDepth === normalizedTrail.length - 1

   return {
      matched,
      node: currentNode,
      trail: matched ? currentNode.trail : normalizedTrail.slice(0, Math.max(0, matchedDepth + 1)),
      pathKey: matched && currentNode ? currentNode.pathKey : '',
      matchedDepth,
      isRootListing: false
   }
}

export const buildPartsCatalogCategoryPath = ({ city, trail = [] }) => {
   const normalizedCity = String(city || '').trim()
   const path = Array.isArray(trail) ? trail.filter(Boolean).join('/') : ''
   if (!normalizedCity) return path ? `/parts/${path}` : '/parts'
   return path ? `/${normalizedCity}/parts/${path}` : `/${normalizedCity}/parts`
}

export const getPartsCatalogCategoryBreadcrumbTitle = (node) => {
   if (!node) return 'Автотовары'
   return node.depth <= 0 ? `Автотовары: ${node.title}` : node.title
}

export const getPartsCatalogChildNavItems = ({ node, city }) => {
   if (!node || !Array.isArray(node.children)) return []
   return node.children.map((child) => ({
      key: child.key,
      slug: child.slug,
      label: child.title,
      to: buildPartsCatalogCategoryPath({ city, trail: child.trail })
   }))
}

export const listPartsCatalogCategoryAncestors = (node) => {
   if (!node) return []
   return node.trail
      .map((_, index) => getPartsCatalogCategoryByPathKey(node.trail.slice(0, index + 1).join('/')))
      .filter(Boolean)
}
