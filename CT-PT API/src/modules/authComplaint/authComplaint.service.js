const { authComplaintRepo, compListforSupRepo, compListforSIRepo, getImages } = require('./authComplaint.repo');

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService(ulbid) {
  return compListforSupRepo(ulbid);
}

async function getCompListSIService(ulbid) {
  return compListforSIRepo(ulbid);
}

async function getImagesService(ulbid, toiletId, applid) {
  return getImages(ulbid, toiletId, applid);
}

module.exports = {
  authComplaintService, getCompListForSupService, getCompListSIService, getImagesService
};
