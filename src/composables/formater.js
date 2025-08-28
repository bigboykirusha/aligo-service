export const FORMATER = (type, value, separator) => {
  switch (type) {
    case 'phone':
      return formatPhoneNumber(value);
    case 'fetch':
      return formaterCamleCase(value);
    case 'togller':
      return formaterTogler(value);
    case 'weekDay':
      return formatDay(value);
    case 'month':
      return monthToNumber(value);
    case 'time':
      return formatTime(value);
    case 'date':
      return formatDate(value, separator);
    default:
      throw new Error(`такого формата в фроматоре нет ${type}`);
  }

  // форматирование телефона
  function formatPhoneNumber(phoneNumber) {
    let cleanedNumber = phoneNumber.replace(/[() -]/g, '');
    return cleanedNumber;
  }

  // Форматор превращения погруженных эллементов в тип CamleCase
  function formaterCamleCase(value) {
    function snakeToCamel(str) {
      return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    function transformKeys(obj) {
      const newObj = {};
      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = snakeToCamel(key);
          newObj[newKey] = obj[key];
        }
      }
      return newObj;
    }

    const newJson = value.map((obj) => transformKeys(obj));
    return newJson;
  }

  // булевый форматор
  function formaterTogler(value) {
    if (value) return 1;
    else return 0;
  }

  // форматор дней недель
  function formatDay(dayString) {
    const daysMapping = {
      понедельник: 'Пн',
      вторник: 'Вт',
      среда: 'Ср',
      четверг: 'Чт',
      пятница: 'Пт',
      суббота: 'Сб',
      воскресенье: 'Вс',
    };

    const lowerCaseDay = dayString.toLowerCase();

    if (lowerCaseDay in daysMapping) {
      return daysMapping[lowerCaseDay];
    } else {
      return 'Неверный формат дня недели';
    }
  }

  // Форматор дней
  function formatDate(value, separator = ' ') {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${separator} ${hours} : ${minutes}`;
  }

  // форматор месяцев превращает число в название
  function monthToNumber(monthName) {
    monthName = monthName.toLowerCase();

    const months = {
      январь: 1,
      февраль: 2,
      март: 3,
      апрель: 4,
      май: 5,
      июнь: 6,
      июль: 7,
      август: 8,
      сентябрь: 9,
      октябрь: 10,
      ноябрь: 11,
      декабрь: 12,
    };

    return months[monthName] || null;
  }

  // форматор времени
  function formatTime(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    const hourText = hours > 0 ? `${hours} ${getHourWord(hours)}` : '';
    const minuteText = minutes > 0 ? `${minutes} мин` : '';
    const secondText = seconds > 0 ? `${seconds} сек` : '';

    return [hourText, minuteText, secondText].filter(Boolean).join(' ');
  }

  function getHourWord(hours) {
    if (hours === 1) return 'час';
    if (hours >= 2 && hours <= 4) return 'часа';
    return 'часов';
  }
};
