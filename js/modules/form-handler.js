// js/modules/form-handler.js
import { closeModal } from './modal.js';
import { showNotification } from './notifications.js';

// Функция для инициализации обработки формы
function initForm() {
    console.log('📝 Инициализация обработки формы...');
    
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
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Отменяем стандартную отправку формы
            
            console.log('🔄 Отправка формы...');
            
            // Валидация формы
            if (!validateForm()) {
                return;
            }
            
            // Показываем уведомление о начале отправки
            showNotification('Отправляем сообщение...', 'success');
            
            try {
                // Собираем данные формы
                const formData = new FormData(contactForm);
                
                // Отправляем данные на Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                // Проверяем ответ
                if (response.ok) {
                    // Успешная отправка
                    console.log('✅ Форма успешно отправлена');
                    showNotification('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
                    
                    // Сбрасываем значения формы
                    contactForm.reset();
                    
                    // Закрываем модальное окно
                    closeModal();
                } else {
                    // Ошибка сервера
                    throw new Error('Ошибка сервера при отправке формы');
                }
                
            } catch (error) {
                // Ошибка сети или другая ошибка
                console.error('❌ Ошибка отправки формы:', error);
                showNotification('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или напишите мне напрямую на umkanelson@mail.ru', 'error');
            }
        });
    }
}

// Функция для валидации формы
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    let isValid = true;
    
    // Сбрасываем предыдущие стили ошибок
    resetErrorStyles();
    
    // Проверка имени
    if (!nameInput.value.trim()) {
        markFieldAsError(nameInput, 'Пожалуйста, введите ваше имя');
        isValid = false;
    }
    
    // Проверка email
    if (!emailInput.value.trim()) {
        markFieldAsError(emailInput, 'Пожалуйста, введите ваш email');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        markFieldAsError(emailInput, 'Пожалуйста, введите корректный email');
        isValid = false;
    }
    
    // Проверка сообщения
    if (!messageInput.value.trim()) {
        markFieldAsError(messageInput, 'Пожалуйста, введите сообщение');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        markFieldAsError(messageInput, 'Сообщение должно содержать хотя бы 10 символов');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
    }
    
    return isValid;
}

// Функция для проверки валидности email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для пометки поля с ошибкой
function markFieldAsError(inputElement, message) {
    inputElement.style.borderColor = '#e74c3c';
    inputElement.style.backgroundColor = '#fdf2f2';
    
    // Создаем или обновляем сообщение об ошибке
    let errorElement = inputElement.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        inputElement.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Функция для сброса стилей ошибок
function resetErrorStyles() {
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach(input => {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// Функция для открытия модального окна (нужна для контактов)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// Экспортируем функцию initForm для использования в главном файле
export { initForm };
