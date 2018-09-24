import fs from 'fs';
import path from 'path';
import data from './app/data/routes';

/*
 * creates index.html files for all routes in ./dist
 */

data.filter(route => !route.index).forEach((route) => {
  const subdir = route.path.substr(1);
  const dir = path.join(__dirname, 'dist', subdir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.createReadStream(path.join(__dirname, 'dist/index.html'))
    .pipe(fs.createWriteStream(path.join(dir, 'index.html')));
});
