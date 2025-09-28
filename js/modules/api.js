// js/modules/api.js
/**
 * Функция для загрузки данных о проектах из JSON-файла
 * @returns {Promise<Array>} Promise с массивом проектов
 */
async function fetchProjects() {
    try {
        // 1. Делаем HTTP-запрос к нашему JSON-файлу
        // fetch - встроенная функция браузера для работы с HTTP-запросами
        // await - ждем, пока запрос выполнится
        const response = await fetch('/my-portfolio/data/projects.json');     
        // 2. Проверяем, успешен ли запрос
        // response.ok будет true, если статус ответа 200-299
        if (!response.ok) {
            // Если сервер вернул ошибку (404, 500 и т.д.), выбрасываем исключение
            throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
        }     
        // 3. Парсим JSON-ответ в JavaScript-объект
        // response.json() тоже возвращает Promise, поэтому используем await
        const projects = await response.json();   
        // 4. Возвращаем полученные данные
        return projects;
    } catch (error) {
        // 5. Обрабатываем ошибки (сетевые проблемы, невалидный JSON и т.д.)
        console.error('Произошла ошибка при загрузке проектов:', error);
        // 6. Возвращаем пустой массив, чтобы приложение не сломалось
        return [];
    }
}
// Экспортируем функцию для использования в других модулях

export { fetchProjects };
