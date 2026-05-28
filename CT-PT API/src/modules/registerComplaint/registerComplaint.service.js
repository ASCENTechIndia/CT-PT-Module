const {repoWardList,} = require('./registerComplaint.repo');

async function serviceWardList(ulbid) {
  return repoWardList(ulbid);
}

module.exports = { serviceWardList, };
