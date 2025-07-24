# Personal Website

Welcome to my [personal website](https://zhangkai.io)! This is an [MIT licensed](https://github.com/mldangelo/personal-site/blob/main/LICENSE) React-based Jamstack application. It began as a fork of [Michael D'Angelo’s personal‑site](https://github.com/mldangelo/personal-site). Michael, if you ever read this: thanks for the fantastic template and your great taste!

## 🛠 Adapting this Project

If you’d like to build your own site with this template, head over to Michael’s repository.  
His README includes a detailed **[adapting guide](./docs/adapting-guide.md)** you can follow in about 30 minutes.
I have also kept this guide file in "./docs/adapting-guide.md".

## 🔧 Dependencies

Ensure you have [node](https://nodejs.org/) >= v16. Optionally, use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage node versions.

## 🚀 Setup and Running (including some personal notes)

1. Clone the repository:

   ```bash
   git clone git://github.com/mldangelo/personal-site.git
   cd personal-site
   ```

2. (Optional) Ensure you're on Node v16 or higher:

   ```bash
   nvm install
   node --version
   ```

3. Install dependencies and sync package-lock.json (required before pushing):

   ```bash
   npm install
   ```

4. [*] Verify building before pushing:
   
   ```bash
   npm run build
   '''

4. Start the application:

   ```bash
   npm start
   ```

By default, the application should be available at [http://localhost:3000/](http://localhost:3000/).

## 🚢 Deploying

### Deploying to GitHub Pages

1. Update the environment variables and Git remote URL in [`.github/workflows/github-pages.yml`](.github/workflows/github-pages.yml).
2. Adjust the `homepage` value in `package.json` based on your hosting preferences.
3. Planning on using a custom domain? Update `public/CNAME`. Otherwise, remove it.

After making a commit to `main`, simply push your changes, and the deployment will be handled automatically.

### Static Export

For a static export without deploying to GitHub Pages:

- Remove or disable `.github/workflows/github-pages.yml`.
- Execute:

  ```bash
  npm run predeploy
  ```

This will generate a static version in `personal-site/build/` which you can host or deploy to a CDN.

## 🙌 Acknowledgements

- Again, I would like to mention that the original template is developed by [Michael D'Angelo](https://github.com/mldangelo/personal-site). Excellent design!
- Thanks [Zikai](https://zikailiu.com) for inspiring me to create this personal website.
- Special thanks to [Saverio](https://www.bsaver.io) and [Ezzat](https://www.elokda.info) for inspirations towards the website contents. Obviously they have been amazing mentors beyond just research.
