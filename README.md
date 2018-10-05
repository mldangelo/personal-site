## [mldangelo.com](http://mldangelo.com)

My personal website. Built using Node.js, React, Express, React-Router, Hot Module Reloading, Webpack and many other technologies.

### Tests:
[![Code Climate](https://codeclimate.com/github/mldangelo/mldangelo/badges/gpa.svg)](https://codeclimate.com/github/mldangelo/mldangelo)
[![Build Status](https://travis-ci.org/mldangelo/mldangelo.svg?branch=master)](https://travis-ci.org/mldangelo/mldangelo)
[![Dependency Tracking](https://david-dm.org/mldangelo/mldangelo.svg)](https://david-dm.org/)
[![Greenkeeper badge](https://badges.greenkeeper.io/mldangelo/mldangelo.svg)](https://greenkeeper.io/)

### Dependencies:
Tested with:
* node >= v8.12.0
* yarn >= v1.10.0

### Installation:

1. Run the following commands:
  ```bash
  git clone git://github.com/mldangelo/personal-site.git
  cd personal-site
  yarn
  ```

###  Developing:
1. ``` cp sample.env .env ``` and set values as appropriate.
2. Run `npm run dev` and navigate to `<ip>:<port> (localhost:7999)`.

###  Deploying:
This branch is configured for deployment with github pages. To deploy:
1. Modify the `CNAME` file to reference your custom domain.
2. Change `NODE_ENV` to `production` in `.env`
3. Run `npm run deploy`
4. Go to `https://github.com/[your github username]/personal-site/settings` and configure accordingly

![github hosting instructions](docs/gh-pages.png)


5. Configure your domains DNS record. See https://help.github.com/articles/using-a-custom-domain-with-github-pages/ for more information.

Please feel free to reach out to me by filing an issue or at help@mldangelo.com for help configuring your project.

### Contributors
- [@mldangelo](https://github.com/mldangelo)
- [@typpo](https://github/typpo)

### Acknowlegements
- Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
- Template based on [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).

### License
[MIT](https://github.com/mldangelo/mldangelo/blob/master/LICENSE)
