export default (sequelize, { STRING, BOOLEAN, INTEGER }) => sequelize.define('user', {
  sub: {
    type: STRING,
  },
  name: {
    type: STRING,
  },
  given_name: {
    type: STRING,
  },
  family_name: {
    type: STRING,
  },
  profile: {
    type: STRING,
  },
  picture: {
    type: STRING,
  },
  email: {
    type: STRING,
  },
  email_verified: {
    type: BOOLEAN,
  },
  gender: {
    type: STRING,
  },
  logins: {
    type: INTEGER,
  },
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
});
