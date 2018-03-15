export default (req, res) => {
  if (req.user) req.logout();
  res.clearCookie('admin', { path: '/' });
  res.clearCookie('id', { path: '/' });

  res.redirect('/');
};
