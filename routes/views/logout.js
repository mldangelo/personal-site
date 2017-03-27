export default (req, res) => {
  if (req.user) req.logout();
  res.redirect('/');
};
