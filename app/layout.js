import Head from 'next/head';
// import Analytics from '../components/Template/Analytics';
import { Inter } from 'next/font/google';
import Navigation from '../components/Template/Navigation';
import SideBar from '../components/Template/SideBar';
import ScrollToTop from '../components/Template/ScrollToTop';
import '../css/main.scss'; // Adjust the path as necessary

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Michael D'Angelo",
  description: "Michael D'Angelo's personal website. New York based Stanford ICME graduate, VP of Engineering at Smile Identity, co-founder of Arthena and Matroid, and YC Alumni.",
};

export default function RootLayout({
  children, title = metadata.title, description = metadata.description, fullPage = false,
}) {
  return (
    <>
      <Head>
        <title>{title} | Michael D'Angelo</title>
        <meta name="description" content={description} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <html lang="en" className={inter.className} />
      </Head>
      {/* <Analytics /> */}
      <ScrollToTop />
      <div id="wrapper">
        <Navigation />
        <div id="main">
          {children}
        </div>
        {!fullPage && <SideBar />}
      </div>
    </>
  );
}
