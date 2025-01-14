const fs = require('fs');
const path = require('path');

// Создаем поток чтения для файла text.txt
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');

// Направляем поток чтения в стандартный поток вывода (консоль)
readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

// Обработка ошибок
readStream.on('error', (err) => {
  console.error('Error reading file:', err);
});