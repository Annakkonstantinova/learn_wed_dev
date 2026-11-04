
import {
  MONTHS_NOMINATIVE,
  buildCalendarGrid,
  isDateSelectable
} from "../utils/date.js";

function Calendar({
  month,
  year,
  selectedDay,
  today,
  onDayClick,
  onPrevious,
  onNext
}) {
  return (
    <section className="calendar">
      <CalendarHeader
        month={month}
        year={year}
        onPrevious={onPrevious}
        onNext={onNext}
      />

      <CalendarGrid
        month={month}
        year={year}
        selectedDay={selectedDay}
        today={today}
        onDayClick={onDayClick}
      />
    </section>
  );
}

function CalendarHeader({ month, year, onPrevious, onNext }) {
  return (
    <div className="calendar__header">
      <h2>
        {MONTHS_NOMINATIVE[month].toUpperCase()} {year}
      </h2>

      <div className="calendar__arrows">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Предыдущий месяц"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Следующий месяц"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function CalendarGrid({
  month,
  year,
  selectedDay,
  today,
  onDayClick
}) {
  const weeks = buildCalendarGrid(year, month);
  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <>
      <div className="calendar__weekdays">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar__days">
        {weeks.flat().map((day, index) => {
          if (day === null) {
            return (
              <span
                className="calendar__empty"
                key={`empty-${index}`}
              />
            );
          }

          const selectable = isDateSelectable(day, month, year, today);
          const weekday = new Date(year, month, day).getDay();
          const isSelected = selectedDay === day;

          const className = [
            "calendar__day",
            !selectable && "calendar__day--disabled",
            isSelected && "calendar__day--selected",
            weekday === 0 && "calendar__day--weekend"
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              className={className}
              type="button"
              key={day}
              disabled={!selectable}
              onClick={() => onDayClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Calendar;
