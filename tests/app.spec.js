const { test, expect } = require('@playwright/test');

test.describe('App navigation', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should render the app', async () => {
    await expect(page).toBeVisible('body');
  });

  test('should render the title', async () => {
    expect(await page.title()).toBe("Michael D'Angelo");
  });

  test('can navigate to /about', async () => {
    await page.click('#header > nav > ul > li:nth-child(1) > a');
    expect(await page.title()).toContain('About |');
    expect(page.url()).toContain('/about');
    // Further assertions based on network calls or other interactions
  });

  test('can navigate to /resume', async () => {
    await page.click('#header > nav > ul > li:nth-child(2) > a');
    expect(await page.title()).toContain('Resume |');
    expect(page.url()).toContain('/resume');
  });

  test('can navigate to /projects', async () => {
    await page.click('#header > nav > ul > li:nth-child(3) > a');
    expect(await page.title()).toContain('Projects |');
    expect(page.url()).toContain('/projects');
  });

  test('can navigate to /stats', async () => {
    await page.click('#header > nav > ul > li:nth-child(4) > a');
    expect(await page.title()).toContain('Stats |');
    expect(page.url()).toContain('/stats');
    // Further assertions based on network calls or other interactions
  });

  test('can navigate to /contact', async () => {
    await page.click('#header > nav > ul > li:nth-child(5) > a');
    expect(await page.title()).toContain('Contact |');
    expect(page.url()).toContain('/contact');
  });
});
