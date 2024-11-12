import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Booking.module.css";

const Booking = () => {
  // Состояние для хранения выбранной даты и доступных слотов
  const [date, setDate] = useState<Date | null>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Эффект для получения доступных слотов при изменении даты
  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date);
    }
  }, [date]);

  // Функция для получения доступных слотов на выбранную дату
  const fetchAvailableSlots = async (selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Форматируем дату в строку 'YYYY-MM-DD'
    try {
      const response = await fetch(
        `https://tax-consulting-app.onrender.com/booking/available-slots?date=${formattedDate}`
      );
      const slots = await response.json();
      setAvailableSlots(slots); // Устанавливаем доступные слоты в состояние
    } catch (error) {
      console.error("Ошибка при получении доступных слотов:", error);
    }
  };

  // Обработчик выбора времени
  const handleTimeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  // Обработчик бронирования
  const handleBooking = async () => {
    if (!date || !selectedTime) {
      console.error("Необходимо выбрать дату и время.");
      return;
    }

    const bookingData = {
      date: date.toISOString().split("T")[0],
      time: selectedTime,
      name: "Имя пользователя", // Здесь вы можете использовать данные пользователя или предоставить форму для ввода
      email: "user@example.com", // Пример: email пользователя
      phone: "1234567890", // Пример: телефон пользователя
    };

    try {
      const response = await fetch(
        "https://tax-consulting-app.onrender.com/booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка бронирования: ${response.statusText}`);
      }

      console.log("Бронирование успешно выполнено");
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
    }
  };

  return (
    <div className={styles.bookingSection}>
      <div className={styles.calendarContainer}>
        {" "}
        <Calendar
          onChange={(value) => {
            // Проверяем, что выбранное значение — одиночная дата, а не массив или null
            if (value && !Array.isArray(value)) {
              setDate(value);
            } else {
              setDate(null);
            }
          }}
          value={date}
          selectRange={false} // Мы выбираем только одну дату
          tileDisabled={({ date }) => {
            // Блокируем выходные
            const day = date.getDay();
            return day === 0 || day === 6; // 0 - Воскресенье, 6 - Суббота
          }}
        />
        <div>
          {date && (
            <>
              <h3>Choose time</h3>
              <select onChange={handleTimeSelect} value={selectedTime || ""}>
                <option value="" disabled>
                  Choose time
                </option>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    There is no availiable time
                  </option>
                )}
              </select>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={!selectedTime}
        className={styles.bookButton}
      >
        Book
      </button>
    </div>
  );
};

export default Booking;
