'use client';

import React from 'react';

import Markdown from 'markdown-to-jsx';

import { textFactsMarkdown } from '@/data/facts/textfacts';

const TextFacts: React.FC = () => (
  <>
    <h3>Other facts</h3>
    <Markdown>{textFactsMarkdown}</Markdown>
  </>
);

export default TextFacts;
