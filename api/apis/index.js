const axios = require('axios');

const logger = require('../utils/logger');

const dbhydro = axios.create({
  baseURL: 'https://my.sfwmd.gov/dbhydroplsql/',
  params: {
    v_report_type: 'format6',
    v_period: 'uspec',
    v_target_code: 'file_csv',
    v_run_mode: 'onLine',
    v_js_flag: 'Y'
  }
});

dbhydro.interceptors.response.use((response) => {
  const { status, statusText } = response;
  const { method, protocol, host, path } = response.request;
  logger.log(`Axios: ${method} ${protocol}//${host}${path} ${status} ${statusText}`);
  return response;
});

module.exports.dbhydro = dbhydro;
