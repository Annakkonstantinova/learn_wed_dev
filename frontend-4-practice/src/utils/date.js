export const MONTHS_NOMINATIVE = [
  "январь", "февраль", "март", "апрель",
  "май", "июнь", "июль", "август",
  "сентябрь", "октябрь", "ноябрь", "декабрь"
];

export const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля",
  "мая", "июня", "июля", "августа",
  "сентября", "октября", "ноября", "декабря"
];

export const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник",
  "Среда", "Четверг", "Пятница", "Суббота"
];

export function compareDates(date1, date2) {
  const first = new Date(
    date1.getFullYear(), date1.getMonth(), date1.getDate()
  );

  const second = new Date(
    date2.getFullYear(), date2.getMonth(), date2.getDate()
  );

  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}

export function isDateSelectable(day, month, year, today) {
  const date = new Date(year, month, day);
  return compareDates(date, today) >= 0;
}

export function buildCalendarGrid(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Понедельник — первый день недели.
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ];

  // Дополняем последнюю неделю пустыми ячейками.
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}