/* eslint-disable func-names */
import 'babel-polyfill';
import 'dotenv/config';
import Nightmare from 'nightmare';
import server from '../server/server';
import { pages, randomString } from './helpers';

require('mocha-generators').install();
require('chai').should();

const port = process.env.PORT || 7999;

describe('Page Load Tests:', function () {
  this.timeout(60000);
  let instance;
  let nightmare;

  before((done) => { // before all of the tests
    instance = server.listen(port, done);
  });

  beforeEach(() => { // before each test
    nightmare = Nightmare({ // create a new nightmare instance
      waitTimeout: 5000,
    });
  });

  afterEach(function* () { // after each test
    yield nightmare.end(); // end the nightmare instance
  });

  after((done) => {
    instance.close(done);
  });

  const checkRender = (args) => {
    it(`check if ${args.route} renders`, function* () {
      let text = yield nightmare
        .goto(`http://localhost:${port}${args.route}`)
        .wait(1000)
        .evaluate(() => document.title);
      text.should.equal(args.title);

      text = yield nightmare
        .wait('article > header > div > h2 > a')
        .evaluate(() => document.querySelector('article > header > div > h2 > a').innerText);
      text.should.equal(args.heading);
    });
  };

  // Check each page except for 404 and API routes
  pages.forEach(page => checkRender(page));

  it('check if 404 renders', function* () {
    let text = yield nightmare
      .goto(`http://localhost:${port}/${randomString(10)}`)
      .wait(1000)
      .evaluate(() => document.title);
    text.should.equal('404');

    text = yield nightmare
      .evaluate(() => document.querySelector('.not-found > h1').innerText);
    text.should.equal('PAGE NOT FOUND.');
  });
});

/* eslint-enable func-names */
