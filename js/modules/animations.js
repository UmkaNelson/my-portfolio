// js/modules/animations.js
// Функция для инициализации анимаций появления элементов
function initAnimations() {
    console.log('Инициализация анимации');
    // ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ =====
    const fadeElements = document.querySelectorAll('.fade-in');
    // Если нет элементов с анимацией, выходим из функции
    if (fadeElements.length === 0) return;
    // Функция для проверки, нужно ли показывать элемент
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;       
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }   
    // Проверяем при загрузке и при прокрутке
    checkFade();
    window.addEventListener('scroll', checkFade);
}
// Экспортируем функцию initAnimations для использования в главном файле
export { initAnimations };