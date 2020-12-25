# Personal Website

## [mldangelo.github.io/personal-site](https://mldangelo.github.io/personal-site/) and express-powered [mldangelo.com](http://mldangelo.com)

My personal website. A simple, easily modifiable, statically-exportable [React](https://reactjs.org/) application that deploys automatically for free using [github pages](https://pages.github.com/). Built using modern javascript, based on [create-react-app](https://github.com/facebook/create-react-app) with React-Router, SCSS, [github actions](https://github.com/features/actions), and many other useful libraries.

The `main` branch of this repository contains a statically-exportable simplified version of my website intended for serverless hosting on github pages. To view the source for the version hosted at [mldangelo.com](https://mldangelo.com), checkout the [server](https://github.com/mldangelo/personal-site/tree/server) branch.

## A note on adapting this repository to your own personal website

Many people have contacted me about adapting this website. I have tried to make things as simple as possible. There are still bugs. I am sorry. If you find a bug, please email me (help@mldangelo.com), submit a pull request (I'll buy you a coffee as a thank you), or submit an issue.

## Dependencies

Tested with:

* node >= v12, v14. [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended for managing node versions.

## Set up

You may wish to fork this repository or remove my remote origin and add your own. Go [here](https://help.github.com/articles/changing-a-remote-s-url/) for more information on how to change remotes.

1. To download the repository and install dependencies, run the following commands:

    ```bash
    git clone git://github.com/mldangelo/personal-site.git
    cd personal-site
    nvm install # this is optional - make sure you're running >= node 12 with `node --version`
    npm install
    ```

2. Run the following command to build the react application and serve it with hot module reloading:

    ```bash
    npm start
    ```

    Your web browser should automatically open to `<ip>:<port>:<path>` default: [http://localhost:3000/personal-site](http://localhost:3000/personal-site). Continue reading to learn how to set these variables.

This completes set up instructions. Please continue reading to learn how to modify this site to make it your own.

## Checklist

1. Create a `.env` file. To do this, run:

    ```bash
    cp sample.env .env
    ```

    and set values as appropriate. Most people will not need to modify this file.

2. Start by changing text in the sidebar. This file is located at `src/components/Template/Nav.js`.
3. Add an image of yourself in `public/images/me_icon.jpg`. If you decide to change the filename, be sure to go back to the sidebar and change the image path there as well.
4. Modify the text in `src/pages/Index.js`
5. Modify the files in `src/data/resume/` next. When you're finished, go back and modify all of the other files in the `src/data/` directory.
6. You've finished modifying >95% of the pages. Search through the rest of the files for references to `Michael` or `Angelo` and change values to your name.
7. Change the description in `public/index.html`. You may also wish to add a new favicon or remove it. [This](https://realfavicongenerator.net/) website may be helpful.
8. Change `homepage` in `package.json` to reflect where you plan to host the site. This is important for static exporting via react-snap. If you plan to use a custom url, create `public/CNAME` and enter your URL. You can run:

    ```bash
    echo "YOUR_URL[.com]" > public/CNAME
    ```

    as a shortcut.

    I recommend purchasing your own domain name from [Google Domains](https://domains.google). If you would like to host on github pages, run `npm run deploy`. This will generate a new branch called `gh-pages`. Then go to `https://github.com/[your github username]/[your repository name]/settings` and configure accordingly:

    <center><img src="docs/gh-pages.png"></center>

9. Optionally, configure your domains DNS record. See [here]( https://help.github.com/articles/using-a-custom-domain-with-github-pages/) for more information.

## Deploying to Github Pages

Modify the environmental variables and git remote url in [.github/workflows/github-pages.yml](.github/workflows/github-pages.yml)

Make a commit and push your changes to main. That's it.

If you would like to deploy manually, you can:

1. Change `NODE_ENV` to `production` in `.env`
2. Run `npm run deploy`

Please feel free to reach out to me by filing an issue or at [help@mldangelo.com](mailto:help@mldangelo.com) for help configuring your project.

## Contributors

* [@mldangelo](https://github.com/mldangelo)
* [@typpo](https://github.com/typpo)
* [@notrueblood](https://github.com/notrueblood)

## Acknowledgements

* Special thanks to [@typpo](https://github.com/typpo) for tirelessly answering all of my node.js and react questions.
* Template based on [Future Imperfect](https://html5up.net/future-imperfect) by [@ajlkn](https://github.com/ajlkn) for [HTML5 UP](html5up.net).

## License

[MIT](https://github.com/mldangelo/personal-site/blob/main/LICENSE)
