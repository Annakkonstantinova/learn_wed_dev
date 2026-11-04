
function TimeSlots({ slots, selectedTime, onTimeClick }) {
  if (slots.length === 0) {
    return (
      <div className="time__slots">
        <p className="time__empty">
          На этот день свободного времени нет.
        </p>
      </div>
    );
  }

  return (
    <div className="time__slots">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;

        if (!slot.available) {
          return (
            <button
              className="time__slot time__slot--busy"
              type="button"
              key={slot.time}
              disabled
            >
              <strong>{slot.time}</strong>
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
            key={slot.time}
            onClick={() => onTimeClick(slot.time)}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

export default TimeSlots;
