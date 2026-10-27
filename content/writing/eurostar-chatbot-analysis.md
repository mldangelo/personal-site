---
title: AI News Intelligence Agent -- n8n + Google Gemini
date: '2026-01-03'
description: 'An automated AI-powered news intelligence workflow built with **n8n** and **Google Gemini**.'
image: /images/writing/api-costs-july-2025.png
imageAlt: 'Anthropic API costs for July 2025 showing $9,986.20 in token usage'
---

## Context
An automated AI-powered news intelligence workflow built with **n8n**
and **Google Gemini**.

The workflow automatically collects AI and technology news from RSS
feeds, retrieves upcoming AI/technology events, combines the
information, uses Gemini to generate a structured intelligence report,
and delivers the final report through Gmail.

## ✨ Features

-   ⏰ Automated scheduled execution using n8n
-   📰 AI and technology news collection through RSS feeds
-   📡 Multiple news sources
-   📅 Upcoming AI & technology event discovery using SerpAPI / Google
    Events
-   🔀 Multi-source data merging
-   📦 Data aggregation before AI processing
-   🧠 Google Gemini-powered summarization and intelligence generation
-   📧 Automated Gmail delivery
-   🔐 Credentials kept outside the exported workflow
-   ⚙️ Easy customization of feeds, schedule, event query, Gemini model,
    and report format

## 🧠 What the Agent Does

Instead of manually checking multiple AI news websites and event
listings every day, the workflow creates an automated pipeline:

``` text
News Sources + Events
        │
        ▼
   n8n collects data
        │
        ▼
    Data Merging
        │
        ▼
   Data Aggregation
        │
        ▼
   Google Gemini
        │
        ▼
Intelligence Report
        │
        ▼
      Gmail
```

The result is a single, structured daily briefing containing important
AI developments, technology updates, and upcoming events.

## 🏗️ Workflow Architecture

``` text
                         ┌──────────────────┐
                         │ Schedule Trigger │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
        ┌────────────────┐ ┌───────────────┐ ┌──────────────┐
        │   NormalTech   │ │  AIBusiness   │ │ Fetch Events │
        │    RSS Feed    │ │    RSS Feed   │ │   SerpAPI    │
        └───────┬────────┘ └───────┬───────┘ └──────┬───────┘
                │                  │                │
                └──────────────────┼────────────────┘
                                   ▼
                         ┌─────────────────┐
                         │   Data Merger   │
                         └────────┬────────┘
                                  ▼
                         ┌─────────────────┐
                         │ Data Aggregator │
                         └────────┬────────┘
                                  ▼
                     ┌────────────────────────┐
                     │ AI Summarization Model │
                     │     Google Gemini      │
                     └────────────┬───────────┘
                                  ▼
                         ┌─────────────────┐
                         │   Email Sender  │
                         │      Gmail      │
                         └─────────────────┘
```

## 🛠️ Tech Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  **n8n**                             Workflow orchestration and
                                      automation

  **Google Gemini**                   AI analysis, summarization, and
                                      report generation

  **RSS Feeds**                       AI and technology news ingestion

  **SerpAPI / Google Events**         Upcoming AI & technology event
                                      discovery

  **Gmail**                           Automated report delivery
  -----------------------------------------------------------------------

## 📰 News Sources

The current workflow reads news from:

``` text
https://www.normaltech.ai/feed
https://aibusiness.com/rss.xml
```

These sources are merged with the event data before being sent to
Gemini.

## 📅 Event Intelligence

The workflow uses the SerpAPI Google Events engine to search for
upcoming AI and technology events.

Current search configuration:

``` text
engine = google_events
q      = AI Tech Events in india
hl     = en
gl     = us
```

The query can be customized for a specific country, city, technology, or
topic.

## 🧠 Gemini Intelligence Layer

The workflow uses:

``` text
models/gemini-2.0-flash
```

Gemini acts as the intelligence and summarization layer.

