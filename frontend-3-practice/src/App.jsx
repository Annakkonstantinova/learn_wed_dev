import { useState } from "react";
import "./styles.css";

import {
  MONTHS_NOMINATIVE,
  MONTHS_GENITIVE,
  DAYS_OF_WEEK,
  buildCalendarGrid,
  isDateSelectable
} from "./utils/date";

// Условное сегодняшнее число — как в предыдущем задании.
const TODAY = new Date(2026, 9, 8);

// Доступное время по дням месяца.
const slotsByDay = {
  1: ["10:00", "11:30", "13:00", "14:00", "15:00"],
  2: ["10:00", "11:30", "14:00", "15:30"],
  3: ["09:30", "11:00", "13:30", "15:00"],
  4: ["10:00", "11:30", "13:00", "14:00", "16:30"],
  5: ["10:00", "12:00", "13:30", "15:00"],
  6: ["09:00", "11:00", "14:00"],
  7: ["10:30", "12:00", "15:00"],
  8: ["10:00", "10:45", "11:30", "12:15", "13:00", "14:00", "15:00", "16:30"],
  9: ["10:00", "11:30", "13:00", "15:30"],
  10: ["09:30", "11:00", "14:00", "16:00"],
  11: ["10:00", "12:00", "14:30"],
  12: ["09:00", "11:30", "13:00", "15:00"],
  13: ["10:00", "11:00", "13:30"],
  14: ["10:30", "12:00", "14:00", "16:00"],
  15: ["09:00", "11:30", "13:00", "15:00"],
  16: ["10:00", "12:00", "14:30"],
  17: ["09:30", "11:00", "13:00", "15:30"],
  18: ["10:00", "12:00", "14:00"],
  19: ["10:30", "13:00", "15:00"],
  20: ["09:00", "11:30", "14:00"],
  21: ["10:00", "12:00", "13:30", "16:00"],
  22: ["09:30", "11:00", "14:00"],
  23: ["10:00", "12:30", "15:00"],
  24: ["09:00", "11:30", "13:00"],
  25: ["10:00", "14:00", "16:00"],
  26: ["09:30", "12:00", "15:30"],
  27: ["10:00", "11:30", "14:00"],
  28: ["09:00", "13:00", "15:00"],
  29: ["10:30", "12:00", "14:30"],
  30: ["10:00", "11:30", "15:00"],
  31: ["09:00", "12:00", "14:00"]
};

// Занятые слоты.
const busySlotsByDay = {
  8: ["10:45", "12:15"],
  9: ["11:30"],
  10: ["13:00"],
  12: ["14:00"],
  15: ["11:30"],
  18: ["10:00"],
  22: ["15:00"]
};

// Шапка сайта.
function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="logo" href="#">
          <span className="logo__icon">C</span>
          <span className="logo__text">
            <strong>СЕВЕР</strong>
            <small>СТУДИЯ МУЖСКОГО СТИЛЯ</small>
          </span>
        </a>

        <nav className="navigation">
          <a href="#">Услуги</a>
          <a href="#">Команда</a>
          <a href="#">Отзывы</a>
          <a href="#">Контакты</a>
        </nav>

        <button className="header__button" type="button">
          Запись →
        </button>
      </div>
    </header>
  );
}

