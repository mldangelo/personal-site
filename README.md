# Personal Website

Welcome to my [personal website](https://dase.dev)! This is an [MIT licensed](https://github.com/adase11/personal-site/blob/main/LICENSE) React-based Jamstack application. It offers a simple interface, easy modifications, static export capabilities, and free automatic deployments via [GitHub Pages](https://pages.github.com/).

## 🚀 Features

- Built with modern JavaScript and TypeScript, using tools and frameworks like [create-react-app](https://github.com/facebook/create-react-app), [React-Router](https://reactrouter.com/), and SCSS.
- Automated workflows via [GitHub Actions](https://github.com/features/actions).
- And more!

## 🛠 Adapting this Project

I forked this project from Michael D'Angelo's original [project](https://github.com/mldangelo/personal-site). If you'd like to create your own personal website based on this project, it shouldn't
be too different from the instructions on Michael's page. Or you can clone/fork his directly.

## 🤝 Contributing

Your contributions are warmly welcomed! If you wish to contribute, please review the [design goals](./docs/design-goals.md), [roadmap](./docs/roadmap.md), and [contributing guidelines](./docs/contributing.md). For any bugs or suggestions, you can submit a pull request, or open an issue.

## 🔧 Dependencies

Ensure you have [node](https://nodejs.org/) >= v20. Optionally, use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage node versions.

## 🚀 Setup and Running

1. Clone the repository:

   ```bash
   git clone git://github.com/adase11/personal-site.git
   cd personal-site
   ```

2. (Optional) Ensure you're on Node v20 or higher:

   ```bash
   nvm install
   node --version
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

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

- Michael D'Angelo's [personal site](https://github.com/mldangelo/personal-site) is the basis for this project.

### From Michael's Acknowledgements
- Initial template from [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).
- Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
- Kudos to [@notrueblood](https://github.com/notrueblood)[<sup>[1]</sup>](https://github.com/adase11/personal-site/pull/218) and [@sjhsieh](https://github.com/sjhsieh)[<sup>[2]</sup>](https://github.com/adase11/personal-site/issues/168) for their constructive feedback.
