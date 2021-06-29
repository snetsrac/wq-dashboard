const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SalinityRecordSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  site: {
    type: String,
    required: true,
    enum: ['John\'s Island', 'Munyon Island']
  },
  salinity: {
    type: Number,
    min: 0
  }
});

SalinityRecordSchema.index({ date: 1, site: 1 }, { unique: true });

module.exports.SalinityRecord = mongoose.model('SalinityRecord', SalinityRecordSchema);
