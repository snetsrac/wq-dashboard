const { DataTypes } = require('sequelize');

const SALINITY_PRECISION = 4;
const SALINITY_SCALE = 2;

exports.define = (sequelize) => {
  sequelize.define('salinityRecord', {
    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    salinity: {
      type: DataTypes.DECIMAL(SALINITY_PRECISION, SALINITY_SCALE),
      validate: {
        min: 0
      }
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['siteId', 'date']
      }
    ]
  }
  );
};