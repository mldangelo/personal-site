## [mldangelo.com](http://mldangelo.com)

My personal website. Built using Node.js, React, Express, React-Router, Hot Module Reloading, Webpack and many other technologies.

### Tests:
[![Code Climate](https://codeclimate.com/github/mldangelo/mldangelo/badges/gpa.svg)](https://codeclimate.com/github/mldangelo/mldangelo)
[![Build Status](https://travis-ci.org/mldangelo/mldangelo.svg?branch=master)](https://travis-ci.org/mldangelo/mldangelo)
[![Dependency Tracking](https://david-dm.org/mldangelo/mldangelo.svg)](https://david-dm.org/)
[![Greenkeeper badge](https://badges.greenkeeper.io/mldangelo/mldangelo.svg)](https://greenkeeper.io/)

### Dependencies:
* node >= v6.0.0
* yarn >= v0.20.0
* mongodb >= 3.4.0

### Installation:

1. Run the following commands:
  ```bash
  git clone git://github.com/mldangelo/mldangelo.git
  cd mldangelo
  yarn
  ```

2. Optionally configure nginx. Run:

  ```bash
  sudo ln [root directory]/nginx/mldangelo.conf [nginx directory]/sites-enabled/mldangelo.conf
  sudo service nginx restart
  ```
  Note: HTTPS block should be removed if step 3 (below) is not followed.

3. Optionally configure a SSL certificate using Certbot. See [here](https://certbot.eff.org/#ubuntutrusty-nginx)
for installation and setup instructions. A cronjob such as:

  ```bash
  0 0 1 * * sudo /home/ubuntu/certbot/certbot-auto renew --quiet --no-self-upgrade
  ```

  should be set to automatically renew the certificate in production.


###  Running:

1. ``` cp sample.env .env ``` and set values as appropriate.

2. Run `npm run forever-start` and navigate to `<ip>:<port> (default=7999)`.

###  Developing:
1. Set `NODE_ENV=development` in `.env`.
2. Run `npm run dev`

### Contributors
- [@mldangelo](https://github.com/mldangelo)
- [@typpo](https://github/typpo)

### Acknowlegements
- Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
- Template based on [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).

### License
[MIT](https://github.com/mldangelo/mldangelo/blob/master/LICENSE)
