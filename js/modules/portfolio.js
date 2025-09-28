// js/modules/portfolio.js
import { openModal } from './modal.js';
import { fetchProjects } from './api.js';
import { showNotification } from './notifications.js';

// Защита от множественной инициализации
let portfolioInitialized = false;
let filterTimeout;

// Функция для ожидания появления элементов в DOM
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Элемент ${selector} не найден за ${timeout}ms`));
        }, timeout);
    });
}

// Функция для управления видимостью элементов загрузки
function toggleLoadingElements(showLoading, showGrid, showError) {
    const loadingIndicator = document.getElementById('portfolio-loading');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const errorMessage = document.getElementById('portfolio-error');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = showLoading ? 'block' : 'none';
    }
    if (portfolioGrid) {
        portfolioGrid.style.display = showGrid ? 'grid' : 'none';
    }
    if (errorMessage) {
        errorMessage.style.display = showError ? 'block' : 'none';
    }
}

// Функция для создания HTML-карточки проекта с ленивой загрузкой
function createProjectCard(projectData) {
    const projectCard = document.createElement('div');
    projectCard.classList.add('portfolio-item');
    
    // Вместо src используем data-src для ленивой загрузки
    projectCard.innerHTML = `
        <img data-src="${projectData.image}" alt="${projectData.title}" class="portfolio-image lazy-image">
        <div class="portfolio-overlay">
            <h3>${projectData.title}</h3>
            <p>${projectData.description.substring(0, 100)}...</p>
            <a href="#" class="portfolio-link" data-project="${projectData.id}">Посмотреть</a>
        </div>
    `;
    
    return projectCard;
}

// Функция для создания фильтров с защитой от дублирования
function createTechnologyFilters(projectsData) {
    console.log('🔧 Создаём фильтры технологий...');
    
    // Проверяем, не существуют ли уже фильтры
    const existingFilters = document.querySelector('.portfolio-filters');
    if (existingFilters) {
        console.log('⚠️ Фильтры уже существуют, удаляем старые...');
        existingFilters.remove();
    }
    
    // Собираем все уникальные технологии из всех проектов
    const allTechnologies = new Set();
    
    projectsData.forEach(project => {
        project.technologies.forEach(tech => {
            allTechnologies.add(tech);
        });
    });
    
    console.log('📊 Найдено технологий:', allTechnologies.size);
    
    // Создаём контейнер для фильтров
    const filtersContainer = document.createElement('div');
    filtersContainer.classList.add('portfolio-filters');
    
    // Создаём кнопку "Все"
    const allButton = document.createElement('button');
    allButton.textContent = 'Все';
    allButton.classList.add('filter-btn', 'active');
    allButton.setAttribute('aria-label', 'Показать все проекты');
    allButton.setAttribute('aria-pressed', 'true');
    allButton.addEventListener('click', (e) => filterProjects('all', projectsData, e));
    filtersContainer.appendChild(allButton);
    
    // Создаём кнопки для каждой технологии
    allTechnologies.forEach(tech => {
        const button = document.createElement('button');
        button.textContent = tech;
        button.classList.add('filter-btn');
        button.setAttribute('aria-label', `Фильтровать проекты по технологии ${tech}`);
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', (e) => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(() => {
                filterProjects(tech, projectsData, e);
            }, 150);
        });
        filtersContainer.appendChild(button);
    });
    
    // Вставляем фильтры перед контейнером проектов
    const portfolioContainer = document.getElementById('portfolio-container');
    portfolioContainer.parentNode.insertBefore(filtersContainer, portfolioContainer);
    
    console.log('✅ Фильтры успешно созданы');
}

// Функция для фильтрации проектов с анимациями
function filterProjects(technology, projectsData, event) {
    console.log('🎛️ Фильтруем проекты по технологии:', technology);
    
    const portfolioContainer = document.getElementById('portfolio-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Убираем активный класс со всех кнопок
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Добавляем активный класс нажатой кнопке
    event.target.classList.add('active');
    event.target.setAttribute('aria-pressed', 'true');
    
    // Получаем текущие карточки проектов
    const currentProjects = Array.from(portfolioContainer.children);
    
    // Если нет проектов для анимации, просто отображаем новые
    if (currentProjects.length === 0) {
        displayFilteredProjects(technology, projectsData);
        return;
    }
    
    // Анимация исчезновения текущих проектов
    currentProjects.forEach((project, index) => {
        setTimeout(() => {
            project.style.transform = 'scale(0.8)';
            project.style.opacity = '0';
        }, index * 50);
    });
    
    // После анимации исчезновения показываем новые проекты
    setTimeout(() => {
        displayFilteredProjects(technology, projectsData);
    }, currentProjects.length * 50 + 200);
}

// Вспомогательная функция для отображения отфильтрованных проектов
function displayFilteredProjects(technology, projectsData) {
    const portfolioContainer = document.getElementById('portfolio-container');
    
    // Очищаем контейнер
    portfolioContainer.innerHTML = '';
    
    // Фильтруем проекты
    const filteredProjects = technology === 'all' 
        ? projectsData 
        : projectsData.filter(project => 
            project.technologies.includes(technology)
        );
    
    // Создаём карточки для отфильтрованных проектов
    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        
        // Начальное состояние для анимации появления
        projectCard.style.transform = 'translateY(30px)';
        projectCard.style.opacity = '0';
        projectCard.style.transition = 'all 0.5s ease';
        
        portfolioContainer.appendChild(projectCard);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            projectCard.style.transform = 'translateY(0)';
            projectCard.style.opacity = '1';
        }, index * 100);
    });
    
    // Обновляем обработчики событий для новых карточек
    setTimeout(() => {
        const portfolioLinks = document.querySelectorAll('.portfolio-link');
        portfolioLinks.forEach(link => {
            link.addEventListener('click', openProjectModal);
        });
        
        // Переинициализируем ленивую загрузку для новых изображений
        initLazyLoading();
    }, filteredProjects.length * 100 + 100);
}

// Функция для ленивой загрузки изображений
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    console.log('🖼️ Загружаем изображение:', lazyImage.alt);
                    
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy-image');
                    imageObserver.unobserve(lazyImage);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img.lazy-image');
        lazyImages.forEach(lazyImage => {
            imageObserver.observe(lazyImage);
        });
        
        console.log('🔍 Ленивая загрузка активирована для', lazyImages.length, 'изображений');
    } else {
        console.log('⚠️ Браузер не поддерживает IntersectionObserver, отключаем ленивую загрузку');
        const lazyImages = document.querySelectorAll('img.lazy-image');
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy-image');
        });
    }
}

// Функция для открытия модального окна проекта
function openProjectModal(e) {
    e.preventDefault();
    
    const projectId = this.getAttribute('data-project');
    const projectData = projectsData.find(project => project.id === projectId);
    
    if (projectData) {
        modalImage.src = projectData.image;
        modalImage.alt = projectData.title;
        modalTitle.textContent = projectData.title;
        modalDescription.textContent = projectData.description;
        modalLink.href = projectData.link;
        
        modalTechList.innerHTML = '';
        projectData.technologies.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            modalTechList.appendChild(li);
        });
        
        openModal('project-modal');
    }
}

// Объявляем переменные в глобальной области видимости функции initPortfolio
let projectsData = [];
let modalImage, modalTitle, modalDescription, modalTechList, modalLink;

async function initPortfolio() {
    // Защита от повторной инициализации
    if (portfolioInitialized) {
        console.log('⚠️ Портфолио уже инициализировано, пропускаем...');
        return;
    }
    portfolioInitialized = true;
    
    console.log('🚀 Инициализация портфолио...');
    
    // Показываем индикатор загрузки, скрываем остальное
    toggleLoadingElements(true, false, false);
    
    try {
        console.log('⏳ Ожидаем появления элементов портфолио...');
        
        // Ждем появления элементов модального окна (они есть в HTML)
        await waitForElement('#modal-image');
        console.log('✅ Элемент modal-image найден');
        
        await waitForElement('#modal-title');
        console.log('✅ Элемент modal-title найден');
        
        await waitForElement('#modal-tech-list');
        console.log('✅ Элемент modal-tech-list найден');
        
        // Получаем элементы DOM для модального окна
        modalImage = document.getElementById('modal-image');
        modalTitle = document.getElementById('modal-title');
        modalDescription = document.getElementById('modal-description');
        modalTechList = document.getElementById('modal-tech-list');
        modalLink = document.getElementById('modal-link');
        
    } catch (error) {
        console.error('❌ Ошибка при ожидании элементов:', error);
        toggleLoadingElements(false, false, true);
        showNotification('Ошибка загрузки портфолио', 'error');
        return;
    }
    
    // Загружаем данные проектов
    console.log('📥 Загружаем данные проектов...');
    projectsData = await fetchProjects();
    
    if (projectsData.length === 0) {
        console.warn('⚠️ Не удалось загрузить данные проектов');
        toggleLoadingElements(false, false, true);
        showNotification('Не удалось загрузить проекты', 'error');
        return;
    }
    
    console.log('✅ Загружено проектов:', projectsData.length);
    
    // Находим контейнер для проектов
    const portfolioContainer = document.getElementById('portfolio-container');
    
    // Очищаем контейнер (на случай повторной загрузки)
    portfolioContainer.innerHTML = '';
    
    // Для каждого проекта создаём карточку и добавляем в контейнер
    projectsData.forEach(project => {
        const projectCard = createProjectCard(project);
        portfolioContainer.appendChild(projectCard);
    });
    
    // Скрываем индикатор загрузки и показываем сетку проектов
    toggleLoadingElements(false, true, false);
    
    // Теперь нужно заново найти все ссылки портфолио (они были созданы динамически)
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    
    // Назначаем обработчики для новых ссылок
    portfolioLinks.forEach(link => {
        link.addEventListener('click', openProjectModal);
    });
    
    // Создаём фильтры по технологиям
    createTechnologyFilters(projectsData);
    
    // Инициализируем ленивую загрузку изображений
    initLazyLoading();
    
    console.log('✅ Портфолио успешно инициализировано');
}

export { initPortfolio };