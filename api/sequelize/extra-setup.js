exports.applyExtraSetup = (sequelize) => {
  const { site, salinityRecord } = sequelize.models;

  site.hasMany(salinityRecord, { foreignKey: 'siteId'});
  salinityRecord.belongsTo(site, { foreignKey: 'siteId'})
};
