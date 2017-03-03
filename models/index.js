import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import 'dotenv/config';

const dbpath = path.join(__dirname, '../db');

if (!fs.existsSync(dbpath)){
  fs.mkdirSync(dbpath);
}

const sequelize = new Sequelize('db', null, null, {
  dialect: 'sqlite',
  storage: path.join(dbpath, 'site.sqlite'),
});

const db = {};

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

sequelize.sync(); // set up db 

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
