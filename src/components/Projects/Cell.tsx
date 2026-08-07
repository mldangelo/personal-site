import dayjs from 'dayjs';
import type React from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import type { IProject } from '../../data/projects';
import useCellStore from '../../store/cell-store';

const PdfViewer = lazy(() => import('./PdfViewer'));

export interface ICell {
  data: IProject;
  id: string;
}

const Cell: React.FC<ICell> = ({ data, id }) => {
  const cells = useCellStore((s) => s.cells);
  const setIsOpen = useCellStore((s) => s.setIsOpen);
  const [mounted, setMounted] = useState(false);

  // The store is persisted with skipHydration, so only trust it after mount.
  useEffect(() => setMounted(true), []);

  const isOpen = mounted && (cells[id]?.isOpen ?? false);
  const kind = data.youtube ? 'talk' : data.pdf ? 'paper' : 'project';

  return (
    <article className="overflow-hidden rounded-xl border border-border transition-colors hover:border-accent/60">
      <details
        open={isOpen}
        onToggle={(e) => setIsOpen(id, e.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">
              {kind}
            </p>
            <h3 className="mt-1.5 font-medium">{data.title}</h3>
            {data.subtitle && (
              <p className="mt-1 text-sm text-muted">{data.subtitle}</p>
            )}
            {data.date && (
              <time className="mt-2 block font-mono text-xs text-muted">
                {dayjs(data.date).format('MMMM YYYY')}
              </time>
            )}
          </div>
          <span
            aria-hidden="true"
            className={`mt-1 shrink-0 font-mono text-muted transition-transform ${
              isOpen ? 'rotate-90' : ''
            }`}
          >
            ›
          </span>
        </summary>

        <div className="border-t border-border p-5">
          {data.desc && (
            <p className="mb-4 text-sm leading-relaxed text-muted">
              {data.desc}
            </p>
          )}

          {/* Heavy embeds are only mounted once the card is actually opened. */}
          {isOpen && data.youtube && (
            <LiteYouTubeEmbed id={data.youtube} title={data.title} />
          )}

          {isOpen && data.pdf && (
            <Suspense
              fallback={<p className="text-sm text-muted">Loading PDF…</p>}
            >
              <div className="h-[70vh] overflow-hidden rounded-lg border border-border">
                <PdfViewer data={{ path: data.pdf }} title={data.title} />
              </div>
            </Suspense>
          )}

          {data.link && (
            <a
              href={data.link}
              className="mt-4 inline-block font-mono text-sm text-accent hover:underline"
            >
              Visit project →
            </a>
          )}
        </div>
      </details>
    </article>
  );
};

export default Cell;
