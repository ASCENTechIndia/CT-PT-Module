const {
  getSummaryCardsValuesRepo,
  getWardWiseCleaningStatusRepo,
  getTopComplaintCategoryRepo,
  getRecentInspectionRepo,
  getCleaningComplienceRepo,
  getCitizenComplaintStatusRepo,
  getBillOverviewRepo,
} = require("./dashboard.repo");

async function getSummaryCardsValueService(payload) {
  return getSummaryCardsValuesRepo(payload);
}

async function getWardWiseCleaningStatusService() {
  return getWardWiseCleaningStatusRepo();
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

async function getCitizenComplaintStatusService() {
  return getCitizenComplaintStatusRepo();
}

async function getBillOverviewService() {
  return getBillOverviewRepo();
}

module.exports = {
  getSummaryCardsValueService,
  getWardWiseCleaningStatusService,
  getTopComplaintCategoryService,
  getRecentInspectionService,
  getCleaningComplienceService,
  getCitizenComplaintStatusService,
  getBillOverviewService,
};
