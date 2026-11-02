// ==============================
// ДАННЫЕ
// ==============================

const MONTHS_NOMINATIVE = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь"
];

const MONTHS_GENITIVE = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
];

const DAYS_OF_WEEK = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
];


// ==============================
// СОСТОЯНИЕ
// ==============================

const state = {
    currentMonth: 9,
    currentYear: 2026,

    selectedDay: 8,
    selectedTime: "14:00",

    // Условное "сегодня" для проверки задания.
    // Так мы можем выбирать дни октября 2026.
    today: new Date(2026, 9, 8)
};


// ==============================
// СЛОТЫ
// ==============================

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


// Занятые времена.
// Для 8 октября они соответствуют твоему макету.
const busySlotsByDay = {
    8: ["10:45", "12:15"],
    9: ["11:30"],
    10: ["13:00"],
    12: ["14:00"],
    15: ["11:30"],
    18: ["10:00"],
    22: ["15:00"]
};


// ==============================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==============================

function compareDates(date1, date2) {
    const first = new Date(
        date1.getFullYear(),
        date1.getMonth(),
        date1.getDate()
    );

    const second = new Date(
        date2.getFullYear(),
        date2.getMonth(),
        date2.getDate()
    );

    if (first < second) {
        return -1;
    }

    if (first > second) {
        return 1;
    }

    return 0;
}


function isDateSelectable(day, month, year, today) {
    const date = new Date(year, month, day);

    return compareDates(date, today) >= 0;
}


function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}


function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();

    // Переводим воскресенье из 0 в 6,
    // чтобы неделя начиналась с понедельника.
    return day === 0 ? 6 : day - 1;
}


// ==============================
// КАЛЕНДАРЬ
// ==============================

function renderCalendar() {
    const calendarDays = document.querySelector(".calendar__days");
    const calendarTitle = document.querySelector(".calendar__header h2");

    calendarTitle.textContent =
        `${MONTHS_NOMINATIVE[state.currentMonth].toUpperCase()} ${state.currentYear}`;

    const daysInMonth = getDaysInMonth(
        state.currentYear,
        state.currentMonth
    );

    const firstDay = getFirstDayOfMonth(
        state.currentYear,
        state.currentMonth
    );

    let html = "";

    // Пустые ячейки перед первым днём месяца
    for (let i = 0; i < firstDay; i++) {
        html += `<span class="calendar__empty"></span>`;
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const selectable = isDateSelectable(
            day,
            state.currentMonth,
            state.currentYear,
            state.today
        );

        const date = new Date(
            state.currentYear,
            state.currentMonth,
            day
        );

        const dayOfWeek = date.getDay();

        let classes = "calendar__day";

        if (!selectable) {
            classes += " calendar__day--disabled";
        }

        if (
            state.selectedDay === day &&
            state.currentMonth === state.selectedMonth &&
            state.currentYear === state.selectedYear
        ) {
            classes += " calendar__day--selected";
        }

        if (dayOfWeek === 0) {
            classes += " calendar__day--weekend";
        }

        html += `
            <button
                class="${classes}"
                type="button"
                data-day="${day}"
                ${!selectable ? "disabled" : ""}
            >
                ${day}
            </button>
        `;
    }

    calendarDays.innerHTML = html;

    // Обработчики для новых кнопок дней
    const dayButtons = document.querySelectorAll(".calendar__day");

    dayButtons.forEach((button) => {
        button.addEventListener("click", onDayClick);
    });
}


// ==============================
// ВЫБОР ДНЯ
// ==============================

function onDayClick(event) {
    const day = Number(event.currentTarget.dataset.day);

    state.selectedDay = day;
    state.selectedMonth = state.currentMonth;
    state.selectedYear = state.currentYear;

    // При выборе другого дня старое время сбрасываем.
    state.selectedTime = null;

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}


// ==============================
// ВРЕМЯ
// ==============================

function renderTimeSlots() {
    const container = document.querySelector(".time__slots");
    const title = document.querySelector(".time h2");

    const selectedDate = new Date(
        state.selectedYear,
        state.selectedMonth,
        state.selectedDay
    );

    title.textContent =
        `${DAYS_OF_WEEK[selectedDate.getDay()]}, ` +
        `${state.selectedDay} ${MONTHS_GENITIVE[state.selectedMonth]}`;

    const slots = slotsByDay[state.selectedDay] || [];

    const busySlots = busySlotsByDay[state.selectedDay] || [];

    if (slots.length === 0) {
        container.innerHTML = `
            <p class="time__empty">
                На этот день свободного времени нет.
            </p>
        `;

        return;
    }

    let html = "";

    slots.forEach((time) => {
        const isBusy = busySlots.includes(time);
        const isSelected = state.selectedTime === time;

        if (isBusy) {
            html += `
                <button
                    class="time__slot time__slot--busy"
                    type="button"
                    disabled
                >
                    <strong>${time}</strong>
                    <small>Занято</small>
                </button>
            `;
        } else {
            html += `
                <button
                    class="time__slot ${isSelected ? "time__slot--selected" : ""}"
                    type="button"
                    data-time="${time}"
                >
                    ${time}
                </button>
            `;
        }
    });

    container.innerHTML = html;

    // После innerHTML старые обработчики исчезли,
    // поэтому добавляем их заново.
    const timeButtons = document.querySelectorAll(
        ".time__slot:not(.time__slot--busy)"
    );

    timeButtons.forEach((button) => {
        button.addEventListener("click", onTimeSlotClick);
    });
}


// ==============================
// ВЫБОР ВРЕМЕНИ
// ==============================

function onTimeSlotClick(event) {
    const time = event.currentTarget.dataset.time;

    state.selectedTime = time;

    renderTimeSlots();
    updateBottomBar();
}


// ==============================
// НИЖНЯЯ ПАНЕЛЬ
// ==============================

function updateBottomBar() {
    const bottomBar = document.querySelector(".selected-info");

    const selectedDate = new Date(
        state.selectedYear,
        state.selectedMonth,
        state.selectedDay
    );

    let text =
        `Выбрано: ` +
        `${DAYS_OF_WEEK[selectedDate.getDay()]}, ` +
        `${state.selectedDay} ` +
        `${MONTHS_GENITIVE[state.selectedMonth]} ` +
        `${state.selectedYear}`;

    if (state.selectedTime) {
        text += ` · ${state.selectedTime}`;
    }

    text += ` · Илья · 45 минут`;

    bottomBar.textContent = text;
}


// ==============================
// ПЕРЕКЛЮЧЕНИЕ МЕСЯЦЕВ
// ==============================

function setupMonthNavigation() {
    const previousButton = document.querySelector(".calendar__prev");
    const nextButton = document.querySelector(".calendar__next");

    previousButton.addEventListener("click", () => {
        state.currentMonth--;

        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }

        state.selectedDay = null;
        state.selectedTime = null;

        renderCalendar();
        renderTimeSlots();
        updateBottomBar();
    });

    nextButton.addEventListener("click", () => {
        state.currentMonth++;

        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }

        state.selectedDay = null;
        state.selectedTime = null;

        renderCalendar();
        renderTimeSlots();
        updateBottomBar();
    });
}


// ==============================
// ИНИЦИАЛИЗАЦИЯ
// ==============================

function init() {
    state.selectedMonth = state.currentMonth;
    state.selectedYear = state.currentYear;

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();

    setupMonthNavigation();
}


document.addEventListener("DOMContentLoaded", init);