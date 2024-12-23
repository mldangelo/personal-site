import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from './components/ThemeProvider';
import Main from './layouts/Main';
import './styles/theme.css';

// Lazy load pages
const Index = React.lazy(() => import('./pages/Index'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Stats = React.lazy(() => import('./pages/Stats'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Resume = React.lazy(() => import('./pages/Resume'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Main>
          <Suspense fallback={<div className="loading-fallback" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Main>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
