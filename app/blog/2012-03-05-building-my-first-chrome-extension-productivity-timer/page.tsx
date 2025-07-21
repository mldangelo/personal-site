import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building My First Chrome Extension: Productivity Timer',
  description: 'Created a Pomodoro timer Chrome extension. JavaScript in the browser toolbar - the future of productivity tools.',
  keywords: ['chrome-extension', 'javascript', 'productivity', 'pomodoro'],
  openGraph: {
    title: 'Building My First Chrome Extension: Productivity Timer',
    description: 'Created a Pomodoro timer Chrome extension. JavaScript in the browser toolbar - the future of productivity tools.',
    type: 'article',
    publishedTime: '2012-03-05',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-03-05',
  title: 'Building My First Chrome Extension: Productivity Timer',
  content: `Tired of switching to timer apps, I built a Pomodoro timer that lives in Chrome. My first browser extension is live!

## The Manifest

Chrome extensions start with manifest.json:

\`\`\`json
{
  "manifest_version": 2,
  "name": "Focus Timer",
  "version": "1.0",
  "description": "Pomodoro timer in your browser",
  "browser_action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "permissions": ["notifications", "storage"]
}
\`\`\`

## The Popup UI

Simple timer interface:

\`\`\`html
<!-- popup.html -->
<div class="timer">
  <div id="display">25:00</div>
  <button id="start">Start Focus</button>
  <button id="reset">Reset</button>
</div>
\`\`\`

## Background Script Magic

Timer runs even when popup closes:

\`\`\`javascript
// background.js
let timeLeft = 25 * 60;
let timerInterval;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    timerInterval = setInterval(() => {
      timeLeft--;
      
      if (timeLeft === 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Focus session complete!',
          message: 'Time for a break!'
        });
        clearInterval(timerInterval);
      }
      
      // Update badge
      const minutes = Math.floor(timeLeft / 60);
      chrome.browserAction.setBadgeText({text: minutes.toString()});
    }, 1000);
  }
});
\`\`\`

## Chrome APIs Explored

Powerful browser integration:
- **Storage API**: Save user preferences
- **Notifications API**: System notifications
- **Tabs API**: Track time per site
- **Badge API**: Show timer on icon

## Adding Analytics

Track focus sessions:

\`\`\`javascript
// Track completed pomodoros
chrome.storage.local.get(['stats'], (result) => {
  const stats = result.stats || {
    totalSessions: 0,
    totalMinutes: 0,
    dailySessions: {}
  };
  
  stats.totalSessions++;
  stats.totalMinutes += 25;
  
  const today = new Date().toDateString();
  stats.dailySessions[today] = (stats.dailySessions[today] || 0) + 1;
  
  chrome.storage.local.set({stats});
});
\`\`\`

## Publishing to Chrome Web Store

The release process:
1. Create developer account ($5)
2. Upload ZIP file
3. Add screenshots and description
4. Submit for review
5. Published in 30 minutes!

## User Response

After one week:
- 150 installs
- 4.5 star rating
- Feature requests pouring in
- Someone forked it on GitHub!

## Lessons Learned

Browser extensions are powerful:
- Direct user integration
- Always accessible
- Rich API access
- Easy distribution

Next: Building a research paper organizer extension!`,
  tags: ['chrome-extension', 'javascript', 'productivity', 'pomodoro'],
  readTime: '14 min',
};

export default function BuildingMyFirstChromeExtensionProductivityTimerPage() {
  return <BlogPost post={post} />;
}
