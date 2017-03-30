import User from '../../models/User';

export default (req, res) => {
  User.find().select('name email logins').then((users) => {
    const processed = users.map(user => ({
      email: user.email,
      name: user.name,
        // NOTE: In the future, we can assume user.logins is always sorted
      lastOnline: new Date(Math.max(...user.logins)),
      createdAt: new Date(Math.min(...user.logins)),
      visits: user.logins.length,
    })).sort((a, b) => new Date(b.lastOnline) - new Date(a.lastOnline));
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
