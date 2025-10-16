// Модуль для работы с портфолио
export function initPortfolio() {
    const portfolioGrid = document.querySelector('.portfolio__grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Данные проектов
    const projects = [
        {
            id: 1,
            title: 'Интернет-магазин',
            description: 'Современный интернет-магазин с корзиной и системой фильтрации',
            image: './images/import-1.png',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            link: '#',
            category: 'web'
        },
        {
            id: 2,
            title: 'Панель управления',
            description: 'Админ-панель для управления контентом веб-сайта',
            image: './images/import-2.png',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            link: '#',
            category: 'app'
        },
        {
            id: 3,
            title: 'Лендинг страница',
            description: 'Промо-сайт для запуска нового продукта',
            image: './images/import-4.jpg',
            technologies: ['HTML', 'CSS'],
            link: '#',
            category: 'web'
        },
        {
            id: 4,
            title: 'Мобильное приложение',
            description: 'Приложение для управления задачами и проектами',
            image: './images/import-4.jpg',
            technologies: ['JavaScript', 'React Native'],
            link: '#',
            category: 'app'
        }
    ];
    
    // Текущий активный фильтр
    let currentFilter = 'all';
    
    // Отображение проектов
    function displayProjects(filter = 'all') {
        currentFilter = filter;
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        portfolioGrid.innerHTML = '';
        
        if (filteredProjects.length === 0) {
            portfolioGrid.innerHTML = `
                <div class="portfolio-empty">
                    <p>Проекты не найдены</p>
                    <button class="btn btn--primary" data-filter="all">Показать все проекты</button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки "Показать все проекты"
            const showAllBtn = portfolioGrid.querySelector('[data-filter="all"]');
            if (showAllBtn) {
                showAllBtn.addEventListener('click', () => {
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    document.querySelector('[data-filter="all"]').classList.add('active');
                    displayProjects('all');
                });
            }
            return;
        }
        
        filteredProjects.forEach(project => {
            const projectElement = createProjectElement(project);
            portfolioGrid.appendChild(projectElement);
        });
        
        // Инициализируем анимации для новых элементов
        initPortfolioAnimations();
    }
    
    // Создание элемента проекта
    function createProjectElement(project) {
        const article = document.createElement('article');
        article.className = 'portfolio-item fade-in';
        article.setAttribute('data-category', project.category);
        article.innerHTML = `
            <div class="portfolio-item__image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
            </div>
            <div class="portfolio-item__content">
                <h3 class="portfolio-item__title">${project.title}</h3>
                <p class="portfolio-item__description">${project.description}</p>
                <div class="portfolio-item__tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <a href="#" class="portfolio-item__link" data-project-id="${project.id}">
                    Подробнее →
                </a>
            </div>
        `;
        
        // Обработчик клика для открытия модального окна
        const projectLink = article.querySelector('.portfolio-item__link');
        projectLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.openProjectModal) {
                window.openProjectModal(project);
            }
        });
        
        return article;
    }
    
    // Фильтрация проектов
    function setupFilters() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Обновляем активную кнопку
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Фильтруем проекты
                const filter = btn.dataset.filter;
                displayProjects(filter);
            });
        });
    }
    
    // Инициализация анимаций для портфолио
    function initPortfolioAnimations() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        portfolioItems.forEach(item => observer.observe(item));
    }
    
    // Инициализация
    function init() {
        setupFilters();
        displayProjects();
        
        // Убираем индикатор загрузки
        const loadingElement = document.querySelector('.portfolio-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    // Запускаем инициализацию
    init();
    
    // Экспортируем функцию для обновления фильтра
    return {
        updateFilter: (filter) => {
            const btn = document.querySelector(`[data-filter="${filter}"]`);
            if (btn) {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                displayProjects(filter);
            }
        }
    };
}