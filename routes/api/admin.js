import User from '../../models/User';

export default (req, res) => {
  User.find().select('given_name family_name email createdAt').then((users) => {
    res.json({
      users,
      success: true,
    });
  }).catch((error) => {
    res.json({
      error,
      success: false,
    });
  });
};
