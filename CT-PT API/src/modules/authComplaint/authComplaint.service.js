const { authComplaintRepo } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

module.exports = {
  authComplaintService,
};