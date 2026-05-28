const {getCompListForSupService} = require('./authComplaint.service');
const { auditLog } = require('../../utils/audit-log');
const { logApiSuccess, logApiError } = require('../../utils/log');
function requestMeta(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  };
}














async function getCompListForSup(req, res, next) {
  try {
    const rows = await getCompListForSupService(req.query.ulbid);
    logApiSuccess( req, 200, { count: rows?.length || 0 }, 'Complaint List for Supervisor completed' );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Complaint List for Supervisor  search error');
    return next(error);
  }
}

module.exports = {  getCompListForSup };
