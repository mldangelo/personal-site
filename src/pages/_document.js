import Document, { Html, Head, Main, NextScript } from 'next/document';
import Header from '../components/Template/Navigation';
import Nav from '../components/Template/SideBar';

// Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
const { GA_ID } = process.env;
// TODO https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
/* eslint-disable react/no-danger */
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {GA_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });`,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <div id="wrapper">
            <Header />
            <div id="main">
              <Main />
            </div>
            <Nav />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}
/* eslint-enable react/no-danger */

export default MyDocument;
