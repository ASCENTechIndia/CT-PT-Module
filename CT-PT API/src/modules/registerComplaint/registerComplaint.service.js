const { repoWardList, repoToiletList, repoComplaintTypeList,regComplaintRepo, compListRepo } = require('./registerComplaint.repo');

async function serviceWardList(ulbid) {
  return repoWardList(ulbid);
}
async function serviceToiletList(ulbid, wardid) {
  return repoToiletList(ulbid, wardid);
}
async function serviceComplaintTypeList(ulbid) {
  return repoComplaintTypeList(ulbid);
}

async function regComplaintService(payload) {
  return regComplaintRepo(payload);
}

async function compListService(si_id,ulbid,fromDate, toDate, status, page,limit) {
  return compListRepo(si_id,ulbid,fromDate, toDate, status, page,limit);
}

module.exports = { serviceWardList, serviceToiletList, serviceComplaintTypeList, regComplaintService, compListService };
