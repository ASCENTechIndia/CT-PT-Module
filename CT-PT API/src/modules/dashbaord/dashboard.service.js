const {
  getSummaryCardsValuesRepo,
  getWardWiseCleaningStatusRepo,
  getTopComplaintCategoryRepo,
  getRecentInspectionRepo,
  getCleaningComplienceRepo,
  getCitizenComplaintStatusRepo,
  getBillOverviewRepo,
} = require("./dashboard.repo");

async function getSummaryCardsValueService() {
  return getSummaryCardsValuesRepo();
}

async function getWardWiseCleaningStatusService() {
  return getWardWiseCleaningStatusRepo();
}

async function getTopComplaintCategoryService() {
  return getTopComplaintCategoryRepo();
}

async function getRecentInspectionService() {
  return getRecentInspectionRepo();
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
