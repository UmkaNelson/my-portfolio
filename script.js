// Главный файл script.js
import { initModals } from './js/modules/modal.js';
import { initTheme } from './js/modules/theme.js';
import { initPortfolio } from './js/modules/portfolio.js';
import { initAnimations } from './js/modules/animations.js';
import { initNavigation } from './js/modules/navigation.js';
import { initForm } from './js/modules/form-handler.js';;

// Функция для сброса скролла при загрузке
function resetScroll() {
    // Прокручиваем к верху страницы
    window.scrollTo(0, 0);
    
    // Убираем хэш из URL если есть
    if (window.location.hash) {
        history.replaceState(null, null, ' ');
    }
}

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 Начало инициализации всех модулей');
    
    // Сбрасываем скролл
    resetScroll();
    
    // Инициализируем все системы нашего сайта
    initModals();
    initTheme();
    initPortfolio();
    initAnimations();
    initNavigation();
    initForm();
    
    console.log('🎉 Все модули запущены!');
});

// Дополнительно сбрасываем скролл при загрузке страницы
window.addEventListener('load', resetScroll);