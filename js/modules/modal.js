// Модуль для работы с модальными окнами
export function initModals() {
    const projectModal = document.getElementById('project-modal');
    const privacyModal = document.getElementById('privacy-policy');
    const closeBtns = document.querySelectorAll('.modal__close');
    
    // Закрытие модальных окон
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Открытие модального окна проекта
    function openProjectModal(project) {
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-image').src = project.image;
        document.getElementById('modal-image').alt = project.title;
        document.getElementById('modal-link').href = project.link;
        
        const techList = document.getElementById('modal-tech-list');
        techList.innerHTML = '';
        project.technologies.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            techList.appendChild(li);
        });
        
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие по клику на фон
    [projectModal, privacyModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
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