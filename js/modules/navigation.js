// js/modules/navigation.js
// Функция для инициализации навигации и подсветки секций
function initNavigation() {
    console.log('Инициализация навигации и подсветки');
    // ===== НАВИГАЦИЯ И ПОДСВЕТКА СЕКЦИЙ =====
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section');
    // Если нет навигационных ссылок или секций, выходим из функции
    if (navLinks.length === 0 || sections.length === 0) return;
    // Функция для удаления подсветки со всех секций
    function removeHighlights() {
        sections.forEach(section => {
            section.classList.remove('highlighted');
        });
    }
    // Функция для подсветки конкретной секции
    function highlightSection(sectionId) {
        removeHighlights();
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('highlighted');
        }
    }
    // Добавляем обработчики клика для всех навигационных ссылок
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Если ссылка ведет на якорь (начинается с #), обрабатываем навигацию
            if (href.startsWith('#') && href !== '#contact-modal') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);         
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });         
                    highlightSection(targetId);
                    history.pushState(null, null, `#${targetId}`);
                }
            }
            // Если ссылка ведет на модальное окно, она обработается в других обработчиках
        });
    });
    // Подсвечиваем секцию при загрузке страницы, если есть хэш в URL
    if (window.location.hash && window.location.hash !== '#contact-modal') {
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
            highlightSection(targetId);
        }, 100);
    }   
    // Убираем подсветку при прокрутке
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            removeHighlights();
        }, 150);
    });
}
// Экспортируем функцию initNavigation для использования в главном файле
export { initNavigation };