
import {
  DAYS_OF_WEEK,
  MONTHS_GENITIVE
} from "../utils/date.js";

function BookingBottomBar({ day, month, year, time }) {
  if (day === null) {
    return (
      <div className="selected-info">
        Выберите день и время · Илья · 45 минут
      </div>
    );
  }

  const date = new Date(year, month, day);

  return (
    <div className="selected-info">
      Выбрано: {DAYS_OF_WEEK[date.getDay()]}, {day}{" "}
      {MONTHS_GENITIVE[month]} {year}
      {time ? ` · ${time}` : " · Выберите время"} · Илья · 45 минут
    </div>
  );
}

export default BookingBottomBar;
