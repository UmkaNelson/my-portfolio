// Модуль для навигации
export function initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const header = document.querySelector('.header');
    
    // Плавная прокрутка к секциям
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Подсветка активного раздела при прокрутке
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Фиксированный header при прокрутке
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Слушатели событий
    window.addEventListener('scroll', () => {
        highlightActiveSection();
        handleHeaderScroll();
    });
    
    // Инициализация
    highlightActiveSection();
    handleHeaderScroll();
}