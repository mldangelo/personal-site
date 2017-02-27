module.exports = (sequelize, DataTypes) => sequelize.define('user', {
  sub: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  given_name: {
    type: DataTypes.STRING,
  },
  family_name: {
    type: DataTypes.STRING,
  },
  profile: {
    type: DataTypes.STRING,
  },
  picture: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
  },
  gender: {
    type: DataTypes.STRING,
  },
  logins: {
    type: DataTypes.INTEGER,
  },
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
});
