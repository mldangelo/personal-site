import User from '../../models/User';

export default (req, res) => {
  User.find().select('name email logins').then((users) => {
    const processed = users.map(user => ({
      email: user.email,
      name: user.name,
        // NOTE: In the future, we can assume user.logins is always sorted
      lastOnline: new Date(user.logins.reduce((a, b) => Math.max(a, b), user.logins[0])),
      createdAt: new Date(user.logins.reduce((a, b) => Math.min(a, b), user.logins[0])),
      visits: user.logins.length,
    }));
    res.json({
      users: processed,
      success: true,
    });
  }).catch((error) => {
    res.json({
      error,
      success: false,
    });
  });
};
