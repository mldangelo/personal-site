/* eslint-disable func-names */
import 'dotenv/config';

import Chromy from 'chromy';

import server from '../server/server';
import { pages, randomString } from './helpers';

require('chai').should();

const port = process.env.PORT || 7999;

describe('Page Load Tests:', async function () {
  this.timeout(120000);
  let instance;
  let chromy;

  before((done) => { // before all of the tests
    instance = server.listen(port, done);
    chromy = new Chromy();
  });

  after(async () => {
    await Chromy.cleanup();
    await instance.close();
  });

  async function checkRender(args) {
    it(`check if ${args.route} renders`, async () => {
      await chromy.goto(`http://localhost:${port}${args.route}`);

      const title = await chromy.evaluate(() => document.title);
      title.should.equal(args.title);

      await chromy.wait('article > header > div > h2 > a');
      const header = await chromy.evaluate(() => document.querySelector('article > header > div > h2 > a').innerText);
      header.should.equal(args.heading);
    });
  }

  // Check each page except for 404 and API routes
  pages.forEach(page => checkRender(page));

  it('check if 404 renders', async () => {
    await chromy.goto(`http://localhost:${port}/${randomString(10)}`);
    await chromy.wait('#root > div > h1');
    const title = await chromy.evaluate(() => document.title);
    title.should.equal('404');
    const header = await chromy.evaluate(() => document.querySelector('.not-found > h1').innerText);
    header.should.equal('PAGE NOT FOUND.');
  });
});

/* eslint-enable func-names */
