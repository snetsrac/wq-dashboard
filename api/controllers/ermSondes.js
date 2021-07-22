const createError = require('http-errors');
const { Op } = require('sequelize');

const { site, salinityRecord } = require('../sequelize').models;

module.exports.getErmSonde = async (req, res, next) => {
  const { params, query } = req;

  const queriedSite = await site.findOne({ where: { dbkey: params.name }, attributes: ['id'] });

  if (!queriedSite) throw createError(404, `Could not find a site named ${params.name}`);

  const salinityRecords = await salinityRecord.findAll({
    where: {
      siteId: queriedSite.id,
      date: {
        [Op.gte]: query.from,
        [Op.lte]: query.to
      }
    }
  });

  res.json(salinityRecords);
};
