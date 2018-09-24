/* eslint-disable global-require */
import reactApp from './views/app';

const routes = (app) => {
  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));
  reactApp(app); // set up react routes
};

export default routes;
/* eslint-enable global-require */
