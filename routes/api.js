const routes = (app) => {
  app.get('/api/github', require('./api/github'));
  app.get('/api/lastfm', require('./api/lastfm'));
};

export default routes;
