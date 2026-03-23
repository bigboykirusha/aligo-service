const normalizeComparableTitle = (value) =>
   String(value || '')
      .trim()
      .toLowerCase()

const findOptionByValue = (value, options = []) =>
   options.find((option) => String(option.id) === String(value)) || null

export const isAffirmativeOptionByValue = (value, options = []) => {
   const selectedOption = findOptionByValue(value, options)
   if (!selectedOption) return Number(value) === 1

   const title = normalizeComparableTitle(selectedOption.title)
   return title === 'да' || title === 'yes' || String(selectedOption.id) === '1'
}

export const isUsedOptionByValue = (value, options = []) => {
   const selectedOption = findOptionByValue(value, options)
   if (!selectedOption) return Number(value) === 2

   const title = normalizeComparableTitle(selectedOption.title)
   return (
      title === 'б/у' ||
      title === 'бу' ||
      title === 'used' ||
      String(selectedOption.id) === '2'
   )
}

export const titlesMatch = (left, right) =>
   normalizeComparableTitle(left) === normalizeComparableTitle(right)
