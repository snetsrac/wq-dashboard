const { DataTypes } = require('sequelize');

const COORDINATE_PRECISION = 8;
const COORDINATE_SCALE = 5;

exports.type = {
  SFWMD_SONDE: 'SFWMD Sonde',
  ERM_SONDE: 'ERM Sonde',
  SFWMD_GATE: 'SFWMD Gate',
  GRAB_SAMPLE: 'Grab Sample'
}

exports.define = (sequelize) => {
  sequelize.define('site', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dbkey: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(exports.type),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(COORDINATE_PRECISION, COORDINATE_SCALE),
      allowNull: false,
      get() {
        const value = parseFloat(this.getDataValue('longitude'), 10);
        return isNaN(value) ? null : value;
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(COORDINATE_PRECISION, COORDINATE_SCALE),
      allowNull: false,
      get() {
        const value = parseFloat(this.getDataValue('latitude'), 10);
        return isNaN(value) ? null : value;
      }
    }
  });
};
