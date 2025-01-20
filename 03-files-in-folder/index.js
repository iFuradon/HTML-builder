// Импортируем необходимые модули
const fs = require('fs/promises');
const path = require('path');

// Определяем путь к папке secret-folder
const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    // Читаем содержимое папки с опцией { withFileTypes: true }
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    // Проходим по каждому элементу в папке
    for (const file of files) {
      // Проверяем, является ли элемент файлом
      if (file.isFile()) {
        // Получаем полный путь к файлу
        const filePath = path.join(folderPath, file.name);
        
        // Получаем информацию о файле
        const stats = await fs.stat(filePath);
        
        // Получаем имя файла и расширение
        const fileName = path.parse(file.name).name;
        const fileExtension = path.extname(file.name).slice(1);
        
        // Получаем размер файла в килобайтах
        const fileSize = (stats.size / 1024).toFixed(3);
        
        // Выводим информацию о файле в консоль
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Ошибка при чтении папки:', err);
  }
}

// Вызываем функцию для отображения информации о файлах
displayFileInfo();