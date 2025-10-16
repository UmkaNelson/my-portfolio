// Модуль для анимаций при прокрутке
export function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Если это статистика, запускаем анимацию чисел
                if (entry.target.classList.contains('stat')) {
                    animateStat(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    const animatedElements = document.querySelectorAll('.fade-in, .skill-card, .portfolio-item, .stat, .contact-item, .form-group');
    animatedElements.forEach(el => observer.observe(el));
    
    // Анимация для статистики
    function animateStat(statElement) {
        const numberElement = statElement.querySelector('.stat__number');
        const finalNumber = parseInt(numberElement.textContent);
        
        // Проверяем, не анимировали ли мы уже этот элемент
        if (statElement.classList.contains('animated')) {
            return;
        }
        
        statElement.classList.add('animated');
        
        let currentNumber = 0;
        const duration = 2000; // 2 секунды
        const increment = finalNumber / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(currentNumber) + '+';
        }, 16);
    }
    
    // Отдельный наблюдатель для статистики с большим порогом
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                // statsObserver.unobserve(entry.target); // Не отключаем наблюдение для повторной анимации
            }
        });
    }, { threshold: 0.5 });
    
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => statsObserver.observe(stat));
}