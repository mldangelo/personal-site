import { chromium } from 'playwright';

describe('App rendering and navigation', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Start the browser
    browser = await chromium.launch();
  });

  afterAll(async () => {
    // Close the browser
    await browser.close();
  });

  beforeEach(async () => {
    // Start a new page
    page = await browser.newPage();

    // Navigate to your app
    await page.goto('http://localhost:3000'); // Adjust this URL to your app's URL
  });

  afterEach(async () => {
    await page.close();
  });

  it('should render the app', async () => {
    const isVisible = await page.isVisible('body');
    expect(isVisible).toBeTruthy();
  });

  it('should render the title', async () => {
    const title = await page.title();
    expect(title).toBe("Michael D'Angelo");
  });

  const testNavigation = async (linkIndex, expectedTitle, expectedPath) => {
    const linkSelector = `#header > nav > ul > li:nth-child(${linkIndex}) > a`;
    await page.click(linkSelector);
    await page.waitForSelector('header > div > h2 > a');
    expect(await page.title()).toContain(expectedTitle);
    expect(page.url()).toBe(`http://localhost:3000${expectedPath}`);
  };

  it('can navigate to /about', async () => {
    await testNavigation(1, 'About |', '/about');
  });

  it('can navigate to /resume', async () => {
    await testNavigation(2, 'Resume |', '/resume');
  });

  it('can navigate to /projects', async () => {
    await testNavigation(3, 'Projects |', '/projects');
  });

  it('can navigate to /stats', async () => {
    await testNavigation(4, 'Stats |', '/stats');
  });

  it('can navigate to /contact', async () => {
    await testNavigation(5, 'Contact |', '/contact');
  });
});
