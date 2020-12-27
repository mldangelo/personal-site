# Personal Website

## [mldangelo.github.io/personal-site](https://mldangelo.github.io/personal-site/) and express-powered [mldangelo.com](http://mldangelo.com)

My personal website. A simple, easily modifiable (([instructions here](./docs/adapting.md))), statically-exportable [React](https://reactjs.org/) application that deploys automatically for free using [github pages](https://pages.github.com/). Built using modern javascript, based on [create-react-app](https://github.com/facebook/create-react-app) with [React-Router](https://reactrouter.com/), SCSS, [github actions](https://github.com/features/actions), and many other useful libraries. Continue reading to modify this site to make it your own.

Note: The [`main`](https://github.com/mldangelo/personal-site/tree/main) branch of this repository contains a statically-exportable version of my website intended for serverless hosting on github pages. If you're starting out, I recommend you start from `main`. The [`server`](https://github.com/mldangelo/personal-site/tree/server) branch hosted at [mldangelo.com](https://mldangelo.com) includes protected routes, google oauth, an admin dashboard, a database, and backend API calls to other third party services.

## Adapting this Project

Follow the setup instructions below. Then review detailed notes and a checklist on adapting this project ([here](./docs/adapting.md)). Please feel free to reach out to me by filing an issue or emailing me at [help@mldangelo.com](mailto:help@mldangelo.com) for help configuring your project.

## Dependencies

Tested with:

* node >= v12, v14.
* (Optional) [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended for managing node versions.

## Set up

1. To download the repository and install dependencies:
    1. Optionally fork this repository (if you plan on modifying the project).
    2. Run the following commands:

        ```bash
        git clone git://github.com/mldangelo/personal-site.git # replace [mldangelo] with your github username if you forked first.
        cd personal-site
        nvm install # this is optional - make sure you're running >= node 12 with `node --version`
        npm install
        ```

## Running

1. Run the following command to build the react application and serve it with fast refresh (hot module reloading):

    ```bash
    npm start
    ```

    Your web browser should automatically open to `<ip>:<port>:<path>` default: [http://localhost:3000/personal-site](http://localhost:3000/personal-site).

## Deploying

### Deploying to Github Pages

Modify the environmental variables and git remote url in [.github/workflows/github-pages.yml](.github/workflows/github-pages.yml)

Make a commit and push your changes to main. That's it.

### Static Export

To statically export the site without deploying to github pages, delete or disable `.github/workflows/github-pages.yml` and run `npm run predeploy`. This generates a static export of the website in a `build` folder. Copy this and self-host or deploy to a CDN of your choosing.

## Contributing

Contributions are actively encouraged. Please review the [design goals](./docs/design-goals.md), [roadmap](./docs/roadmap.md), and [contributing guidelines](./docs/contributing.md).

## Acknowledgements

* Template based on [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).
* Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
* [@notrueblood](https://github.com/notrueblood)[<sup>[1]</sup>](https://github.com/mldangelo/personal-site/pull/218) and [@sjhsieh](https://github.com/sjhsieh)[<sup>[2]</sup>](https://github.com/mldangelo/personal-site/issues/168) for keeping my ego in check.

## License

[MIT](https://github.com/mldangelo/personal-site/blob/main/docs/LICENSE)
