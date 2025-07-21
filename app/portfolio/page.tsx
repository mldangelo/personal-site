import React from 'react';

import type { Metadata } from 'next';

import { investments, investmentThesis } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: "Michael D'Angelo's angel investments in developer tools and AI infrastructure.",
};

export default function PortfolioPage() {
  const categories = [...new Set(investments.map((inv) => inv.category))].sort();

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Investment Portfolio</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          Angel investing in technical founders building developer tools and infrastructure.
        </p>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{investmentThesis.metrics.totalInvestments}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Investments</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{investmentThesis.metrics.unicorns}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unicorns</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{investmentThesis.portfolio.irr}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio IRR</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{investmentThesis.portfolio.totalValue}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</p>
          </div>
        </div>

        {/* Investment Thesis */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Investment Thesis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">What I Look For</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {investmentThesis.focus.map((thesis) => (
                  <li key={thesis}>{thesis}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Sweet Spot</h3>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <p><strong>Stage:</strong> {investmentThesis.sweetSpot.stage}</p>
                  <p><strong>Check Size:</strong> {investmentThesis.sweetSpot.checkSize}</p>
                  <p><strong>Sectors:</strong> {investmentThesis.sweetSpot.sectors.join(', ')}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Track Record</h3>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <p><strong>Exits:</strong> {investmentThesis.metrics.exits}</p>
                  <p><strong>Active:</strong> {investmentThesis.metrics.activePortfolio}</p>
                  <p><strong>Top Performers:</strong> {investmentThesis.portfolio.topPerformers}x+ returns</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Investments */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Selected Investments</h2>
          <div className="space-y-4">
            {investments.map((investment) => (
              <article
                key={investment.company}
                className="border-l-2 border-gray-200 dark:border-gray-800 pl-4 py-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {investment.link ? (
                        <a
                          href={investment.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {investment.company} →
                        </a>
                      ) : (
                        investment.company
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {investment.description}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-500 ml-4">
                    {investment.year}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                    {investment.category}
                  </span>
                  {investment.valuation && (
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                      {investment.valuation}
                    </span>
                  )}
                  <span className={`text-xs ${
                    investment.status === 'active' 
                      ? 'text-green-600 dark:text-green-400' 
                      : investment.status === 'acquired'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {investment.status}
                  </span>
                  {investment.role && (
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      • {investment.role}
                    </span>
                  )}
                </div>
                {investment.notable && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">
                    {investment.notable}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 p-8 glass rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Founders</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            I invest in technical founders at the earliest stages. If you're building developer tools or AI infrastructure, I'd love to help.
          </p>
          <a
            href="mailto:michael@mldangelo.com?subject=Investment Opportunity"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </main>
  );
}