// Импортируем необходимые модули
const fs = require('fs/promises');
const path = require('path');

// Определяем пути к папкам
const stylesDir = path.join(__dirname, 'styles');
const bundleDir = path.join(__dirname, 'project-dist', 'bundle.css');

async function buildCSSBundle() {
  try {
    // Читаем содержимое папки styles
    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    // Массив для хранения стилей
    let stylesArray = [];

    // Проходим по каждому файлу в папке styles
    for (const file of files) {
      // Проверяем, является ли элемент файлом и имеет ли расширение .css
      if (file.isFile() && path.extname(file.name) === '.css') {
        // Получаем полный путь к файлу
        const filePath = path.join(stylesDir, file.name);
        
        // Читаем содержимое файла
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Добавляем содержимое файла в массив
        stylesArray.push(fileContent);
      }
    }

    // Объединяем все стили в одну строку
    const bundleContent = stylesArray.join('\n');

    // Записываем объединенные стили в файл bundle.css
    await fs.writeFile(bundleDir, bundleContent);

    console.log('CSS bundle создан успешно!');
  } catch (err) {
    console.error('Ошибка при создании CSS bundle:', err);
  }
}

// Вызываем функцию для сборки CSS bundle
buildCSSBundle();