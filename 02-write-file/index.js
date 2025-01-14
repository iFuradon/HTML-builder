const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Создаем путь к файлу
const filePath = path.join(__dirname, 'output.txt');

// Создаем поток для записи в файл
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

// Создаем интерфейс для чтения ввода с консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Приветственное сообщение
console.log('Введите текст для записи в файл. Для выхода введите "exit" или нажмите Ctrl+C.');

// Функция для обработки ввода пользователя
const handleInput = (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('До свидания!');
    writeStream.end();
    rl.close();
    process.exit(0);
  } else {
    writeStream.write(input + '\n');
    console.log('Текст записан в файл. Введите еще текст или "exit" для выхода.');
  }
};

// Обработка ввода с консоли
rl.on('line', handleInput);

// Обработка сигнала SIGINT (Ctrl+C)
rl.on('SIGINT', () => {
  console.log('До свидания!');
  writeStream.end();
  rl.close();
  process.exit(0);
});