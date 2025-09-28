// js/modules/theme.js
// Объявляем функцию для инициализации функциональности темы
function initTheme() {
    console.log('Инициализация ночной темы');
    // ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
    const themeToggle = document.getElementById('theme-toggle');
    // Проверяем, существует ли элемент на странице
    if (!themeToggle) {
        console.error('Элемент theme-toggle не найден!');
        return; // Если элемента нет, прекращаем выполнение функции
    }
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    // Устанавливаем тему при загрузке страницы
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    // Добавляем обработчик клика для переключения темы
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme'); 
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        }
    });
}
// Экспортируем функцию initTheme, чтобы её можно было импортировать в главном файле
export { initTheme };