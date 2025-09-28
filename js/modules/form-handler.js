// js/modules/form-handler.js
import { openModal, closeModal } from './modal.js';
import { showNotification } from './notifications.js'; // Импортируем функцию уведомлений
// Функция для инициализации обработки формы
function initForm() {
    console.log('Инициализация обработки формы');
    // ===== МОДАЛЬНОЕ ОКНО КОНТАКТОВ =====
    // Находим ссылку, которая открывает модальное окно контактов
    const contactLink = document.querySelector('a[href="#contact-modal"]');
    // Находим форму в модальном окне
    const contactForm = document.getElementById('contact-form');
    // Если ссылка найдена
    if (contactLink) {
        // Добавляем обработчик клика
        contactLink.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылки
            openModal('contact-modal'); // Открываем модальное окно контактов
        });
    }
    // Если форма найдена
    if (contactForm) {
        // Добавляем обработчик отправки формы
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяем стандартную отправку формы
            // Валидация формы (можно добавить более сложную логику)
            let isValid = true;
            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.style.borderColor = 'red';
            } else {
                nameInput.style.borderColor = '';
            }
            if (!messageInput.value.trim()) {
                isValid = false;
                messageInput.style.borderColor = 'red';
            } else {
                messageInput.style.borderColor = '';
            }
            if (!isValid) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }            
            // Здесь можно добавить код для реальной отправки формы
            // Например, с использованием fetch API

            // Показываем уведомление об успешной отправке
            showNotification('Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
            // Сбрасываем значения формы
            contactForm.reset();           
            // Закрываем модальное окно
            closeModal();
        });
    }
}
// Экспортируем функцию initForm для использования в главном файле
export { initForm };