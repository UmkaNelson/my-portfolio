// Объявляем наши функции
// 1. Функция для закрытия модальных окон
function closeModal() {
    console.log('Инициализация закрытия модальных окон');
    // Находим все модальные окна на странице
    const modals = document.querySelectorAll('.modal');
    // Для каждого модального окна
    modals.forEach(modal => {
        // Убираем класс для анимации
        modal.classList.remove('show');
        // Ждем завершения анимации перед полным скрытием
        setTimeout(() => {
            modal.style.display = 'none'; // Скрываем модальное окно
        }, 400); // Время должно соответствовать длительности transition в CSS
    });
    // Разблокируем прокрутку body
    document.body.classList.remove('modal-open');
}
// 2. Функция для открытия модального окна по его ID
function openModal(modalId) {
    console.log('Инициализация модальных окон');
    // Находим элемент модального окна по ID
    const modal = document.getElementById(modalId);
    // Если элемент найден
    if (modal) {
        // Сбрасываем прокрутку содержимого модального окна
        const modalContent = modal.querySelector('.modal-content') || modal.querySelector('.project-modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0; // Прокручиваем к началу
        }
        // Показываем модальное окно
        modal.style.display = 'block';
        // Добавляем класс к body для блокировки прокрутки
        document.body.classList.add('modal-open');
        // Небольшая задержка перед добавлением класса для анимации
        setTimeout(() => {
            modal.classList.add('show'); // Добавляем класс для анимации
        }, 10);
    }
}
// 3. Функция для инициализации всех обработчиков событий модальных окон
function initModals() {
    // Назначаем обработчики для всех кнопок закрытия
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    // Закрытие по клику на оверлей
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    });
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            closeModal();
        }
    });
}
// Экспортируем наружу (делаем доступными в других файлах) только те функции, которые нужны снаружи.
// initModals нужна, чтобы запустить всё в главном файле.
// openModal нужна, чтобы её могли вызвать из portfolio.js для открытия окна проекта.
// closeModal тоже экспортируем на случай, если она понадобится извне.
export { initModals, openModal, closeModal };