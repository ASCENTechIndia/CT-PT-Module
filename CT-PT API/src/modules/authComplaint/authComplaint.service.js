const { compListforSupRepo } = require('./authComplaint.repo');


async function getCompListForSupService(ulbid) {
  return compListforSupRepo(ulbid);
}

module.exports = { getCompListForSupService };
