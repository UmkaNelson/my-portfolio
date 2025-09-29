// js/modules/portfolio.js
import { openModal } from './modal.js';
import { fetchProjects } from './api.js';
import { showNotification } from './notifications.js';

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ МОДУЛЯ =====
// Объявляем здесь переменные, которые используются в нескольких функциях
let projectsData = [];
let modalImage, modalTitle, modalDescription, modalTechList, modalLink;
let portfolioInitialized = false;

// ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ЭЛЕМЕНТОВ DOM =====
function getModalElements() {
    console.log('🔍 Получаем элементы модального окна...');
    
    // Находим все необходимые элементы для модального окна проекта
    // Эти элементы уже есть в HTML, мы просто получаем на них ссылки
    modalImage = document.getElementById('modal-image');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    modalTechList = document.getElementById('modal-tech-list');
    modalLink = document.getElementById('modal-link');
    
    // Проверяем, все ли элементы найдены
    const elementsFound = modalImage && modalTitle && modalDescription && modalTechList && modalLink;
    console.log('✅ Элементы модального окна:', elementsFound ? 'найдены' : 'не найдены');
    
    return elementsFound;
}

// ===== ФУНКЦИЯ ДЛЯ СОЗДАНИЯ КАРТОЧКИ ПРОЕКТА =====
function createProjectCard(projectData) {
    // Создаем div элемент для карточки проекта
    const projectCard = document.createElement('div');
    // Добавляем CSS класс для стилизации
    projectCard.classList.add('portfolio-item');
    
    // Заполняем карточку HTML содержимым
    // data-src вместо src для ленивой загрузки изображений
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

// ===== ФУНКЦИЯ ДЛЯ ОТКРЫТИЯ МОДАЛЬНОГО ОКНА ПРОЕКТА =====
function openProjectModal(e) {
    console.log('🔄 Открываем модальное окно проекта...');
    
    // Предотвращаем стандартное поведение ссылки
    e.preventDefault();
    
    // Получаем ID проекта из data-атрибута
    const projectId = this.getAttribute('data-project');
    console.log('📁 ID проекта:', projectId);
    
    // Ищем проект в массиве projectsData по ID
    const projectData = projectsData.find(project => project.id === projectId);
    
    if (projectData) {
        console.log('✅ Найден проект:', projectData.title);
        
        // Заполняем модальное окно данными проекта
        modalImage.src = projectData.image;          // Устанавливаем изображение
        modalImage.alt = projectData.title;          // Alt текст для доступности
        modalTitle.textContent = projectData.title;  // Заголовок проекта
        modalDescription.textContent = projectData.description; // Описание
        
        // Устанавливаем ссылку на проект
        modalLink.href = projectData.link;
        modalLink.textContent = projectData.link === '#' ? 'Скоро будет' : 'Перейти к проекту';
        
        // Очищаем список технологий
        modalTechList.innerHTML = '';
        
        // Заполняем список технологий
        projectData.technologies.forEach(tech => {
            const techItem = document.createElement('li'); // Создаем элемент списка
            techItem.textContent = tech;                   // Устанавливаем текст
            modalTechList.appendChild(techItem);           // Добавляем в список
        });
        
        // Открываем модальное окно
        openModal('project-modal');
    } else {
        console.error('❌ Проект не найден:', projectId);
        showNotification('Проект не найден', 'error');
    }
}

// ===== ФУНКЦИЯ ДЛЯ ИНИЦИАЛИЗАЦИИ ЛЕНИВОЙ ЗАГРУЗКИ =====
function initLazyLoading() {
    console.log('🔍 Инициализируем ленивую загрузку...');
    
    // Проверяем поддержку IntersectionObserver (современный способ отслеживания видимости элементов)
    if ('IntersectionObserver' in window) {
        // Создаем наблюдатель
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Если элемент стал видимым
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    console.log('🖼️ Загружаем изображение:', lazyImage.alt);
                    
                    // Заменяем data-src на src - браузер начнет загрузку
                    lazyImage.src = lazyImage.dataset.src;
                    // Убираем класс ленивой загрузки
                    lazyImage.classList.remove('lazy-image');
                    // Прекращаем наблюдение за этим элементом
                    imageObserver.unobserve(lazyImage);
                }
            });
        });

        // Находим все изображения с ленивой загрузкой и начинаем наблюдение
        const lazyImages = document.querySelectorAll('img.lazy-image');
        console.log('📸 Найдено изображений для ленивой загрузки:', lazyImages.length);
        
        lazyImages.forEach(lazyImage => {
            imageObserver.observe(lazyImage);
        });
    } else {
        // Fallback для старых браузеров - загружаем все сразу
        console.log('⚠️ Браузер не поддерживает IntersectionObserver');
        const lazyImages = document.querySelectorAll('img.lazy-image');
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy-image');
        });
    }
}

// ===== ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ПОРТФОЛИО =====
async function initPortfolio() {
    // Защита от повторной инициализации
    if (portfolioInitialized) {
        console.log('⚠️ Портфолио уже инициализировано');
        return;
    }
    portfolioInitialized = true;
    
    console.log('🚀 Начало инициализации портфолио...');
    
    try {
        // 1. Получаем элементы модального окна
        if (!getModalElements()) {
            throw new Error('Не найдены элементы модального окна');
        }
        
        // 2. Загружаем данные проектов
        console.log('📥 Загружаем данные проектов...');
        projectsData = await fetchProjects();
        
        if (!projectsData || projectsData.length === 0) {
            throw new Error('Не удалось загрузить данные проектов');
        }
        
        console.log('✅ Загружено проектов:', projectsData.length);
        
        // 3. Находим контейнер для проектов
        const portfolioContainer = document.getElementById('portfolio-container');
        if (!portfolioContainer) {
            throw new Error('Не найден контейнер для проектов');
        }
        
        // 4. Очищаем контейнер и создаем карточки проектов
        portfolioContainer.innerHTML = '';
        
        projectsData.forEach(project => {
            const projectCard = createProjectCard(project);
            portfolioContainer.appendChild(projectCard);
        });
        
        // 5. Добавляем обработчики событий для карточек проектов
        const portfolioLinks = document.querySelectorAll('.portfolio-link');
        portfolioLinks.forEach(link => {
            link.addEventListener('click', openProjectModal);
        });
        
        // 6. Инициализируем ленивую загрузку
        initLazyLoading();
        
        // 7. Прячем индикатор загрузки и показываем контент
        const loadingIndicator = document.getElementById('portfolio-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        console.log('🎉 Портфолио успешно инициализировано!');
        
    } catch (error) {
        console.error('❌ Ошибка инициализации портфолио:', error);
        
        // Показываем сообщение об ошибке
        const loadingIndicator = document.getElementById('portfolio-loading');
        const errorMessage = document.getElementById('portfolio-error');
        
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'block';
        
        showNotification('Ошибка загрузки портфолио', 'error');
    }
}

// Экспортируем только главную функцию инициализации
export { initPortfolio };
