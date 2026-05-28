const { authComplaintService, getCompListForSupService, getCompListSIService,
    getImagesService
 } = require('./authComplaint.service');
const { auditLog } = require('../../utils/audit-log');
const { logApiSuccess, logApiError } = require('../../utils/log');

function requestMeta(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  };
}

async function authComplaint(req, res, next) {
  try {
    const payload = req.body;
    const out = await authComplaintService(payload);
    const isSuccess = String(out.errorCode) === '9999';

    if (isSuccess) {
      logApiSuccess(req, 200, {}, 'Auth complaint approved successfully');
    } else {
      logApiError(req, 400, out.message, 'Auth complaint approval failed');
    }

    auditLog({
      action: 'AUTH_COMPLAINT_APPROVAL',
      actor: req.user?.userId || 'system',
      module: 'authComplaint',
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      details: {
        outErrorCode: out.errorCode,
        outErrorMsg: out.message,
      },
      requestMeta: requestMeta(req),
    });

    return res.ok(out);
  } catch (error) {
    logApiError(req, 500, error.message, 'Auth complaint approval error');
    return next(error);
  }
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

async function getCompListForSI(req, res, next) {
  try {
    const rows = await getCompListSIService(req.query.ulbid);
    logApiSuccess( req, 200, { count: rows?.length || 0 }, 'Complaint List for SI completed' );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Complaint List for SI  search error');
  return next(error);
  }
}

async function getImagesCon(req, res, next) {
  try {
    const { ulbid, toiletId, applid } = req.query;
    const rows = await getImagesService(ulbid, toiletId, applid);
    logApiSuccess( req, 200, { count: rows?.length || 0 }, 'Images retrieved successfully' );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, 'Error retrieving images');
    return next(error);
  }
}

module.exports = { authComplaint, getCompListForSup, getCompListForSI, getImagesCon };
