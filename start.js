const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'buket-bunga-app');

console.log('🌸 Memulai Sistem Informasi Buket Bunga...');
console.log('1. Menjalankan Backend API (port 3001)...');

const backend = spawn('node', ['server.js'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit'
});

console.log('2. Menjalankan Frontend Web (port 5173)...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'inherit'
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
