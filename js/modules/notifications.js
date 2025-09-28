// js/modules/notifications.js
// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    console.log('Инициализация уведомления');
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    // Добавляем содержимое уведомления
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__icon">${type === 'success' ? '✓' : '⚠'}</span>
            <p class="notification__message">${message}</p>
            <button class="notification__close" aria-label="Закрыть уведомление">×</button>
        </div>
    `;
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    // Показываем уведомление с анимацией
    setTimeout(() => {
        notification.classList.add('notification--visible');
    }, 10);
    // Настраиваем автоматическое закрытие
    const autoCloseTimer = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    // Обработчик закрытия по кнопке
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoCloseTimer);
        closeNotification(notification);
    });   
    // Обработчик закрытия по клику на уведомление
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            clearTimeout(autoCloseTimer);
            closeNotification(notification);
        }
    });
}
// Функция для закрытия уведомления
function closeNotification(notification) {
    notification.classList.remove('notification--visible');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}
// Экспортируем функцию showNotification
export { showNotification };