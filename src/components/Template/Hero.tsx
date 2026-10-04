'use client';

import Link from 'next/link';
import { useRef } from 'react';

import CharacterAvatar from './CharacterAvatar';
import OnlineStatus from './OnlineStatus';
import ThemePortrait from './ThemePortrait';

export default function Hero() {
  const panelRef = useRef<HTMLDivElement>(null);

  function handleDragStart(event: React.MouseEvent) {
    const panel: HTMLDivElement | null = panelRef.current;
    if (!panel) return;
    const target: HTMLDivElement = panel;
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const computed = window.getComputedStyle(target).transform;
    const matrix =
      computed && computed !== 'none' ? new DOMMatrixReadOnly(computed) : null;
    const offsetX = matrix ? matrix.m41 : 0;
    const offsetY = matrix ? matrix.m42 : 0;

    function handleMove(ev: MouseEvent) {
      const dx = ev.clientX - startX + offsetX;
      const dy = ev.clientY - startY + offsetY;
      target.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    function handleUp() {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    }

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }

  function handleResizeStart(event: React.MouseEvent) {
    const panel: HTMLDivElement | null = panelRef.current;
    if (!panel) return;
    const target: HTMLDivElement = panel;
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = target.offsetWidth;
    const startHeight = target.offsetHeight;

    function handleMove(ev: MouseEvent) {
      const newWidth = Math.max(480, startWidth + (ev.clientX - startX));
      const newHeight = Math.max(600, startHeight + (ev.clientY - startY));
      target.style.width = `${newWidth}px`;
      target.style.height = `${newHeight}px`;
    }

    function handleUp() {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    }

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }

  return (
    <section className="hero">
      <div ref={panelRef} className="win-panel win-panel--glass hero-panel">
        <svg
          className="hero-plant"
          viewBox="0 0 32 40"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {/* Pixel-art pothos in a terracotta pot — chunky 16-bit style */}
          {/* Dark green leaves (back layer) */}
          <g fill="#2c6e3a">
            <rect x="4" y="14" width="2" height="2" />
            <rect x="6" y="12" width="2" height="2" />
            <rect x="8" y="10" width="2" height="2" />
            <rect x="6" y="14" width="2" height="2" />
            <rect x="24" y="12" width="2" height="2" />
            <rect x="26" y="14" width="2" height="2" />
            <rect x="22" y="14" width="2" height="2" />
          </g>
          {/* Mid green leaves */}
          <g fill="#41a256">
            <rect x="10" y="8" width="2" height="2" />
            <rect x="8" y="12" width="2" height="2" />
            <rect x="10" y="14" width="2" height="2" />
            <rect x="12" y="12" width="2" height="2" />
            <rect x="20" y="8" width="2" height="2" />
            <rect x="22" y="12" width="2" height="2" />
            <rect x="20" y="14" width="2" height="2" />
            <rect x="18" y="12" width="2" height="2" />
            <rect x="14" y="6" width="2" height="2" />
            <rect x="16" y="6" width="2" height="2" />
            <rect x="14" y="14" width="2" height="2" />
            <rect x="16" y="14" width="2" height="2" />
          </g>
          {/* Bright leaves */}
          <g fill="#6dd17e">
            <rect x="12" y="8" width="2" height="2" />
            <rect x="14" y="10" width="2" height="2" />
            <rect x="16" y="10" width="2" height="2" />
            <rect x="18" y="8" width="2" height="2" />
            <rect x="12" y="4" width="2" height="2" />
            <rect x="18" y="4" width="2" height="2" />
            <rect x="14" y="2" width="2" height="2" />
            <rect x="16" y="2" width="2" height="2" />
          </g>
          {/* Variegation highlights */}
          <g fill="#cbe8ad">
            <rect x="14" y="8" width="2" height="2" />
            <rect x="16" y="8" width="2" height="2" />
            <rect x="10" y="12" width="2" height="2" />
            <rect x="20" y="12" width="2" height="2" />
          </g>
          {/* Soil */}
          <rect x="6" y="22" width="20" height="2" fill="#3a2010" />
          {/* Pot rim (top) */}
          <rect x="4" y="24" width="24" height="2" fill="#8e4828" />
          <rect x="4" y="22" width="24" height="2" fill="#9c5132" />
          {/* Pot body */}
          <rect x="6" y="26" width="20" height="12" fill="#c97553" />
          {/* Pot shadow */}
          <rect x="6" y="36" width="20" height="2" fill="#a85c3f" />
          {/* Pot highlights */}
          <rect x="8" y="28" width="2" height="6" fill="#dc8a6a" />
          {/* Pot bottom edge */}
          <rect x="8" y="38" width="16" height="2" fill="#7c3f25" />
        </svg>
        <div className="win-panel-titlebar" onMouseDown={handleDragStart}>
          WELCOME.HTML
        </div>
        <div className="win-panel-body">
          <div className="hero-content">
            <div className="hero-avatar">
              <ThemePortrait width={260} height={260} priority />
            </div>

            <h1 className="hero-title">
              <span className="hero-name">
                Hang <CharacterAvatar /> Hang
              </span>
            </h1>

            <p className="hero-tagline">
              Welcome to my corner of the internet.
              <br />
              Think of this as my scrapbook — projects, experiments, half-formed
              thoughts (maybe?).
            </p>

            <div className="hero-chips">
              <span className="hero-chip">Open to Summer 2026 Internships</span>
              <span className="hero-chip">Khoury · CS + Business</span>
              <span className="hero-chip">Boston, MA</span>
            </div>

            <div className="hero-status">
              <OnlineStatus />
            </div>

            <div className="retro-marquee" aria-hidden="true">
              <div className="retro-marquee-track">
                <span>last updated: april 28 2026</span>
                <span>·</span>
                <span>★ thanks for stopping by ★</span>
              </div>
            </div>

            <div className="hero-cta">
              <Link href="/#about" className="button button-primary">
                About Me
              </Link>
              <Link href="/#resume" className="button button-secondary">
                View Resume
              </Link>
            </div>
          </div>
        </div>
        <div
          className="hero-resize"
          onMouseDown={handleResizeStart}
          aria-hidden="true"
        />
      </div>

      <p className="hero-hint" aria-hidden="true">
        ✦ drag the title bar to move • grab the bottom-right corner to resize ✦
      </p>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
}
