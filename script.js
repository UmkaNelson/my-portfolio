// Главный файл script.js
import { initModals } from './js/modules/modal.js';
import { initTheme } from './js/modules/theme.js';
import { initPortfolio } from './js/modules/portfolio.js';
import { initAnimations } from './js/modules/animations.js';
import { initNavigation } from './js/modules/navigation.js';
import { initForm } from './js/modules/form-handler.js';

// Глобальные переменные
window.portfolio = null;
window.theme = null;

// Функция для сброса скролла при загрузке
function resetScroll() {
    window.scrollTo(0, 0);
    
    // Убираем хэш из URL если есть
    if (window.location.hash) {
        history.replaceState(null, null, ' ');
    }
}

// Показ уведомления об ошибке
function showErrorNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification notification--error';
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">Ошибка загрузки. Пожалуйста, обновите страницу.</span>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.notification__close').addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => notification.remove(), 5000);
}

// Обработчик кастомных событий портфолио
function setupPortfolioEvents() {
    document.addEventListener('portfolio:open-project', (event) => {
        const project = event.detail.project;
        if (window.openProjectModal) {
            window.openProjectModal(project);
        }
    });
}

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🏁 Начало инициализации всех модулей');
    
    // Сбрасываем скролл
    resetScroll();
    
    try {
        // Настраиваем обработчики событий портфолио
        setupPortfolioEvents();
        
        // Инициализируем все системы нашего сайта
        initModals();
        window.theme = initTheme();
        window.portfolio = await initPortfolio();
        initAnimations();
        initNavigation();
        initForm();
        
        console.log('🎉 Все модули запущены!');
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showErrorNotification();
    }
});

// Дополнительно сбрасываем скролл при загрузке страницы
window.addEventListener('load', resetScroll);

// Добавляем обработчик для обновления года в футере
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});