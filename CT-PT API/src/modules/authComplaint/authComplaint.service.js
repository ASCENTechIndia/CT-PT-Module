const { authComplaintRepo, compListforSupRepo, compListforSIRepo, getImages } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService( ulbid, page, limit ) {
   return compListforSupRepo( ulbid, page, limit ); 
  }

async function getCompListSIService(ulbid, page, limit) {
  return compListforSIRepo(ulbid, page, limit);
}

async function getImagesService(ulbid, toiletId, applid) {
  return getImages(ulbid, toiletId, applid);
}

module.exports = {
  authComplaintService, getCompListForSupService, getCompListSIService, getImagesService
};
