import './styles/main.scss';

export const metadata = {
  title: "Michael D'Angelo",
  description: "Michael D'Angelo's personal website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700|Raleway:400,800,900" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}