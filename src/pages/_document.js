import Document, { Html, Head, Main, NextScript } from 'next/document';
import Hamburger from '../components/Template/Hamburger';
import Header from '../components/Template/Header';
import Nav from '../components/Template/Nav';

// Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
const { GA_ID } = process.env;

/* eslint-disable react/no-danger */
class MyDocument extends Document {
  render() {
    return (
      <Html>
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
          <Hamburger />
          <NextScript />
        </body>
      </Html>
    );
  }
}
/* eslint-enable react/no-danger */

export default MyDocument;
