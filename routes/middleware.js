const requireUser = (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

const requireUserAPI = (req, res, next) => {
  if (!req.user) {
    res.json({
      success: false,
      error: 'Insufficient access privileges. Please authenticate your session.',
    });
  } else {
    next();
  }
};


export { requireUser, requireUserAPI };
