import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

fileURLToPath(import.meta.url);

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function processFiles() {
  ['components', 'app'].forEach(dir => {
    walkDir(path.join(process.cwd(), dir), (filepath) => {
      if (filepath.match(/\.(tsx|ts|css)$/)) {
        let content = fs.readFileSync(filepath, 'utf8');
        if (content.includes('F35422') || content.includes('f35422')) {
          let newContent = content.replace(/F35422/g, 'C5A059').replace(/f35422/g, 'c5a059');
          fs.writeFileSync(filepath, newContent);
          console.log('Updated', filepath);
        }
      }
    });
  });
}
processFiles();
