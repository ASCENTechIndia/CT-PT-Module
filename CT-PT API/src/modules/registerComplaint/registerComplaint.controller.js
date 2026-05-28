const {serviceWardList} = require('./registerComplaint.service');
const { auditLog } = require('../../utils/audit-log');
const { logApiSuccess, logApiError } = require('../../utils/log');

async function getWardList(req, res, next) {
  try {
    const rows = await serviceWardList(req.query.ulbid);
    logApiSuccess( req, 200, { count: rows?.length || 0 }, 'Ward List Report completed' );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Ward List Report search error');
    return next(error);
  }
}


module.exports = { getWardList,  
};
