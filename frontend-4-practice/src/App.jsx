
import { useEffect, useState } from "react";
import "./styles.css";

import { fetchToday, fetchSlots } from "./api.js";

import {
  MONTHS_GENITIVE,
  DAYS_OF_WEEK
} from "./utils/date.js";

import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BookingBottomBar from "./components/BookingBottomBar.jsx";
import Footer from "./components/Footer.jsx";

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

function App() {
  const [today, setToday] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [isLoadingToday, setIsLoadingToday] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [error, setError] = useState("");

  // Загружаем сегодняшнюю дату с сервера.
  useEffect(() => {
    let isActive = true;

    async function loadToday() {
      try {
        const data = await fetchToday();

        if (!isActive) return;

        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
      } catch (err) {
        if (isActive) {
          setError(`Не удалось загрузить дату: ${err.message}`);
        }
      } finally {
        if (isActive) {
          setIsLoadingToday(false);
        }
      }
    }

    loadToday();

    return () => {
      isActive = false;
    };
  }, []);

  // Загружаем слоты выбранной даты.
  useEffect(() => {
    if (!today || selectedDay === null) return;

    let isActive = true;

    async function loadSlots() {
      setIsLoadingSlots(true);
      setError("");
      setSlots([]);

      try {
        const data = await fetchSlots({
          day: selectedDay,
          month: currentMonth,
          year: currentYear
        });

        if (!isActive) return;

        // Проверяем, что ответ относится к выбранной дате.
        if (
          data.date.day === selectedDay &&
          data.date.month === currentMonth &&
          data.date.year === currentYear
        ) {
          setSlots(data.slots);
        }
      } catch (err) {
        if (isActive) {
          setError(`Не удалось загрузить время: ${err.message}`);
        }
      } finally {
        if (isActive) {
          setIsLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      isActive = false;
    };
  }, [today, selectedDay, currentMonth, currentYear]);

  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
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

  if (isLoadingToday) {
    return <div className="loading">Загрузка…</div>;
  }

  if (error && !today) {
    return <div className="error">{error}</div>;
  }

  if (!today) {
    return <div className="error">Не удалось получить сегодняшнюю дату.</div>;
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
              today={new Date(today.year, today.month, today.day)}
              onDayClick={handleDayClick}
              onPrevious={() => changeMonth(-1)}
              onNext={() => changeMonth(1)}
            />

            <section className="time">
              <h2>{selectedDateTitle}</h2>
              <p className="time__description">
                Выберите свободное время
              </p>

              {isLoadingSlots ? (
                <p className="time__empty">Загрузка слотов…</p>
              ) : (
                <TimeSlots
                  slots={slots}
                  selectedTime={selectedTime}
                  onTimeClick={handleTimeClick}
                />
              )}
            </section>
          </div>

          {error && <p className="error">{error}</p>}

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

            <button
              className="button button--primary"
              type="button"
              disabled={selectedDay === null || selectedTime === null}
            >
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
