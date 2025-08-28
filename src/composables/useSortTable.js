export function useSortTable(
  itemRows,
  code,
  filterType,
  sortDirection = 'asc'
) {
  const filteredRows = itemRows;

  const compareValues = (a, b) => {
    const valueA = a[code]?.value;
    const valueB = b[code]?.value;

    if (valueA === undefined || valueA === null) return 1;
    if (valueB === undefined || valueB === null) return -1;

    switch (filterType) {
      case 'alphabetical':
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      case 'numeric':
        return sortDirection === 'asc'
          ? parseFloat(valueA) - parseFloat(valueB)
          : parseFloat(valueB) - parseFloat(valueA);
      case 'checkbox':
        if (valueA === valueB) return 0;
        if (sortDirection === 'asc') {
          return valueA === valueB ? 0 : valueA ? -1 : 1;
        } else {
          return valueA === valueB ? 0 : valueA ? 1 : -1;
        }
      default:
        throw new Error('Unknown filter type');
    }
  };

  // Сортируем массив
  return filteredRows.sort(compareValues);
}
