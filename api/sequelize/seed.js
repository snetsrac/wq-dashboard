const sequelize = require('./index');
const { type } = require('./models/site');

const { site, salinityRecord } = sequelize.models;

(async () => {
  await sequelize.sync({ force: true });

  await site.create({ name: 'LWL-1', type: type.GRAB_SAMPLE, longitude: -80.057506, latitude: 26.843595 });
  await site.create({ name: 'LWL-2', type: type.GRAB_SAMPLE, longitude: -80.049525, latitude: 26.821559 });
  await site.create({ name: 'LWL-4', type: type.GRAB_SAMPLE, longitude: -80.037939, latitude: 26.802273 });
  await site.create({ name: 'LWL-5', type: type.GRAB_SAMPLE, longitude: -80.046028, latitude: 26.781331 });
  await site.create({ name: 'LWL-6', type: type.GRAB_SAMPLE, longitude: -80.047136, latitude: 26.765337 });
  await site.create({ name: 'LWL-7', type: type.GRAB_SAMPLE, longitude: -80.047087, latitude: 26.726742 });
  await site.create({ name: 'LWL-8', type: type.GRAB_SAMPLE, longitude: -80.044161, latitude: 26.686898 });
  await site.create({ name: 'LWL-10', type: type.GRAB_SAMPLE, longitude: -80.043945, latitude: 26.661006 });
  await site.create({ name: 'LWL-11', type: type.GRAB_SAMPLE, longitude: -80.044650, latitude: 26.615192 });
  await site.create({ name: 'LWL-13', type: type.GRAB_SAMPLE, longitude: -80.046148, latitude: 26.584037 });
  await site.create({ name: 'LWL-15', type: type.GRAB_SAMPLE, longitude: -80.044503, latitude: 26.556640 });
  await site.create({ name: 'LWL-16', type: type.GRAB_SAMPLE, longitude: -80.046403, latitude: 26.544850 });
  await site.create({ name: 'LWL-17', type: type.GRAB_SAMPLE, longitude: -80.052006, latitude: 26.539040 });
  await site.create({ name: 'LWL-18', type: type.GRAB_SAMPLE, longitude: -80.053664, latitude: 26.528881 });
  await site.create({ name: 'LWL-19', dbkey: '39481', type: type.SFWMD_SONDE, longitude: -80.044164, latitude: 26.615551 });
  await site.create({ name: 'LWL-20A', dbkey: '39485', type: type.SFWMD_SONDE, longitude: -80.047308, latitude: 26.676611 });
  await site.create({ name: 'John\'s Island', dbkey: 'johns-island', type: type.ERM_SONDE, longitude: -80.040887, latitude: 26.643564 });
  await site.create({ name: 'Munyon Island', dbkey: 'munyon-island', type: type.ERM_SONDE, longitude: -80.047560, latitude: 26.821910 });
  await site.create({ name: 'S-44', dbkey: '91602', type: type.SFWMD_GATE, longitude: -80.080553, latitude: 26.817237 });
  await site.create({ name: 'S-155', dbkey: '91404', type: type.SFWMD_GATE, longitude: -80.055042, latitude: 26.644692 });
  await site.create({ name: 'S-41', dbkey: '91601', type: type.SFWMD_GATE, longitude: -80.056806, latitude: 26.539120 });
})();