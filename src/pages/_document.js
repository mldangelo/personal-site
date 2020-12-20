import Document, { Html, Head, Main, NextScript } from 'next/document';
// Adapted from https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_document.js

const { GA_ID } = process.env;
// import './static/css/main.scss';

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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
/* eslint-enable react/no-danger */

export default MyDocument;