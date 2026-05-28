const { repoWardList, repoToiletList, repoComplaintTypeList } = require('./registerComplaint.repo');

async function serviceWardList(ulbid) {
  return repoWardList(ulbid);
}
async function serviceToiletList(ulbid, wardid) {
  return repoToiletList(ulbid, wardid);
}
async function serviceComplaintTypeList(ulbid) {
  return repoComplaintTypeList(ulbid);
}
module.exports = { serviceWardList, serviceToiletList, serviceComplaintTypeList };
