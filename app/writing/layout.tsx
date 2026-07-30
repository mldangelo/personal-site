import { newsreaderItalic } from '../fonts';

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={newsreaderItalic.variable}>{children}</div>;
}
