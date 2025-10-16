// Модуль для переключения темы
export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcons = {
        moon: themeToggle.querySelector('.theme-icon--moon'),
        sun: themeToggle.querySelector('.theme-icon--sun')
    };
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Применяем сохраненную тему
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Переключение темы
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        
        if (isDark) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Добавляем класс для анимации (опционально)
        themeToggle.classList.add('theme-changing');
        setTimeout(() => {
            themeToggle.classList.remove('theme-changing');
        }, 500);
    });
    
    // Обработка системных предпочтений темы (если пользователь не выбирал вручную)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleSystemThemeChange(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    }
    
    // Слушаем изменения системной темы
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Инициализация при загрузке
    handleSystemThemeChange(mediaQuery);
}