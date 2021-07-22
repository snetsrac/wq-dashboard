const parse = require('csv-parse');

const logger = require('./logger');

const buildOutput = (metadata, data) => {
  const output = {};

  for (let row of metadata.rows) {
    const dbkey = row[0];

    output[dbkey] = { metadata: {}, data: [] };
    metadata.headers.forEach((header, i) => {
      output[dbkey].metadata[header] = row[i];
    });
  }

  for (let row of data.rows) {
    const dbkey = row[1];
    const rowObject = {};

    data.headers.forEach((header, i) => {
      rowObject[header] = row[i];
    });

    output[dbkey].data.push(rowObject);
  }

  return output;
};

module.exports = (input) => {
  const metadata = { headers: null, rows: [] };
  const data = { headers: null, rows: [] };

  const parser = parse({
    relax_column_count: true
  });

  parser.on('readable', () => {
    let record;

    while(record = parser.read()) {
      if (record.length >= 19) {
        metadata.headers ? metadata.rows.push(record) : metadata.headers = record;
      } else if (record.length > 1) {
        data.headers ? data.rows.push(record) : data.headers = record;
      }
    };
  });

  parser.on('error', logger.error);

  parser.write(input);
  parser.end();

  return buildOutput(metadata, data);
};
