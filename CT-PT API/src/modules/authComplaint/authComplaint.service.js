const { authComplaintRepo, compListforSupRepo, compListforSIRepo, getImages } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService( ulbid, fromDate,toDate,status, page, limit ) {
   return compListforSupRepo( ulbid, fromDate,toDate,status, page, limit ); 
  }

async function getCompListSIService(ulbid, fromDate, toDate, status, page, limit) {
  return compListforSIRepo(ulbid, fromDate, toDate, status, page, limit);
}

async function getImagesService(ulbid, toiletId, applid) {
  return getImages(ulbid, toiletId, applid);
}

module.exports = {
  authComplaintService, getCompListForSupService, getCompListSIService, getImagesService
};