// Индикатор этапов записи.
function Steps() {
  const steps = ["Мастер", "Услуга", "Дата и время", "Контакты", "Проверка"];

  return (
    <section className="steps">
      <div className="container steps__inner">
        <div className="steps__title">
          <span>ОНЛАЙН-ЗАПИСЬ</span>
          <strong>Этап 3 из 5</strong>
        </div>

        <div className="steps__list">
          {steps.map((step, index) => (
            <div
              className={`step ${
                index < 2 ? "step--done" : index === 2 ? "step--active" : ""
              }`}
              key={step}
            >
              <span>{index < 2 ? "✓" : index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Заголовок и стрелки календаря.
function CalendarHeader({ month, year, onPrevious, onNext }) {
  return (
    <div className="calendar__header">
      <h2>
        {MONTHS_NOMINATIVE[month].toUpperCase()} {year}
      </h2>

      <div className="calendar__arrows">
        <button type="button" onClick={onPrevious} aria-label="Предыдущий месяц">
          ‹
        </button>
        <button type="button" onClick={onNext} aria-label="Следующий месяц">
          ›
        </button>
      </div>
    </div>
  );
}

// Сетка календаря.
function CalendarGrid({
  month,
  year,
  selectedDay,
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
            return <span className="calendar__empty" key={`empty-${index}`} />;
          }

          const selectable = isDateSelectable(day, month, year, TODAY);
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

// Календарь целиком.
function Calendar({
  month,
  year,
  selectedDay,
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
        onDayClick={onDayClick}
      />
    </section>
  );
}

// Слоты времени.
function TimeSlots({ slots, busySlots, selectedTime, onTimeClick }) {
  if (slots.length === 0) {
    return (
      <div className="time__slots">
        <p className="time__empty">На этот день свободного времени нет.</p>
      </div>
    );
  }

  return (
    <div className="time__slots">
      {slots.map((time) => {
        const isBusy = busySlots.includes(time);
        const isSelected = selectedTime === time;

        if (isBusy) {
          return (
            <button
              className="time__slot time__slot--busy"
              type="button"
              key={time}
              disabled
            >
              <strong>{time}</strong>
              <small>Занято</small>
            </button>
          );
        }

        return (
          <button
            className={`time__slot ${
              isSelected ? "time__slot--selected" : ""
            }`}
            type="button"
            key={time}
            onClick={() => onTimeClick(time)}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}

// Нижняя панель с выбранной датой и временем.
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
      {time ? ` · ${time}` : ""} · Илья · 45 минут
    </div>
  );
}

// Подвал.
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <strong>СЕВЕР.</strong>
          <p>Без лишних слов. В своём стиле.</p>
        </div>

        <div className="footer__column">
          <span>ГДЕ МЫ</span>
          <p>Москва, Лесная улица, 12</p>
          <small>Каждый день · 10:00–22:00</small>
        </div>

        <div className="footer__column">
          <span>СВЯЗЬ</span>
          <p>+7 (495) 555–28–18</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(8);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [slots, setSlots] = useState(slotsByDay[8]);

  const selectedBusySlots =
    selectedDay === null ? [] : busySlotsByDay[selectedDay] || [];

  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(slotsByDay[day] || []);
  }

  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  function changeMonth(direction) {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
  }

  const selectedDateTitle =
    selectedDay === null
      ? "Выберите день"
      : `${DAYS_OF_WEEK[
          new Date(currentYear, currentMonth, selectedDay).getDay()
        ]}, ${selectedDay} ${MONTHS_GENITIVE[currentMonth]}`;

  return (
    <>
      <Header />
      <Steps />

      <main className="main">
        <div className="container">
          <div className="page-heading">
            <span className="page-heading__label">03 / РАСПИСАНИЕ</span>
            <h1>Когда вам удобно?</h1>
            <p>
              Илья · стрижка · 45 минут. Сначала выберите день, затем время.
            </p>
          </div>

          <div className="booking">
            <Calendar
              month={currentMonth}
              year={currentYear}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              onPrevious={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
            />

            <section className="time">
              <h2>{selectedDateTitle}</h2>
              <p className="time__description">
                Выберите свободное время
              </p>

              <TimeSlots
                slots={slots}
                busySlots={selectedBusySlots}
                selectedTime={selectedTime}
                onTimeClick={handleTimeClick}
              />
            </section>
          </div>

          <BookingBottomBar
            day={selectedDay}
            month={currentMonth}
            year={currentYear}
            time={selectedTime}
          />

          <div className="actions">
            <button className="button button--back" type="button">
              ← Назад
            </button>

            <button className="button button--primary" type="button">
              Подтвердить время →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;