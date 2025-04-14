import './styles/main.scss';

export const metadata = {
  title: "Michael D'Angelo",
  description: "Michael D'Angelo's personal website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}