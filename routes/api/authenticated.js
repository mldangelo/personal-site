export default (req, res) => {
  const state = req.user ? true : false;
  res.json({
    authenticated: state,
  });
};
