const {
  getSummaryCardsValuesRepo,
  getWardWiseCleaningStatusRepo,
  getTopComplaintCategoryRepo,
  getRecentInspectionRepo,
  getCleaningComplienceRepo,
  getCitizenComplaintStatusRepo,
  getBillOverviewRepo,
  getRecentComplaintRepo,
} = require("./dashboard.repo");

async function getSummaryCardsValueService(payload) {
  return getSummaryCardsValuesRepo(payload);
}

async function getWardWiseCleaningStatusService(payload) {
  return getWardWiseCleaningStatusRepo(payload);
}

async function getTopComplaintCategoryService(payload) {
  return getTopComplaintCategoryRepo(payload);
}

async function getRecentInspectionService(payload) {
  return getRecentInspectionRepo(payload);
}

async function getCleaningComplienceService() {
  return getCleaningComplienceRepo();
}

async function getCitizenComplaintStatusService(payload) {
  return getCitizenComplaintStatusRepo(payload);
}

async function getBillOverviewService() {
  return getBillOverviewRepo();
}

async function getRecentComplaintService(payload) {
  return getRecentComplaintRepo(payload);
}

module.exports = {
  getSummaryCardsValueService,
  getWardWiseCleaningStatusService,
  getTopComplaintCategoryService,
  getRecentInspectionService,
  getCleaningComplienceService,
  getCitizenComplaintStatusService,
  getBillOverviewService,
  getRecentComplaintService,
};
