#!/usr/bin/env node
/**
 * FRIVOXSTREAM RESTORE SCRIPT
 * Usage: node restore.js
 */

const fs = require('fs');
const path = require('path');

const backupDir = __dirname;
const projectRoot = path.join(__dirname, '..', '..', '..');

console.log('📦 FrivoxStream Restore');
console.log('========================\n');

// Load manifest
const manifest = JSON.parse(fs.readFileSync(path.join(backupDir, 'MANIFEST.json'), 'utf8'));
console.log('📋 Backup:', manifest.backup_name);
console.log('📅 Date:', manifest.backup_date);
console.log('📁 Files:', manifest.stats.total_files);
console.log('');

// Restore function
function restoreFile(filePath, content) {
  const fullPath = path.join(projectRoot, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
  console.log('  ✅', filePath);
}

// Restore each JSON file
const jsonFiles = ['page.json', 'api.json', 'lib.json', 'components.json', 'pages.json', 'config.json', 'scripts.json'];

jsonFiles.forEach(filename => {
  const filePath = path.join(backupDir, filename);
  if (!fs.existsSync(filePath)) return;
  
  console.log('\n📄 Restoring from', filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.entries(data).forEach(([relPath, fileData]) => {
    if (fileData.content) {
      restoreFile(relPath, fileData.content);
    }
  });
});

console.log('\n✨ Restore complete!');
console.log('\n📝 Next steps:');
console.log('   npx prisma generate');
console.log('   npx prisma db push');
console.log('   bun run dev');
