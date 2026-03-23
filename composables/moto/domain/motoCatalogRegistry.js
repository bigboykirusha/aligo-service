const node = (config) => ({
   children: [],
   filterPresetKey: 'catalog.base',
   filterSummary: [],
   description: '',
   ...config
})

const ROOT_NODES = [
   node({
      key: 'motorcycles',
      slug: 'motorcycles',
      title: 'Мотоциклы',
      filterPresetKey: 'moto.motorcycles',
      filterSummary: [
         'Тип, состояние, год выпуска, цена, пробег',
         'Марка → Серия → Модель',
         'Страна происхождения, тип двигателя',
         'Тех. характеристики с зависимым скрытием полей'
      ]
   }),
   node({
      key: 'snowmobiles',
      slug: 'snowmobiles',
      title: 'Снегоходы',
      filterPresetKey: 'moto.snowmobiles',
      filterSummary: [
         'Тип, состояние, год выпуска, цена, пробег',
         'Марка → Серия → Модель',
         'Страна происхождения, тип двигателя',
         'Объём, мощность, пассажиры, ширина гусениц'
      ]
   }),
   node({
      key: 'atv',
      slug: 'atv',
      title: 'Вездеходы',
      filterPresetKey: 'moto.atv',
      filterSummary: [
         'Тип, состояние, год выпуска, цена, пробег',
         'Марка → Серия → Модель',
         'Страна происхождения, тип двигателя',
         'Объём, мощность, макс. пассажиров'
      ]
   }),
   node({
      key: 'karting',
      slug: 'karting',
      title: 'Картинг',
      filterPresetKey: 'moto.karting',
      filterSummary: ['Состояние', 'Цена', 'Поиск по описанию']
   }),
   node({
      key: 'quad-buggy',
      slug: 'quad-buggy',
      title: 'Квадроциклы и багги',
      filterPresetKey: 'moto.quad-buggy',
      filterSummary: [
         'Тип, состояние, год выпуска, цена, пробег',
         'Марка → Серия → Модель',
         'Страна происхождения, тип двигателя',
         'Объём, мощность, макс. пассажиров'
      ]
   }),
   node({
      key: 'scooters',
      slug: 'scooters',
      title: 'Мопеды и скутеры',
      filterPresetKey: 'moto.scooters',
      filterSummary: [
         'Тип, состояние, год выпуска, цена, пробег',
         'Марка → Серия → Модель',
         'Страна происхождения, тип двигателя',
         'Объём двигателя и мощность'
      ]
   })
]

const normalizeTree = (nodes, parent = null) =>
   (Array.isArray(nodes) ? nodes : []).map((item, index) => {
      const slug = String(item.slug || item.key || index).toLowerCase()
      const parentTrail = Array.isArray(parent?.trail) ? parent.trail : []
      const trail = [...parentTrail, slug]
      const pathKey = `moto:${trail.join('/')}`
      const normalized = {
         ...item,
         slug,
         key: String(item.key || slug),
         trail,
         pathKey,
         depth: parent ? Number(parent.depth || 0) + 1 : 0,
         parentKey: parent?.key || null
      }
      normalized.children = normalizeTree(item.children, normalized)
      return normalized
   })

const ROOT_TREE = normalizeTree(ROOT_NODES)

const MOTO_VIRTUAL_ROOT_NODE = Object.freeze({
   key: 'moto-root',
   slug: '',
   title: 'Мототехника',
   description: 'Корневой раздел мототехники с фильтрами по видам техники.',
   filterPresetKey: 'catalog.base',
   filterSummary: ['Цена', 'Состояние', 'Поиск'],
   trail: [],
   pathKey: 'moto:',
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

export const MOTO_ROOT_CATEGORIES = ROOT_TREE
export const MOTO_ROOT_NODE = MOTO_VIRTUAL_ROOT_NODE

export const getMotoRootCategories = () => ROOT_TREE
export const getMotoRootNode = () => MOTO_VIRTUAL_ROOT_NODE

export const getMotoCategoryByPathKey = (pathKey) =>
   NODE_BY_PATH_KEY.get(String(pathKey || '')) || null

export const resolveMotoCategoryBySlugTrail = (slugTrail) => {
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
      trail: matched
         ? currentNode.trail
         : normalizedTrail.slice(0, Math.max(0, matchedDepth + 1)),
      pathKey: matched && currentNode ? currentNode.pathKey : '',
      matchedDepth,
      isRootListing: false
   }
}

export const buildMotoCategoryPath = ({ city, trail = [] }) => {
   const normalizedCity = String(city || '').trim()
   const path = Array.isArray(trail) ? trail.filter(Boolean).join('/') : ''
   if (!normalizedCity) return path ? `/moto/${path}` : '/moto'
   return path ? `/${normalizedCity}/moto/${path}` : `/${normalizedCity}/moto`
}

export const getMotoCategoryBreadcrumbTitle = (node) => {
   if (!node) return 'Мототехника'
   return node.depth <= 0 ? `Мототехника: ${node.title}` : node.title
}

export const getMotoChildNavItems = ({ node, city }) => {
   if (!node || !Array.isArray(node.children)) return []
   return node.children.map((child) => ({
      key: child.key,
      slug: child.slug,
      label: child.title,
      to: buildMotoCategoryPath({ city, trail: child.trail })
   }))
}

export const listMotoCategoryAncestors = (node) => {
   if (!node) return []
   return node.trail
      .map((_, index) =>
         getMotoCategoryByPathKey(`moto:${node.trail.slice(0, index + 1).join('/')}`)
      )
      .filter(Boolean)
}
