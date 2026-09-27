import { interItalic } from '../fonts';

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={interItalic.variable}>{children}</div>;
}
