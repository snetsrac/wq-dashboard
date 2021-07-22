const { dbhydro } = require('../apis');
const transformDbhydro = require('../utils/transformDbhydro');
const logger = require('../utils/logger');

module.exports.getHydro = async (req, res, next) => {
  const { params, query } = req;

  const response = await dbhydro.get('/web_io.report_process', {
    params: {
      v_dbkey: params.dbkeys.replace(/,/g, '/'),
      v_start_date: query.from.replace(/-/g, ''),
      v_end_date: query.to.replace(/-/g, '')
    },
    transformResponse: transformDbhydro
  });

  res.json(response.data);
};
