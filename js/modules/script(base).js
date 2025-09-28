// Ждем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // ===== УНИВЕРСАЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С МОДАЛЬНЫМИ ОКНАМИ =====
    // Функция для открытия модального окна по его ID
    function openModal(modalId) {
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
    // Функция для закрытия всех модальных окон
    function closeModal() {
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
    // Назначаем обработчики для всех кнопок закрытия (элементы с классом .close внутри .modal)
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        // Добавляем обработчик клика для закрытия модального окна
        closeBtn.addEventListener('click', closeModal);
    });
    // Закрытие модального окна при клике на затемненную область вокруг него
    document.querySelectorAll('.modal').forEach(modal => {
        // Добавляем обработчик клика на само модальное окно
        modal.addEventListener('click', (event) => {
            // Если клик был именно по затемненной области (а не по содержимому)
            if (event.target === modal) {
                closeModal(); // Закрываем модальное окно
            }
        });
    });
    // Закрытие модального окна по клавише Escape
    document.addEventListener('keydown', function(e) {
        // Если нажата клавиша Escape и есть открытое модальное окно
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            closeModal(); // Закрываем модальное окно
        }
    });
    // ===== НАВИГАЦИЯ И ПОДСВЕТКА СЕКЦИЙ =====
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section');
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
    // ===== МОДАЛЬНОЕ ОКНО КОНТАКТОВ =====
    // Находим ссылку, которая открывает модальное окно контактов
    const contactLink = document.querySelector('a[href="#contact-modal"]');
    // Находим форму в модальном окне
    const contactForm = document.getElementById('contact-form');
    // Если ссылка найдена
    if (contactLink) {
        // Добавляем обработчик клика
        contactLink.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылки
            openModal('contact-modal'); // Открываем модальное окно контактов
        });
    }
    // Если форма найдена
    if (contactForm) {
        // Добавляем обработчик отправки формы
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Отменяем стандартную отправку формы
            // Показываем сообщение об успешной отправке
            alert('Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
            // Сбрасываем значения формы
            contactForm.reset();       
            // Закрываем модальное окно
            closeModal();
        });
    }
    // ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ =====
    const fadeElements = document.querySelectorAll('.fade-in');
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
    // ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
    const themeToggle = document.getElementById('theme-toggle');
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
    // ===== МОДАЛЬНОЕ ОКНО ПРОЕКТОВ =====
    // Находим все ссылки на проекты в портфолио
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    // Находим элементы модального окна проектов
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechList = document.getElementById('modal-tech-list');
    const modalLink = document.getElementById('modal-link');
    // Данные для проектов
    const projectsData = {
        'project-1': {
            title: 'Личный сайт-портфолио',
            description: 'Создание современного адаптивного сайта-портфолио с использованием HTML5, CSS3 и JavaScript. Реализована темная тема, анимации и интерактивные элементы.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Flexbox', 'Grid'],
            link: '#',
            image: 'images/fon-knopki-4.jpg'
        },
        'project-2': {
            title: 'Интернет-магазин',
            description: 'Разработка полнофункционального интернет-магазина с корзиной покупок, фильтрацией товаров и системой оформления заказов.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux'],
            link: '#',
            image: 'images/fon-knopki-5.jpg'
        },
        'project-3': {
            title: 'Мобильное приложение',
            description: 'Создание кроссплатформенного мобильного приложения для учета личных финансов с синхронизацией между устройствами.',
            technologies: ['React Native', 'Firebase', 'Redux', 'Chart.js'],
            link: '#',
            image: 'images/fon-knopki-6.jpg'
        }
    };
    // Функция для открытия модального окна проекта
    function openProjectModal(e) {
        e.preventDefault(); // Отменяем стандартное поведение ссылки
        // Получаем ID проекта из data-атрибута
        const projectId = this.getAttribute('data-project');
        // Получаем данные проекта по ID
        const projectData = projectsData[projectId];
        // Если данные проекта найдены
        if (projectData) {
            // Заполняем модальное окно данными проекта
            modalImage.src = projectData.image; // Устанавливаем изображение
            modalImage.alt = projectData.title; // Устанавливаем alt текст
            modalTitle.textContent = projectData.title; // Устанавливаем заголовок
            modalDescription.textContent = projectData.description; // Устанавливаем описание
            modalLink.href = projectData.link; // Устанавливаем ссылку
            // Очищаем список технологий
            modalTechList.innerHTML = '';       
            // Заполняем список технологий
            projectData.technologies.forEach(tech => {
                const li = document.createElement('li'); // Создаем элемент списка
                li.textContent = tech; // Устанавливаем текст
                modalTechList.appendChild(li); // Добавляем в список
            });
            // Открываем модальное окно проектов
            openModal('project-modal');
        }
    }
    // Назначаем обработчики для каждой ссылки проекта
    portfolioLinks.forEach((link, index) => {
        // Убедимся, что у каждой ссылки есть data-атрибут
        if (!link.hasAttribute('data-project')) {
            link.setAttribute('data-project', `project-${index + 1}`);
        }
        // Клонируем ссылку чтобы сбросить старые обработчики событий
        const newLink = link.cloneNode(true);
        // Заменяем старую ссылку на новую
        link.parentNode.replaceChild(newLink, link);
        // Добавляем обработчик клика на новую ссылку
        newLink.addEventListener('click', openProjectModal);
    });
});