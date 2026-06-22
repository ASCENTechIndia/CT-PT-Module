const {
  authComplaintRepo,
  compListforSupRepo,
  compListforSIRepo,
  getImages,
  rslvdListbyVendorRepo,
  rslvdListbySupRepo,
  getSolvedComplaintImagesRepo,
  getSupervisorStatusRepo,
  rslvdListbyVendorListRepo,
  getReworkImages,
  complaintWorkStatusInsRepo,
} = require("./authComplaint.repo");

const { complaintStatusUpdateRepo } = require("./authComplaint.repo");

async function authComplaintService(payload) {
  return authComplaintRepo(payload);
}

async function getCompListForSupService(
  ulbid,
  fromDate,
  toDate,
  status,
  page,
  limit,
) {
  return compListforSupRepo(ulbid, fromDate, toDate, status, page, limit);
}

async function getCompListSIService(
  ulbid,
  fromDate,
  toDate,
  status,
  page,
  limit,
) {
  return compListforSIRepo(ulbid, fromDate, toDate, status, page, limit);
}

async function getImagesService(ulbid, toiletId, applid) {
  return getImages(ulbid, toiletId, applid);
}

async function getrslvdListbyVendorService(
  ulbid,
  supervisorId,
  fromDate,
  toDate,
  status,
  page,
  limit,
) {
  return rslvdListbyVendorRepo(
    ulbid,
    supervisorId,
    fromDate,
    toDate,
    status,
    page,
    limit,
  );
}

async function getrslvdListbyVendorListService(
  ulbid,
  vendorId,
  fromDate,
  toDate,
  status,
  page,
  limit,
) {
  return rslvdListbyVendorListRepo(
    ulbid,
    vendorId,
    fromDate,
    toDate,
    status,
    page,
    limit,
  );
}

async function getrslvdListbySupService(
  ulbid,
  fromDate,
  toDate,
  status,
  page,
  limit,
) {
  return rslvdListbySupRepo(ulbid, fromDate, toDate, status, page, limit);
}

async function getSolvedComplaintImagesService(ulbid, siid, complaintid) {
  return getSolvedComplaintImagesRepo(ulbid, siid, complaintid);
}

async function getSupervisorStatusService() {
  return getSupervisorStatusRepo();
}

async function getReworkImagesService(complaintid) {
  return getReworkImages(complaintid);
}

async function complaintStatusUpdateService(payload) {
  return complaintStatusUpdateRepo(payload);
}

async function complaintWorkStatusInsService(payload) {
  return complaintWorkStatusInsRepo(payload);
}

module.exports = {
  authComplaintService,
  getCompListForSupService,
  getCompListSIService,
  getImagesService,
  getrslvdListbyVendorService,
  getrslvdListbyVendorListService,
  getrslvdListbySupService,
  getSolvedComplaintImagesService,
  getSupervisorStatusService,
  getReworkImagesService,
  complaintWorkStatusInsService,
};

module.exports.complaintStatusUpdateService = complaintStatusUpdateService;
