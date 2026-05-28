const { authComplaintRepo, compListforSupRepo } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService(ulbid) {
  return compListforSupRepo(ulbid);
}

module.exports = {
  authComplaintService, getCompListForSupService
};
