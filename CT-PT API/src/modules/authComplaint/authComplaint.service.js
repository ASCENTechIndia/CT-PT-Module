const { authComplaintRepo, compListforSupRepo, compListforSIRepo, getImages } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService( ulbid, cursor, limit ) {
   return compListforSupRepo( ulbid, cursor, limit ); 
  }

async function getCompListSIService(ulbid, cursor, limit) {
  return compListforSIRepo(ulbid, cursor, limit);
}

async function getImagesService(ulbid, toiletId, applid) {
  return getImages(ulbid, toiletId, applid);
}

module.exports = {
  authComplaintService, getCompListForSupService, getCompListSIService, getImagesService
};
