// Модуль для обработки формы
export function initForm() {
    const contactForm = document.getElementById('contact-form');
    const privacyCheckbox = document.getElementById('privacy-agreement');
    const submitBtn = document.getElementById('submit-btn');
    const privacyModal = document.getElementById('privacy-policy');
    
    if (!contactForm) return;
    
    // Устанавливаем action формы для Formspree
    contactForm.action = 'https://formspree.io/f/xzzjekpp';
    contactForm.method = 'POST';
    
    // Добавляем обработчик для чекбокса
    privacyCheckbox.addEventListener('change', function() {
        submitBtn.disabled = !this.checked;
    });
    
    // Обработчик для открытия модального окна политики
    const privacyLinks = document.querySelectorAll('[data-modal-trigger]');
    privacyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openPrivacyModal();
        });
    });
    
    // Обработчик для кнопки принятия политики
    const privacyAcceptBtn = document.querySelector('.privacy-accept-btn');
    if (privacyAcceptBtn) {
        privacyAcceptBtn.addEventListener('click', () => {
            closePrivacyModal();
            privacyCheckbox.checked = true;
            submitBtn.disabled = false;
        });
    }
    
    // Функции для работы с модальным окном политики
    function openPrivacyModal() {
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closePrivacyModal() {
        privacyModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Закрытие модального окна политики
    const privacyCloseBtn = privacyModal.querySelector('.modal__close');
    privacyCloseBtn.addEventListener('click', closePrivacyModal);
    
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            closePrivacyModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
            closePrivacyModal();
        }
    });
    
    // Обработчик отправки формы
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Проверяем согласие с политикой
        if (!privacyCheckbox.checked) {
            showNotification('Необходимо согласие с политикой обработки персональных данных', 'error');
            return;
        }
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Валидация
        if (!validateForm(data)) {
            return;
        }
        
        // Показываем индикатор загрузки
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Отправка через Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Сообщение успешно отправлено!', 'success');
                contactForm.reset();
                privacyCheckbox.checked = false;
                submitBtn.disabled = true;
            } else {
                throw new Error('Ошибка при отправке формы');
            }
        } catch (error) {
            showNotification('Ошибка при отправке сообщения', 'error');
            console.error('Form submission error:', error);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = !privacyCheckbox.checked;
        }
    });
    
    // Валидация формы
    function validateForm(data) {
        let isValid = true;
        
        // Очищаем предыдущие ошибки
        clearErrors();
        
        if (!data.name.trim()) {
            showError('name', 'Введите ваше имя');
            isValid = false;
        }
        
        if (!data.email.trim()) {
            showError('email', 'Введите ваш email');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            showError('email', 'Введите корректный email');
            isValid = false;
        }
        
        if (!data.message.trim()) {
            showError('message', 'Введите сообщение');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Проверка email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Показать ошибку
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.style.borderColor = 'var(--c-red)';
    }
    
    // Очистить ошибки
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const fields = document.querySelectorAll('.form-group input, .form-group textarea');
        
        errorMessages.forEach(error => error.remove());
        fields.forEach(field => {
            field.style.borderColor = '';
        });
    }
    
    // Показать уведомление
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('notification--visible');
        }, 100);
        
        // Закрытие по кнопке
        notification.querySelector('.notification__close').addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Автоматическое закрытие
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.classList.remove('notification--visible');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}