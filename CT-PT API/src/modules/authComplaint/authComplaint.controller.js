const { authComplaintService } = require('./authComplaint.service');
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

module.exports = {
  authComplaint,
};