It receives the aggregated news and event information and generates a
structured daily report.

### Report Sections

The generated report contains:

### AI NEWS HIGHLIGHTS

The **5 most important AI developments**.

### TECHNOLOGY UPDATES

Important recent technology developments.

### UPCOMING AI EVENTS

Upcoming events including:

-   Event name
-   Date
-   Location
-   Description

If no events are available, the workflow instructs Gemini to report:

> No AI events scheduled this week

### News Item Format

Each news item is requested with:

-   Headline in **ALL CAPS**
-   2--3 sentence summary
-   Original article link

The report ends with:

> Your AI Intelligence Team

## 📁 Repository Structure

``` text
AI-News-Intelligence-Agent-n8n-Google-Gemini/
│
├── README.md
├── .gitignore
│
├── AI News Summarizer 2/
├── Ai News two RSS Read To Email Output/
├── Auto AI Internship Applier/
├── Automated AI-Powered Weather-Based Daily Planner/
├── Automated Historical Content Publisher/
├── Automated LinkedIn job tracker/
├── Automated Social Media Content Generation/
├── Automated Social Media Content Generation with Image/
│
└── ...
```

> The repository currently contains multiple n8n automation workflows.
> The main AI News Intelligence workflow is documented here based on the
> repository's AI News Intelligence Agent implementation.

## 🚀 Setup

### 1. Install / open n8n

Run n8n using your preferred setup.

For example, with npm:

``` bash
npm install n8n -g
```

Then:

``` bash
n8n start
```

You can also use n8n Cloud or another supported deployment method.

### 2. Import the workflow

Open your n8n instance and import the AI News Intelligence workflow
JSON.

After importing, inspect the workflow nodes and connect the required
credentials.

### 3. Configure Google Gemini

Create a Google Gemini credential in n8n and connect it to the **Google
Gemini Chat Model** node.

The current workflow uses:

``` text
models/gemini-2.0-flash
```

### 4. Configure Gmail

Connect your Gmail credential to the email-sending node.

Set the destination email address before activating the workflow.

The exported workflow should not contain private Gmail credentials.

### 5. Configure SerpAPI

The event-fetching HTTP Request uses:

``` text
https://serpapi.com/search
```

with:

``` text
engine = google_events
q      = AI Tech Events in india
hl     = en
gl     = us
api_key = YOUR_API_KEY
```

Replace:

``` text
YOUR_API_KEY
```

with your SerpAPI key inside n8n.

**Never commit your real API key to GitHub.**

### 6. Check the RSS feeds

Verify that the following feeds are reachable from your n8n environment:

``` text
https://www.normaltech.ai/feed
https://aibusiness.com/rss.xml
```

### 7. Test the workflow

Before activating the schedule, run the workflow manually.

Verify:

1.  Schedule Trigger starts the workflow branches.
2.  RSS Feed nodes return news.
3.  Fetch Events returns event data or an empty result.
4.  Data Merger combines the inputs.
5.  Data Aggregator passes the collected information forward.
6.  Gemini generates the intelligence report.
7.  Gmail sends the final report.

## 🔐 Security

This repository should contain workflow definitions and configuration
placeholders, **not private credentials**.

Never commit:

-   ❌ API keys
-   ❌ OAuth tokens
-   ❌ Gmail credentials
-   ❌ Private authentication credentials
-   ❌ Personal information that should remain private

Keep credentials inside n8n's credential manager.

For SerpAPI, use:

``` text
YOUR_API_KEY
```

as the public placeholder rather than exposing the real key.

## ⚙️ Customization

The agent can be customized without changing the overall architecture.

### News Sources

Add or replace RSS feeds according to the topics you want to monitor.

### Event Search

Change:

``` text
AI Tech Events in india
```

to queries such as:

``` text
AI conferences in India
Machine Learning events in Pune
Generative AI conferences
Technology events in Bangalore
```

### Gemini Model

The Gemini model can be changed according to your requirements and the
models available in your n8n/Gemini configuration.

