// Модуль для работы с модальными окнами
export function initModals() {
    const projectModal = document.getElementById('project-modal');
    const privacyModal = document.getElementById('privacy-policy');
    const closeBtns = document.querySelectorAll('.modal__close');
    const fallbackImage = './images/import-4.jpg';
    
    // Закрытие модальных окон
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.body.classList.remove('modal-open');
    }
    
    // Открытие модального окна проекта
    function openProjectModal(project) {
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-image').src = project.image;
        document.getElementById('modal-image').alt = project.title;
        
        // Добавляем обработчик ошибок для изображения
        const modalImage = document.getElementById('modal-image');
        modalImage.onerror = function() {
            this.src = fallbackImage;
        };
        
        const modalLink = document.getElementById('modal-link');
        if (project.link) {
            modalLink.href = project.link;
            modalLink.style.display = 'inline-flex';
            modalLink.removeAttribute('aria-disabled');
            modalLink.removeAttribute('tabindex');
        } else {
            modalLink.removeAttribute('href');
            modalLink.style.display = 'none';
            modalLink.setAttribute('aria-disabled', 'true');
            modalLink.setAttribute('tabindex', '-1');
        }
        
        const techList = document.getElementById('modal-tech-list');
        techList.innerHTML = '';
        project.technologies.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            techList.appendChild(li);
        });
        
        // Добавляем дополнительные данные если есть
        const existingFeaturesSection = document.getElementById('modal-features');
        if (project.features && project.features.length > 0) {
            const featuresSection = document.getElementById('modal-features') || 
                (() => {
                    const section = document.createElement('div');
                    section.id = 'modal-features';
                    section.className = 'project-modal__features';
                    section.innerHTML = '<h3>Особенности проекта</h3><ul></ul>';
                    techList.parentNode.insertBefore(section, techList.nextSibling);
                    return section;
                })();
            
            const featuresList = featuresSection.querySelector('ul');
            featuresList.innerHTML = '';
            project.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
        } else if (existingFeaturesSection) {
            existingFeaturesSection.remove();
        }
        
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
        
        // Управление фокусом
        trapFocus(projectModal);
    }
    
    // Захват фокуса внутри модального окна
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // Фокусируемся на первом элементе
        setTimeout(() => firstElement.focus(), 100);
    }
    
    // Закрытие по клику на фон
    [projectModal, privacyModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal__overlay')) {
                    closeModal(modal);
                }
            });
        }
    });
    
    // Закрытие по крестику
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Экспортируем функцию открытия модального окна
    window.openProjectModal = openProjectModal;
}
