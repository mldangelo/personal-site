# Adapting this Website

Many people have contacted me about adapting this website. I have tried to make things as simple as possible. There are still bugs. I am sorry. If you find a bug, please email me (help@mldangelo.com), submit a pull request (I'll buy you a coffee as a thank you), or submit an issue.

You may wish to fork this repository or remove my remote origin and add your own. Go [here](https://help.github.com/articles/changing-a-remote-s-url/) for more information on how to change remotes.
Continue reading to learn how to set these variables and modify this site to make it your own.

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

    <center><img src="docs/images/gh-pages.png"></center>

9. Optionally, configure your domains DNS record. See [here]( https://help.github.com/articles/using-a-custom-domain-with-github-pages/) for more information.

TODO turn off linter 


If you would like to deploy manually, you can:

1. Change `NODE_ENV` to `production` in `.env`
2. Run `npm run deploy`
