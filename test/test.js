/* eslint-disable func-names */
import 'dotenv/config';

import puppeteer from 'puppeteer';

import server from '../server/server';
import { pages, randomString } from './helpers';

require('chai').should();

const port = process.env.PORT || 7999;

describe('Page Load Tests:', async function () {
  this.timeout(120000);
  let instance;
  let browser;
  let page;

  before(async () => { // before all of the tests
    instance = server.listen(port);
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
    await instance.close();
  });

  async function checkRender(args) {
    it(`check if ${args.route} renders`, async () => {
      await page.goto(`http://localhost:${port}${args.route}`);
      await page.waitFor(1000);
      const title = await page.evaluate(() => document.title);
      title.should.equal(args.title);

      await page.waitForSelector('article > header > div > h2 > a');
      const header = await page.evaluate(() => document.querySelector('article > header > div > h2 > a').innerText);
      header.should.equal(args.heading);
    });
  }

  // Check each page except for 404 and API routes
  pages.forEach((url) => checkRender(url));

  it('check if 404 renders', async () => {
    await page.goto(`http://localhost:${port}/${randomString(10)}`);
    await page.waitFor(1000);
    await page.waitForSelector('#root > div > h1');
    const title = await page.evaluate(() => document.title);
    title.should.equal('404');
    const header = await page.evaluate(() => document.querySelector('.not-found > h1').innerText);
    header.should.equal('PAGE NOT FOUND.');
  });
});

/* eslint-enable func-names */
