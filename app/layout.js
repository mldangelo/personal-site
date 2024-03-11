import { Inter } from "next/font/google";
import '../css/main.scss'; // All of our styles

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Michael D'Angelo",
  description: "Michael D'Angelo's personal website. New York based Stanford ICME graduate, "
    + 'VP of Engineering at Smile Identity, co-founder of Arthena and Matroid, and YC Alumni.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
