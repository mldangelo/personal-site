import User from '../models/User';

/* Updates database with a default user with admin privledges
 * if no users are present.
 */

const defaultUser = {
  email: 'michael.l.dangelo@gmail.com',
  given_name: 'Michael',
  family_name: 'DAngelo',
  isAdmin: true,
  logins: [],
};

const populate = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    console.info(`Creating default user with email ${defaultUser.email}.`);
    await User.create(defaultUser);
  }
};

export default populate;