### Number of News Items

Change the Gemini prompt to control how many headlines appear in the
final report.

### Report Structure

You can modify the prompt to add sections such as:

-   AI startups
-   Funding
-   Research papers
-   Product launches
-   Open-source releases
-   Cybersecurity
-   Robotics
-   Job opportunities
-   Indian AI ecosystem

### Email

Customize:

-   Email recipient
-   Email subject
-   Report formatting
-   Delivery schedule

### Schedule

Change the n8n Schedule Trigger to run:

-   Daily
-   Weekly
-   Multiple times per day
-   At a specific time

## 📊 Example Intelligence Pipeline

``` text
                    INPUT
                      │
        ┌─────────────┴─────────────┐
        │                           │
     RSS News                  AI Events
        │                           │
        └─────────────┬─────────────┘
                      ▼
                n8n Workflow
                      │
                      ▼
                 Data Merge
                      │
                      ▼
               Data Aggregation
                      │
                      ▼
                Gemini AI
                      │
          ┌───────────┴───────────┐
          │                       │
       Analyze                 Summarize
          │                       │
          └───────────┬───────────┘
                      ▼
             Structured Report
                      │
                      ▼
                    Gmail
```

## 💡 Why This Project Is Useful

The project demonstrates how multiple automation and AI concepts can be
combined into one practical system.

### AI Agent Development

Uses Gemini to transform raw information into structured intelligence.

### Workflow Automation

n8n connects multiple services without requiring a large custom backend.

### Data Aggregation

Multiple independent information sources are merged into a single
processing pipeline.

### Prompt Engineering

The Gemini prompt controls the structure, length, sections, and style of
the generated report.

### API Integration

The project demonstrates integration between:

-   RSS feeds
-   SerpAPI
-   Google Gemini
-   Gmail
-   n8n

### Automated Information Delivery

The final result is automatically delivered instead of requiring the
user to manually check multiple websites.

## 🔮 Future Improvements

Possible enhancements include:

-   [ ] Add more AI/technology RSS sources
-   [ ] Add OpenAI, Anthropic, or other LLM providers
-   [ ] Add Telegram delivery
-   [ ] Add WhatsApp delivery
-   [ ] Add Slack notifications
-   [ ] Add Google Docs export
-   [ ] Add Notion integration
-   [ ] Add personalized news categories
-   [ ] Add regional news filtering
-   [ ] Add historical news storage
-   [ ] Track recurring topics and trends
-   [ ] Add duplicate-news detection before Gemini
-   [ ] Add source credibility scoring
-   [ ] Add automatic retry/error handling
-   [ ] Add monitoring and workflow health notifications
-   [ ] Add a dashboard for historical intelligence reports

## 📸 Workflow Preview

Add the workflow screenshot to the repository and reference it here:

``` text
assets/workflow.png
```

Then use:

``` markdown
![AI News Intelligence Agent Workflow](assets/workflow.png)
```

## 📌 Use Case

A practical daily workflow looks like this:

``` text
Morning
   │
   ▼
n8n Schedule Trigger
   │
   ├──► Collect AI News
   │
   ├──► Collect Technology News
   │
   └──► Find Upcoming AI Events
             │
             ▼
        Merge Information
             │
             ▼
        Google Gemini
             │
             ▼
      Daily Intelligence
             │
             ▼
            Gmail
```

Instead of spending time checking multiple websites, the user receives a
consolidated intelligence report automatically.

## ⚠️ Disclaimer

This project is intended for educational, portfolio, and
automation-development purposes.

The generated news summaries depend on the external RSS feeds, event
search results, and AI model output. Users should open the original
sources and verify important information before relying on it for
professional or consequential decisions.

## 👨‍💻 Author

**Saransh Vaidya**

GitHub:\
https://github.com/saranshvaidya0

## 📂 Repository

https://github.com/saranshvaidya0/AI-News-Intelligence-Agent-n8n-Google-Gemini
