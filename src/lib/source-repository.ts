import packageJson from '../../package.json';
import { parseGitHubRepository } from './site-url.mjs';

const repository = parseGitHubRepository(packageJson.repository);
if (!repository) {
  throw new Error('package.json "repository" must name a GitHub repository');
}

/**
 * The repository this site is built from, as `owner/repo`, from `repository`
 * in `package.json`. The footer's Source link and the GitHub readings on
 * `/stats` describe it. Imported only by server components, so the parsing
 * never ships to a browser.
 */
export const SOURCE_REPOSITORY = `${repository.owner}/${repository.name}`;
