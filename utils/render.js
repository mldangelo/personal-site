/* eslint-disable no-await-in-loop, no-restricted-syntax */
import 'dotenv/config';

import Chromy from 'chromy';
import fs from 'fs';
import path from 'path';

import server from '../server/server';
import routes from '../app/data/routes';

const port = process.env.PORT || 7999;
const env = process.env.NODE_ENV || 'development';

/*
 * Renders react applicaton for each defined route and
 * places index.html files for all routes in ./dist
 */

const run = async () => {
  const instance = server.listen(port, () => {
    console.info(`Server started on port ${port} in ${env} mode.`);
  });

  const chromy = new Chromy();

  for (const route of routes) {
    const subdir = route.path.substr(1); // ex. /projects -> projects
    const dir = path.join(__dirname, '../dist', subdir);

    await chromy.goto(`http://localhost:${port}${route.path}`);
    await chromy.wait('article'); // ensures app has rendered
    const html = await chromy.evaluate(() => document.documentElement.outerHTML);

    // create directory if doesn't exist
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    fs.writeFile(path.join(dir, 'index.html'), html, () => {
      console.info(`Rendered ${route.path}`);
    });
  }

  await chromy.close();
  instance.close();
  process.exit(0);
};

run();
/* eslint-enable no-await-in-loop, no-restricted-syntax */
