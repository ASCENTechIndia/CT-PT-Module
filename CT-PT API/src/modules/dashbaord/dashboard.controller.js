const { logApiSuccess, logApiError } = require("../../utils/log");
const {
  getSummaryCardsValueService,
  getWardWiseCleaningStatusService,
  getTopComplaintCategoryService,
  getRecentInspectionService,
  getCleaningComplienceService,
  getCitizenComplaintStatusService,
  getBillOverviewService,
} = require("./dashboard.service");

async function getSummaryCardValuesController(req, res, next) {
  try {
    const result = await getSummaryCardsValueService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Summary cards value fetched successfully",
    );

    return res.ok({ data: result?.data || result });
  } catch (error) {
    logApiError(req, 500, error.message, "Summary cards fetching error");
    return next(error);
  }
}

async function getWardWiseCleaningStatusController(req, res) {
  try {
    const result = await getWardWiseCleaningStatusService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Ward wise cleaning status values fetched successfully",
    );

    return res.ok({ data: result?.data || result || [] });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Ward wise cleaning status fetching error",
    );
    return next(error);
  }
}

async function getTopComplaintCategoryController(req, res) {
  try {
    const result = await getTopComplaintCategoryService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Top complaint category values fetched successfully",
    );

    return res.ok({ data: result?.data || result || [] });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Top complaint category fetching error",
    );
    return next(error);
  }
}

async function getRecentInspectionController(req, res) {
  try {
    const result = await getRecentInspectionService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Recent inspections values fetched successfully",
    );

    return res.ok({ data: result?.data || result || [] });
  } catch (error) {
    logApiError(req, 500, error.message, "Recent inspections fetching error");
    return next(error);
  }
}

async function getCleaningComplienceController(req, res) {
  try {
    const result = await getCleaningComplienceService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Cleaning complience values fetched successfully",
    );

    return res.ok({ data: result?.data || result || [] });
  } catch (error) {
    logApiError(req, 500, error.message, "Cleaning complience fetching error");
    return next(error);
  }
}

async function getCitizenComplaintStatusController(req, res) {
  try {
    const result = await getCitizenComplaintStatusService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Citizen complaint status values fetched successfully",
    );

    return res.ok({ data: result?.data || result || [] });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Citizen complaint status fetching error",
    );
    return next(error);
  }
}

async function getBillOverviewController(req, res) {
  try {
    const result = await getBillOverviewService();

    logApiSuccess(
      req,
      200,
      { count: result?.length || 0 },
      "Bill overview fetched successfully",
    );

    return res.ok({ data: result?.data || result || [] });
  } catch (error) {
    logApiError(req, 500, error.message, "Bill overview fetching error");
    return next(error);
  }
}

module.exports = {
  getSummaryCardValuesController,
  getWardWiseCleaningStatusController,
  getTopComplaintCategoryController,
  getRecentInspectionController,
  getCleaningComplienceController,
  getCitizenComplaintStatusController,
  getBillOverviewController,
};
