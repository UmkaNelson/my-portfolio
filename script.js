// Главный файл script.js
import { initModals } from './js/modules/modal.js';
import { initTheme } from './js/modules/theme.js';
import { initPortfolio } from './js/modules/portfolio.js'; // Теперь это асинхронная функция
import { initAnimations } from './js/modules/animations.js';
import { initNavigation } from './js/modules/navigation.js';
import { initForm } from './js/modules/form-handler.js';

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 Начало инициализации всех модулей');
    
    // Инициализируем все системы нашего сайта
    initModals();
    initTheme();
    initPortfolio();    // Теперь загружает данные асинхронно
    initAnimations();
    initNavigation();
    initForm();
    
    console.log('🎉 Все модули запущены!');
});