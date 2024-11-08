import React from "react";

const UserPage: React.FC = () => {
  return (
    <div>
      <h1>Личный Кабинет Пользователя</h1>
      <section>
        <h2>Личная Информация</h2>
        {/* Здесь будет форма для редактирования личной информации */}
      </section>
      <section>
        <h2>Мои Бронирования</h2>
        {/* Здесь будет список встреч и бронирований пользователя */}
      </section>
      <section>
        <h2>Оставить Отзыв</h2>
        {/* Форма для оставления отзыва */}
      </section>
    </div>
  );
};

export default UserPage;
