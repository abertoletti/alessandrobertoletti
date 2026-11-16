import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
await cp('public', 'dist/public', { recursive: true });
await cp('en', 'dist/en', { recursive: true });
console.log('Build completata in dist/');
