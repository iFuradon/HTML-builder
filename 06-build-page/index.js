// Импортируем необходимые модули
const fs = require('fs/promises');
const path = require('path');

// Определяем пути к папкам и файлам
const projectDistDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const assetsDistDir = path.join(projectDistDir, 'assets');
const styleDistPath = path.join(projectDistDir, 'style.css');
const indexPath = path.join(projectDistDir, 'index.html');

async function buildPage() {
  try {
    // Создаем папку project-dist, если она не существует
    await fs.mkdir(projectDistDir, { recursive: true });

    // Читаем содержимое шаблона template.html
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Читаем содержимое папки components
    const componentFiles = await fs.readdir(componentsDir, { withFileTypes: true });

    // Заменяем теги в шаблоне на содержимое компонентов
    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const componentName = path.parse(file.name).name;
        const componentPath = path.join(componentsDir, file.name);
        const componentContent = await fs.readFile(componentPath, 'utf-8');

        // Заменяем все вхождения тега {{componentName}} на содержимое компонента
        templateContent = templateContent.replace(new RegExp(`{{${componentName}}}`, 'g'), componentContent);
      }
    }

    // Записываем измененный шаблон в файл index.html
    await fs.writeFile(indexPath, templateContent);

    // Компилируем стили из папки styles в файл style.css
    await compileStyles();

    // Копируем папку assets в project-dist/assets
    await copyAssets();

    console.log('Страница успешно собрана!');
  } catch (err) {
    console.error('Ошибка при сборке страницы:', err);
  }
}

async function compileStyles() {
  try {
    // Читаем содержимое папки styles
    const styleFiles = await fs.readdir(stylesDir, { withFileTypes: true });

    // Массив для хранения стилей
    let stylesArray = [];

    // Проходим по каждому файлу в папке styles
    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        stylesArray.push(fileContent);
      }
    }

    // Объединяем все стили в одну строку и записываем в файл style.css
    await fs.writeFile(styleDistPath, stylesArray.join('\n'));
  } catch (err) {
    console.error('Ошибка при компиляции стилей:', err);
  }
}

async function copyAssets() {
  try {
    // Создаем папку project-dist/assets, если она не существует
    await fs.mkdir(assetsDistDir, { recursive: true });

    // Читаем содержимое папки assets
    const assets = await fs.readdir(assetsDir, { withFileTypes: true });

    // Копируем каждый элемент из папки assets в project-dist/assets
    for (const asset of assets) {
      const sourcePath = path.join(assetsDir, asset.name);
      const targetPath = path.join(assetsDistDir, asset.name);

      if (asset.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  } catch (err) {
    console.error('Ошибка при копировании папки assets:', err);
  }
}

async function copyDirectory(source, target) {
  // Создаем целевую папку, если она не существует
  await fs.mkdir(target, { recursive: true });

  // Читаем содержимое исходной папки
  const files = await fs.readdir(source, { withFileTypes: true });

  // Копируем каждый элемент
  for (const file of files) {
    const sourcePath = path.join(source, file.name);
    const targetPath = path.join(target, file.name);

    if (file.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

// Вызываем функцию для сборки страницы
buildPage();