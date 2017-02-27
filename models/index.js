import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize('db', null, null, {
  dialect: 'sqlite',
  storage: path.join(__dirname, '../', 'db.sqlite'),
});

const db = {};

fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
