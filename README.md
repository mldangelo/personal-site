## [mldangelo.com](http://mldangelo.com)
My personal website. Built using Node.js, React, Express, React-Router, Hot Module Reloading, Webpack and many other technologies.

### Tests:
[![Code Climate](https://codeclimate.com/github/mldangelo/mldangelo/badges/gpa.svg)](https://codeclimate.com/github/mldangelo/mldangelo)
[![Build Status](https://travis-ci.org/mldangelo/mldangelo.svg?branch=master)](https://travis-ci.org/mldangelo/mldangelo)

### Requirements:
* node >= v6.0

### Installation:

```bash
git clone git://github.com/mldangelo/mldangelo.git
cd mldangelo
npm install
```

###  Running:

1. ``` cp sample.env .env ``` and set values as appropriate.
2. Optionally configure nginx. Run:

  ```bash
  sudo ln [root directory]/nginx/mldangelo.conf [nginx directory]/sites-enabled/mldangelo.conf
  sudo service nginx restart
  ```
3. cd into [root directory] and run:

  ```bash
  npm run build
  npm start
  ```
  If running in background, use nohup or screen.
4. Navigate to `<ip>:<port> (default=7999)` and enjoy.

### Contributors
- [@mldangelo](https://github.com/mldangelo)

### Acknowlegements
- Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
- Template based on [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).

### License
[MIT](https://github.com/mldangelo/mldangelo/blob/master/LICENSE)
