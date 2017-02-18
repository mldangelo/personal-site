import 'babel-polyfill';
import 'dotenv/config';
import Nightmare from 'nightmare';
import server from '../server';
import { randomString } from './helpers';

require('mocha-generators').install();
const should = require('chai').should();

const port = process.env.PORT || 7999;

// TO WRITE
// check to make sure all pages render
// make sure all api routes return stuff 
// check that 404 exits -- check status

// check that react app compiles 

// do everything in dev and production mode 
// do everything for different viewports 
// click buttons on hamburger menus 
// check for console errors on all pages 

// check for linter errors - js and scss 
// check for package.json updates 


describe('Page Load Tests:', function () {
  this.timeout(60000);
  
  let nightmare;
  
  before(done => { //before all of the tests
    server.listen(port, done);
  });
  
  beforeEach(() => { //before each test
    nightmare = Nightmare();//create a new nightmare instance
  });

  //after each test,
  afterEach(function*() {
    //end the nightmare instance
    yield nightmare.end();
  })

  const pages = [
    {
      route: '/',
      title: 'Michael D\'Angelo',
      heading: 'ABOUT THIS SITE',
    },
    {
      route: '/about',
      title: 'About | Michael D\'Angelo',
      heading: 'ABOUT ME',
    },
    {
      route: '/resume',
      title: 'Resume | Michael D\'Angelo',
      heading: 'RESUME',
    },
    {
      route: '/projects',
      title: 'Projects | Michael D\'Angelo',
      heading: 'PROJECTS',
    },
    {
      route: '/stats',
      title: 'Stats | Michael D\'Angelo',
      heading: 'STATS',
    },
    {
      route: '/contact',
      title: 'Contact | Michael D\'Angelo',
      heading: 'CONTACT',
    },
    {
      route: '/music',
      title: 'Music | Michael D\'Angelo',
      heading: 'SOME BANDS THAT I LIKE',
    }
  ];
  
  const checkRender = (args) => {
    it(`check if ${args.route} renders`, function*() {
      let text = yield nightmare
        .goto(`http://localhost:${port}${args.route}`)
        .wait(100)
        .evaluate(() => document.title);
      text.should.equal(args.title);
      
      text = yield nightmare
        .wait('.post>header .title h2')
        .evaluate(() => document.querySelector('.post>header .title h2').innerText);
      text.should.equal(args.heading);
    });
  };
  
  pages.forEach(page => checkRender(page));
  
  it(`check if 404 renders`, function*() {
    let text = yield nightmare
      .goto(`http://localhost:${port}/${randomString(10)}`)
      .evaluate(() => document.title);
    text.should.equal('404');
    
    text = yield nightmare
      .evaluate(() => document.querySelector('.not-found>h1').innerText);
    text.should.equal('PAGE NOT FOUND.');
  });
  
});
