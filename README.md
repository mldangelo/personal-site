## [mldangelo.com](http://mldangelo.com)

My personal website. Built using Node.js, React, Express, React-Router, Hot Module Reloading, Webpack and many other technologies.

Note: Please see the [github-hosting](https://github.com/mldangelo/personal-site/tree/github-hosting) branch for a stripped down version of this site that can be deployed easily to github pages. Feel free to contact me at any valid email address at @mldangelo.com (ex. help@mldangelo.com) for questions about running, modifying, or contributing to this project.


### Tests:
[![Build Status](https://travis-ci.org/mldangelo/personal-site.svg?branch=master)](https://travis-ci.org/mldangelo/personal-site)
[![Dependency Tracking](https://david-dm.org/mldangelo/personal-site.svg)](https://david-dm.org/)
[![Greenkeeper badge](https://badges.greenkeeper.io/mldangelo/personal-site.svg)](https://greenkeeper.io/)

### Dependencies:
Tested with:
* node >= v11
* yarn >= v1.10.0
* mongodb >= 3.4.0


### Installation:

1. Run the following commands:
```bash
git clone git://github.com/mldangelo/personal-site.git
cd personal-site
yarn
```

2. ``` cp sample.env .env ``` and set values as appropriate.

###  Developing:
1. Set `NODE_ENV=development` in `.env`.
2. Run `npm run dev` and navigate to `<ip>:<port> (default=localhost:7999)`.

###  Running:
1. Set `NODE_ENV=production` in `.env`.
2. Run `npm run deploy` OR  
3. Run `npm run build` followed by `npm run start` and navigate to `<ip>:<port> (default=localhost:7999)`.

### Deploying:
1. Optionally configure nginx. Run:

  ```bash
  sudo ln [root directory]/nginx/mldangelo.conf [nginx directory]/sites-enabled/personal-site.conf
  sudo service nginx restart
  ```
  Note: HTTPS block should be removed if step 3 (below) is not followed.

2. Optionally configure a SSL certificate using Certbot. See [here](https://certbot.eff.org/#ubuntutrusty-nginx)
for installation and setup instructions. A cronjob such as:

  ```bash
  0 0 1 * * sudo /home/ubuntu/certbot/certbot-auto renew --quiet --no-self-upgrade
  ```

  should be set to automatically renew the certificate in production.


### Contributors
- [@mldangelo](https://github.com/mldangelo)
- [@typpo](https://github.com/typpo)

### Acknowlegements
- Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
- Template based on [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).

### License
[MIT](https://github.com/mldangelo/personal-site/blob/master/LICENSE)
