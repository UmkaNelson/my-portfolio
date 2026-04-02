// Модуль для работы с портфолио
export async function initPortfolio() {
    const portfolioGrid = document.querySelector('.portfolio__grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadingElement = document.querySelector('.portfolio-loading');
    const fallbackImage = './images/import-4.jpg';
    
    if (!portfolioGrid) return;
    
    let projects = [];
    let currentFilter = 'all';
    
    // Загрузка проектов из JSON
    async function loadProjects() {
        try {
            // Показываем индикатор загрузки
            if (loadingElement) {
                loadingElement.style.display = 'block';
                portfolioGrid.innerHTML = '';
            }
            
            const response = await fetch('./js/data/projects.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            projects = await response.json();
            
            // Нормализация данных
            projects = projects.map((project, index) => ({
                ...project,
                // Добавляем недостающие поля
                category: project.category || 'in-progress',
                // Уникальный ID если нет
                id: project.id || `project-${index + 1}`,
                // Полный путь к изображению
                image: project.image?.startsWith('http') ? project.image : `./${project.image}`,
                link: project.link || '',
                technologies: Array.isArray(project.technologies) ? project.technologies : []
            }));
            
            return true;
        } catch (error) {
            console.error('Ошибка загрузки проектов:', error);
            
            // Fallback на локальные данные
            projects = getFallbackProjects();
            return false;
        }
    }
    
    // Fallback данные
    function getFallbackProjects() {
        return [
            {
                id: 'project-1',
                title: 'CarLux Motors',
                description: 'Одностраничный сайт для автосервиса с прайсом, встроенной картой, отзывами и Telegram-ботом. Сайт готов.',
                image: './images/pj1.png',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Yandex Maps', 'Telegram Bot'],
                link: 'https://carluxmotors.ru/',
                category: 'completed'
            },
            {
                id: 'project-2',
                title: 'EleonorLab',
                description: 'Многостраничный сайт архитектурного бюро с каталогом 50+ проектов и Telegram-ботом. Сайт в работе.',
                image: './images/pj2.png',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'Telegram Bot', 'UI Animations'],
                link: 'https://umkanelson.github.io/EleonorLab/',
                category: 'in-progress'
            },
            {
                id: 'project-3',
                title: 'СФО Leader',
                description: 'Одностраничный сайт для специализированного финансового общества. Сайт в работе.',
                image: './images/pj3.png',
                technologies: ['HTML5', 'CSS3', 'JavaScript'],
                link: 'https://sfo-leader.ru/',
                category: 'in-progress'
            },
            {
                id: 'project-4',
                title: 'Nanotech Finance',
                description: 'Одностраничный сайт для управляющей компании нового поколения. Сайт готов.',
                image: './images/pj4.png',
                technologies: ['HTML5', 'CSS3', 'JavaScript'],
                link: 'https://nanotechfinance.ru/',
                category: 'completed'
            },
            {
                id: 'project-5',
                title: 'Интернет-магазин Охраны Труда',
                description: 'Интернет-магазин для продажи товаров охраны труда. Сайт в работе.',
                image: './images/pj5.png',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
                link: '',
                category: 'in-progress'
            },
            {
                id: 'project-6',
                title: 'Сайт для SMM-креатора',
                description: 'Промо-сайт для SMM-креатора с акцентом на визуал. Сайт в работе.',
                image: './images/pj6.png',
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'UI Animations'],
                link: '',
                category: 'in-progress'
            }
        ];
    }
    
    // Создание элемента проекта
    function createProjectElement(project) {
        const article = document.createElement('article');
        article.className = 'portfolio-item fade-in';
        article.setAttribute('data-id', project.id);
        article.setAttribute('data-category', project.category);
        
        // Безопасное экранирование HTML
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        article.innerHTML = `
            <div class="portfolio-item__image">
                <img 
                    src="${escapeHtml(project.image)}" 
                    alt="${escapeHtml(project.title)}" 
                    loading="lazy"
                    onerror="this.src='${escapeHtml(fallbackImage)}'; this.onerror=null;"
                >
            </div>
            <div class="portfolio-item__content">
                <h3 class="portfolio-item__title">${escapeHtml(project.title)}</h3>
                <p class="portfolio-item__description">${escapeHtml(project.description)}</p>
                <div class="portfolio-item__tech">
                    ${project.technologies.map(tech => 
                        `<span>${escapeHtml(tech)}</span>`
                    ).join('')}
                </div>
                <button class="btn btn--secondary portfolio-item__btn" data-project-id="${project.id}">
                    Подробнее
                </button>
            </div>
        `;
        
        // Обработчик клика
        const projectBtn = article.querySelector('.portfolio-item__btn');
        projectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProjectModal(project);
        });
        
        return article;
    }
    
    // Открытие модального окна
    function openProjectModal(project) {
        // Создаем кастомное событие
        const event = new CustomEvent('portfolio:open-project', {
            detail: { project },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
    
    // Отображение проектов
    function renderProjects(filter = 'all') {
        currentFilter = filter;
        
        const filteredProjects = filter === 'all' 
            ? projects 
            : projects.filter(project => project.category === filter);
        
        portfolioGrid.innerHTML = '';
        
        if (filteredProjects.length === 0) {
            showEmptyState();
            return;
        }
        
        filteredProjects.forEach(project => {
            const element = createProjectElement(project);
            portfolioGrid.appendChild(element);
        });
        
        // Инициализируем анимации
        initScrollAnimations();
    }
    
    // Пустое состояние
    function showEmptyState() {
        portfolioGrid.innerHTML = `
            <div class="portfolio-empty">
                <p>😔 Проекты не найдены</p>
                <p class="text-sm">Попробуйте выбрать другую категорию</p>
                <button class="btn btn--primary mt-4" onclick="window.portfolio.updateFilter('all')">
                    Показать все проекты
                </button>
            </div>
        `;
    }
    
    // Настройка фильтров
    function setupFilters() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Обновляем активную кнопку
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                
                // Фильтруем проекты
                const filter = btn.dataset.filter;
                renderProjects(filter);
                
                // Прокручиваем к секции портфолио
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // Анимации при скролле
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Lazy load изображений
                    const img = entry.target.querySelector('img[loading="lazy"]');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        document.querySelectorAll('.portfolio-item').forEach(item => {
            observer.observe(item);
        });
    }
    
    // Инициализация
    async function init() {
        // Загружаем проекты
        const success = await loadProjects();
        
        // Настраиваем фильтры
        setupFilters();
        
        // Рендерим проекты
        renderProjects();
        
        // Скрываем индикатор загрузки
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Логируем результат
        console.log(`Портфолио загружено: ${projects.length} проектов`);
        if (!success) {
            console.warn('Используются локальные данные (fallback)');
        }
    }
    
    // Запускаем инициализацию
    await init();
    
    // Экспортируем API
    return {
        updateFilter: (filter) => {
            const btn = document.querySelector(`[data-filter="${filter}"]`);
            if (btn) {
                btn.click();
            }
        },
        reload: async () => {
            await loadProjects();
            renderProjects(currentFilter);
        },
        getProjects: () => [...projects],
        getFilter: () => currentFilter
    };
}
