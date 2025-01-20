// Импортируем необходимые модули
const fs = require('fs/promises');
const path = require('path');

// Определяем пути к папкам
const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    // Создаем папку files-copy, если она не существует
    await fs.mkdir(targetDir, { recursive: true });

    // Читаем содержимое папки files
    const files = await fs.readdir(sourceDir, { withFileTypes: true });

    // Удаляем файлы в папке files-copy, которые отсутствуют в папке files
    const existingFiles = await fs.readdir(targetDir);
    for (const file of existingFiles) {
      const filePath = path.join(targetDir, file);
      await fs.unlink(filePath);
    }

    // Копируем файлы из папки files в папку files-copy
    for (const file of files) {
      if (file.isFile()) {
        const sourceFilePath = path.join(sourceDir, file.name);
        const targetFilePath = path.join(targetDir, file.name);
        await fs.copyFile(sourceFilePath, targetFilePath);
      }
    }

    console.log('Копирование завершено успешно!');
  } catch (err) {
    console.error('Ошибка при копировании:', err);
  }
}

// Вызываем функцию для копирования директории
copyDir();