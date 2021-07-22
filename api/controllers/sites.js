const { site } = require('../sequelize').models;

module.exports.getSites = async (req, res, next) => {
  const sites = await site.findAll({
    attributes: ['name', 'dbkey', 'type', 'longitude', 'latitude'],
    raw: true
  });

  sites.forEach((site) => {
    if (site.dbkey == null) delete site.dbkey;
  });

  res.json(sites);
};
