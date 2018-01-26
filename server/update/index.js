import User from '../models/User';

/* Updates database with a default user with admin privledges
 * if no users are present.
 */

const defaultUser = {
	"email" : "michael.l.dangelo@gmail.com",
  "given_name" : "Michael",
  "family_name" : "DAngelo",
  "isAdmin": true,
	"logins" : [],
}

const populate = () => {
  User.count()
    .then((count) => {
      if (count === 0) {
        console.info(`Creating default user with email ${defaultUser.email}.`)
        return User.create(defaultUser);
      }
    }).then(user => {
      if (user) {
        console.info('Default user successfully created');
      }
    }).catch(error => console.error(error));
};

export default populate;
