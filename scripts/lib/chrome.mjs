/**
 * Headless Chrome for post-build checks, driven over the DevTools protocol
 * with no dependency: Chrome reads commands from its fourth file descriptor
 * and answers on its fifth (`--remote-debugging-pipe`), so there is no port to
 * pick and no WebSocket to open.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';

/** `CHROME_PATH`, or Chrome or Chromium where the platform installs it. */
export function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const onPath = (names) =>
    (process.env.PATH ?? '')
      .split(delimiter)
      .filter(Boolean)
      .flatMap((directory) => names.map((name) => join(directory, name)));
  const candidates = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: onPath([
      'google-chrome',
      'google-chrome-stable',
      'chromium',
      'chromium-browser',
    ]),
    win32: [
      process.env.PROGRAMFILES,
      process.env['PROGRAMFILES(X86)'],
      process.env.LOCALAPPDATA,
    ]
      .filter(Boolean)
      .map((directory) =>
        join(directory, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      ),
  }[process.platform];

  return candidates?.find((path) => existsSync(path));
}

/**
 * Starts Chrome and opens one page. `page(method, params)` sends a command to
 * that page, `next(event)` resolves with the page's next such event, and
 * `close()` resolves once Chrome has exited and its profile is gone.
 */
export async function openPage(executable) {
  const profile = mkdtempSync(join(tmpdir(), 'chrome-check-'));
  const args = [
    '--headless=new',
    '--remote-debugging-pipe',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
  ];
  // The sandbox needs unprivileged user namespaces, which Ubuntu's AppArmor
  // withholds on CI runners. The pages are the site's own export.
  if (process.platform === 'linux') args.push('--no-sandbox');

  const chrome = spawn(executable, args, {
    stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'],
  });
  const [, , stderr, commands, replies] = chrome.stdio;

  let lastError = '';
  stderr.setEncoding('utf8');
  stderr.on('data', (chunk) => {
    lastError = `${lastError}${chunk}`.slice(-2000);
  });

  const pending = new Map();
  const waiting = new Set();
  let nextId = 0;
  let buffered = '';

  const failAll = (error) => {
    for (const { reject } of pending.values()) reject(error);
    pending.clear();
  };
  chrome.on('error', failAll);
  chrome.on('exit', (code) => {
    failAll(new Error(`Chrome exited (${code}): ${lastError.trim()}`));
  });

  replies.setEncoding('utf8');
  replies.on('data', (chunk) => {
    buffered += chunk;
    for (let end = buffered.indexOf('\0'); end !== -1; ) {
      const message = JSON.parse(buffered.slice(0, end));
      buffered = buffered.slice(end + 1);
      end = buffered.indexOf('\0');

      const call = pending.get(message.id);
      if (call) {
        pending.delete(message.id);
        if (message.error) {
          call.reject(new Error(`${call.method}: ${message.error.message}`));
        } else {
          call.resolve(message.result);
        }
      } else {
        for (const waiter of waiting) waiter(message);
      }
    }
  });

  const send = (method, params, sessionId) =>
    new Promise((resolve, reject) => {
      nextId += 1;
      pending.set(nextId, { resolve, reject, method });
      commands.write(
        `${JSON.stringify({ id: nextId, method, params, sessionId })}\0`,
      );
    });

  const exited = new Promise((resolve) => chrome.once('exit', resolve));
  /** Waits for Chrome to exit, since it writes to its profile until then. */
  const close = async () => {
    chrome.kill();
    await exited;
    rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
  };

  try {
    const { targetId } = await send('Target.createTarget', {
      url: 'about:blank',
    });
    const { sessionId } = await send('Target.attachToTarget', {
      targetId,
      flatten: true,
    });

    const page = (method, params = {}) => send(method, params, sessionId);
    const next = (event) =>
      new Promise((resolve) => {
        const waiter = (message) => {
          if (message.sessionId === sessionId && message.method === event) {
            waiting.delete(waiter);
            resolve(message.params);
          }
        };
        waiting.add(waiter);
      });

    return { page, next, close };
  } catch (error) {
    await close();
    throw error;
  }
}
