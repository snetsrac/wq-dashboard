const axios = require('axios');
const parseCsv = require('csv-parse/lib/sync');
const { add, format, parse, parseISO, isBefore } = require('date-fns');
// const { SalinityRecord } = require('./models');

const ISO_DATE_FORMAT = 'yyyy-MM-dd';
const DBKEYS = [91602, 91404, 91601/*, 39481, 39485*/];

module.exports = async function getData(dateRange) {
  const data = { ...await getDbhydroData(dateRange), ...await getErmData(dateRange) };
  const totalRows = Object.values(data).map((dataset) => dataset.data.length).reduce((acc, cum) => acc + cum);

  if (totalRows === 0) {
    return null;
  } else {
    return fillGapsInAllDatasets(data);
  }
}

async function getDbhydroData(dateRange) {
  const url = `https://my.sfwmd.gov/dbhydroplsql/web_io.report_process?v_dbkey=${DBKEYS.join('%2F')}` +
    `&${getTimeQuery(dateRange)}&v_report_type=format6&v_target_code=file_csv&v_run_mode=onLine&v_js_flag=Y`;
  
  console.log('Requesting data from SFWMD');
  console.time('Response received from SFWMD');

  const response = await axios({
    method: 'GET',
    url,
    transformResponse: transformDbhydroData
  });

  console.timeEnd('Response received from SFWMD');
  
  return response.data;
}

function transformDbhydroData(data) {
  const { datasets, rows } = parseDbhydroData(data);
  const result = {};

  for (let dataset of datasets) {
    result[dataset.DBKEY] = initializeDbhydroResult(dataset);
  }

  for (let row of rows) {
    // Exclude flagged data other than 'estimated'
    // 'Qualifer' is the misspelled field name that DBHYDRO returns
    if (!['', 'E'].includes(row['Qualifer'])) continue;

    result[row.DBKEY].data.push(parseDbhydroRow(row));

    if (result[row.DBKEY].dataType === 'flow') {
      result[row.DBKEY].total += calculateAcreFeet(row);
    }
  }

  return result;
}

function parseDbhydroData(data) {
  const lines = data.replace(/\s*$/, '\n').split(/\n|\r\n/);
  const datasets = lines.slice(1, 2 + DBKEYS.length).join('\n');
  const rows = lines.slice(2 + DBKEYS.length).join('\n');

  return {
    datasets: parseCsv(datasets, { columns: true, relaxColumnCountMore: true }),
    rows: parseCsv(rows, { columns: true })
  };
}

function initializeDbhydroResult(dataset) {
  const result = {
      dataType: dataset.TYPE.toLowerCase(),
      unit: dataset.UNITS,
      data: []
  };

  if (result.dataType === 'flow') result.total = 0;

  return result;
}

function parseDbhydroRow(row) {
  const dailyDate = parse(row['Daily Date'], 'dd-LLL-yyyy', new Date());
  const value = isNaN(row['Data Value']) ? null : Number(row['Data Value']);

  return {
    x: format(dailyDate, ISO_DATE_FORMAT),
    y: value
  };
}

// Convert daily average CFS (rate) to acre-feet per day (volume)
function calculateAcreFeet(row) {
  return row['Data Value'] * 60 * 60 * 24 / 43560;
}

function fillGapsInAllDatasets(data) {
  for (let dataset of Object.values(data)) {
    if (dataset.data.length <= 1) continue;

    dataset.data = fillGaps(dataset.data);
  }

  return data;
}

function fillGaps(data) {
  const result = [];
  let date = parseISO(data[0].x);
  let i = 0;

  while (i < data.length) {
    if (isBefore(date, parseISO(data[i].x))) {
      result.push({ x: format(date, ISO_DATE_FORMAT), y: null });
    } else {
      i++;
    }

    date = add(date, { days: 1 });
  }
  
  return data.concat(result).sort(byDate);
}

function byDate(a, b) {
  if (a.x < b.x) {
    return -1;
  } else if (a.x > b.x) {
    return 1;
  } else {
    return 0;
  }
}

function getTimeQuery(dateRange) {
  const start = format(dateRange.start, 'yyyyMMdd');
  const end = format(dateRange.end, 'yyyyMMdd');

  return `v_period=uspec&v_start_date=${start}&v_end_date=${end}`;
}

async function getErmData(dateRange) {
  // return {
  //   'John\'s Island': await queryErmData('John\'s Island', dateRange),
  //   'Munyon Island': await queryErmData('Munyon Island', dateRange)
  // };

  return await queryErmData(dateRange);
}

const salinityKeys = ['JOHNS', 'LWL20AS+SA', 'LWL19S+SA', 'LWL19B+SA', 'LWL20AB+SA', 'MUNYON', 'LWL20S', 'LWL20B'];

async function queryErmData(dateRange) {
  const urlString = `http://maps.co.palm-beach.fl.us/arcgis/rest/services/ERM/SFWMD_Sub_Data/FeatureServer/0/` +
  `query?f=json&resultOffset=0&resultRecordCount=7500&where=(NAME IN(${salinityKeys.map(key => `'${key}'`).join(', ')})) AND (DATETIME BETWEEN timestamp ` +
  `'${format(dateRange.start, ISO_DATE_FORMAT)} 00:00:00' AND CURRENT_TIMESTAMP)&orderByFields=DATETIME ASC` +
  `&outFields=ESRI_OID,VALUE,DATETIME,NAME&returnGeometry=false&spatialRel=esriSpatialRelIntersects`;
  
  const url = new URL(urlString.replace(/\+/g, '%2B'));

  console.log(`GET ${url}`);

  const response = await axios({
    method: 'GET',
    url: url.toString(),
    transformResponse: transformEsriData
  });

  return response.data;

  // const result = await SalinityRecord.find(
  //   {
  //     site: site,
  //     date: { $gte: dateRange.start, $lte: dateRange.end }
  //   },
  //   {
  //     date: 1,
  //     salinity: 1,
  //     _id: 0
  //   }
  // )

  // const result = [];

  // return {
  //   dataType: 'salin',
  //   unit: 'PSU',
  //   data: result.map((row) => {
  //     return {
  //       x: format(row.date, ISO_DATE_FORMAT),
  //       y: row.salinity
  //     }
  //   })
  // }
}

function transformEsriData(data) {
  const result = {};

 JSON.parse(data)['features'].forEach(feature => {
    if (feature.attributes['VALUE'] < 0) feature.attributes['VALUE'] = null;

    const key = feature.attributes['NAME'];

    if (result[key] === undefined) {
      result[key] = {
        dataType: 'salinity',
        unit: 'PSU',
        data: []
      };
    }

    result[key].data.push({
      x: format(new Date(feature.attributes['DATETIME']), ISO_DATE_FORMAT),
      y: feature.attributes['VALUE']?.toFixed(2) || null
    });
  });

  return result;
}
