const { Sequelize } = require('sequelize');

const { applyExtraSetup } = require('./extra-setup');
const logger = require('../utils/logger');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined.');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: logger.log
});

const modelDefiners = [
  require('./models/site').define,
  require('./models/salinity-record').define
];

modelDefiners.forEach((modelDefiner) => modelDefiner(sequelize));

applyExtraSetup(sequelize);

module.exports = sequelize;
