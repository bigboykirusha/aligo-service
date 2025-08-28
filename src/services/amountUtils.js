export function formatNumberWithSpaces(number) {
   const formatter = new Intl.NumberFormat('ru-RU'); 
   return formatter.format(number);
}