const {serviceWardList,serviceToiletList,serviceComplaintTypeList} = require('./registerComplaint.service');
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

async function getToiletList(req, res, next) {
  try {
    const rows = await serviceToiletList(req.query.ulbid, req.query.wardid);
    logApiSuccess( req, 200, { count: rows?.length || 0 }, 'Toilet List Report completed' );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Toilet List Report search error');
    return next(error);
  }
}

async function getComplaintTypeList(req, res, next) {
  try {
    const rows = await serviceComplaintTypeList(req.query.ulbid);
    logApiSuccess(req, 200, { count: rows?.length || 0 }, 'Complaint Type List completed');
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Complaint Type List search error');
    return next(error);
  }
}

module.exports = { getWardList, getToiletList, getComplaintTypeList };
