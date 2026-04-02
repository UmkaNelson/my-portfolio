// Модуль для переключения темы
export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcons = {
        moon: themeToggle?.querySelector('.theme-icon--moon'),
        sun: themeToggle?.querySelector('.theme-icon--sun')
    };
    
    if (!themeToggle) return;
    
    // Получение сохраненной темы с обработкой ошибок
    const getSavedTheme = () => {
        try {
            return localStorage.getItem('theme');
        } catch {
            return null;
        }
    };
    
    // Сохранение темы с обработкой ошибок
    const saveTheme = (theme) => {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Не удалось сохранить тему:', error);
        }
    };
    
    // Применение темы
    const applyTheme = (isDark) => {
        const method = isDark ? 'add' : 'remove';
        document.body.classList[method]('dark-theme');
        
        // Обновляем meta theme-color для мобильных браузеров
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.content = isDark ? '#040303' : '#FFFFFF';
        }
    };
    
    // Инициализация темы
    const initTheme = () => {
        const savedTheme = getSavedTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
        applyTheme(isDark);
        
        // Сохраняем только если пользователь явно выбрал
        if (savedTheme) {
            saveTheme(isDark ? 'dark' : 'light');
        }
    };
    
    // Обработчик переключения
    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-theme');
        
        // Анимация
        themeToggle.classList.add('theme-changing');
        setTimeout(() => {
            themeToggle.classList.remove('theme-changing');
        }, 500);
        
        applyTheme(isDark);
        saveTheme(isDark ? 'dark' : 'light');
    });
    
    // Следим за изменениями системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
        if (!getSavedTheme()) { // Меняем только если пользователь не выбирал
            applyTheme(e.matches);
        }
    };
    
    mediaQuery.addEventListener('change', handleSystemChange);
    
    // Инициализация
    initTheme();
    
    // Экспортируем метод для принудительной смены темы
    return {
        setTheme: (theme) => {
            const isDark = theme === 'dark';
            applyTheme(isDark);
            saveTheme(theme);
        },
        getTheme: () => document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    };
}