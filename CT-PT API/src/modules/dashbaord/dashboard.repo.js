const { executeQuery } = require("../../db/queryExecutor");

async function getSummaryCardsValuesRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

async function getWardWiseCleaningStatusRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

async function getTopComplaintCategoryRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

async function getRecentInspectionRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

async function getCleaningComplienceRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

async function getCitizenComplaintStatusRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

async function getBillOverviewRepo() {
  const query = ``;
  const bind = {};
  const result = await executeQuery(query, bind);
  return result;
}

module.exports = {
  getSummaryCardsValuesRepo,
  getWardWiseCleaningStatusRepo,
  getTopComplaintCategoryRepo,
  getRecentInspectionRepo,
  getCleaningComplienceRepo,
  getCitizenComplaintStatusRepo,
  getBillOverviewRepo,
};
