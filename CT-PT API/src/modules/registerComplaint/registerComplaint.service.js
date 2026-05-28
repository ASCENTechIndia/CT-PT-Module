const { repoWardList, repoToiletList, repoComplaintTypeList,regComplaintRepo } = require('./registerComplaint.repo');

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
module.exports = { serviceWardList, serviceToiletList, serviceComplaintTypeList, regComplaintService };
