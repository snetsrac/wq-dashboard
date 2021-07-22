const { site } = require('../sequelize').models;

module.exports.getSites = async (req, res, next) => {
  const sites = await site.findAll({
    attributes: ['name', 'dbkey', 'type', 'longitude', 'latitude']
  });

  res.json(sites);
};
