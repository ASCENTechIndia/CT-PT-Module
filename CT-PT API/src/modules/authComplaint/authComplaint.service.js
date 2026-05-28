const { authComplaintRepo, compListforSupRepo, compListforSIRepo } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService(ulbid) {
  return compListforSupRepo(ulbid);
}

async function getCompListSIService(ulbid) {
  return compListforSIRepo(ulbid);
}

module.exports = {
  authComplaintService, getCompListForSupService, getCompListSIService
};
