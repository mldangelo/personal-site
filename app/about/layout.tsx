import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about Michael D'Angelo",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
