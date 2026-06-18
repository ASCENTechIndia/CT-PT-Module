const {
  authComplaintService,
  getCompListForSupService,
  getCompListSIService,
  getImagesService,
  getrslvdListbyVendorService,
  getrslvdListbySupService,
  getSolvedComplaintImagesService,
  getSupervisorStatusService,
  getrslvdListbyVendorListService,
} = require("./authComplaint.service");
const { complaintStatusUpdateService } = require("./authComplaint.service");
const { auditLog } = require("../../utils/audit-log");
const { logApiSuccess, logApiError } = require("../../utils/log");

function requestMeta(req) {
  return {
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
  };
}

async function authComplaint(req, res, next) {
  try {
    const payload = req.body;
    const out = await authComplaintService(payload);
    const isSuccess = String(out.errorCode) === "9999";

    if (isSuccess) {
      logApiSuccess(req, 200, {}, "Auth complaint approved successfully");
    } else {
      logApiError(req, 400, out.message, "Auth complaint approval failed");
    }

    auditLog({
      action: "AUTH_COMPLAINT_APPROVAL",
      actor: req.user?.userId || "system",
      module: "authComplaint",
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.errorCode,
        outErrorMsg: out.message,
      },
      requestMeta: requestMeta(req),
    });

    return res.ok(out);
  } catch (error) {
    logApiError(req, 500, error.message, "Auth complaint approval error");
    return next(error);
  }
}

async function getCompListForSup(req, res, next) {
  try {
    const { ulbid, fromDate, toDate, status, page = 0, limit = 10 } = req.query;
    const result = await getCompListForSupService(
      ulbid,
      fromDate,
      toDate,
      status,
      page,
      limit,
    );

    // Sanitize the result to avoid circular references
    const cleanData = (result.data || []).map((row) => ({
      NUM_EMPCTPTENTRY_ID: row.NUM_EMPCTPTENTRY_ID,
      DAT_EMPCTPTENTRY_DATE: row.DAT_EMPCTPTENTRY_DATE,
      VAR_EMPCTPTENTRY_LATITUDE: row.VAR_EMPCTPTENTRY_LATITUDE,
      UNIQUEID: row.UNIQUEID,
      VAR_EMPCTPTENTRY_SUPREMARK: row.VAR_EMPCTPTENTRY_SUPREMARK,
      VAR_EMPCTPTENTRY_SUPFLAG: row.VAR_EMPCTPTENTRY_SUPFLAG,
      USERNAME: row.USERNAME,
      VAR_EMPCTPTENTRY_USERID: row.VAR_EMPCTPTENTRY_USERID,
      VAR_EMPCTPTENTRY_LONGITUDE: row.VAR_EMPCTPTENTRY_LONGITUDE,
      NUM_EMPCTPTENTRY_TOILETID: row.NUM_EMPCTPTENTRY_TOILETID,
      NUM_EMPCTPTENTRY_STAGEID: row.NUM_EMPCTPTENTRY_STAGEID,
      VAR_EMPCTPTENTRY_REMARK: row.VAR_EMPCTPTENTRY_REMARK,
      DAT_EMPCTPTENTRY_INSDATE: row.DAT_EMPCTPTENTRY_INSDATE,
      NUM_EMPCTPTENTRY_ULBID: row.NUM_EMPCTPTENTRY_ULBID,
      NUM_CTPTTYPE_WARDID: row.NUM_CTPTTYPE_WARDID,
      VAR_CTPTTYPE_TOILETLOCATION: row.VAR_CTPTTYPE_TOILETLOCATION,
      VAR_CTPTTYPE_FEMALESEATS: row.VAR_CTPTTYPE_FEMALESEATS,
      VAR_CTPTTYPE_MALESEATS: row.VAR_CTPTTYPE_MALESEATS,
      VAR_CTPTTYPE_TOTALSEATS: row.VAR_CTPTTYPE_TOTALSEATS,
      VAR_CTPTTYPE_STATUS: row.VAR_CTPTTYPE_STATUS,
      VAR_CTPTTYPE_USERNAME: row.VAR_CTPTTYPE_USERNAME,
      VAR_CTPTSTAGE_STATUS: row.VAR_CTPTSTAGE_STATUS,
      VAR_CTPTSTAGE_NAME: row.VAR_CTPTSTAGE_NAME,
    }));

    const pagination = {
      page: result.pagination?.page || 0,
      limit: result.pagination?.limit || 10,
      total: result.pagination?.total || 0,
      totalPages: result.pagination?.totalPages || 0,
    };

    logApiSuccess(
      req,
      200,
      { count: cleanData?.length || 0 },
      "Complaint List for Supervisor completed",
    );
    return res.ok({ data: cleanData, pagination });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Complaint List for Supervisor search error",
    );
    return next(error);
  }
}

async function getCompListForSI(req, res, next) {
  try {
    const { ulbid, fromDate, toDate, status, page = 1, limit = 10 } = req.query;
    const result = await getCompListSIService(
      ulbid,
      fromDate,
      toDate,
      status,
      page,
      limit,
    );

    // Sanitize the result to avoid circular references
    const cleanData = (result.data || []).map((row) => ({
      NUM_EMPCTPTENTRY_ID: row.NUM_EMPCTPTENTRY_ID,
      DAT_EMPCTPTENTRY_DATE: row.DAT_EMPCTPTENTRY_DATE,
      VAR_EMPCTPTENTRY_LATITUDE: row.VAR_EMPCTPTENTRY_LATITUDE,
      UNIQUEID: row.UNIQUEID,
      USERNAME: row.USERNAME,
      VAR_EMPCTPTENTRY_USERID: row.VAR_EMPCTPTENTRY_USERID,
      VAR_EMPCTPTENTRY_LONGITUDE: row.VAR_EMPCTPTENTRY_LONGITUDE,
      NUM_EMPCTPTENTRY_TOILETID: row.NUM_EMPCTPTENTRY_TOILETID,
      NUM_EMPCTPTENTRY_STAGEID: row.NUM_EMPCTPTENTRY_STAGEID,
      VAR_EMPCTPTENTRY_REMARK: row.VAR_EMPCTPTENTRY_REMARK,
      DAT_EMPCTPTENTRY_INSDATE: row.DAT_EMPCTPTENTRY_INSDATE,
      NUM_EMPCTPTENTRY_ULBID: row.NUM_EMPCTPTENTRY_ULBID,
      NUM_CTPTTYPE_WARDID: row.NUM_CTPTTYPE_WARDID,
      VAR_CTPTTYPE_TOILETLOCATION: row.VAR_CTPTTYPE_TOILETLOCATION,
      VAR_CTPTTYPE_FEMALESEATS: row.VAR_CTPTTYPE_FEMALESEATS,
      VAR_CTPTTYPE_MALESEATS: row.VAR_CTPTTYPE_MALESEATS,
      VAR_CTPTTYPE_TOTALSEATS: row.VAR_CTPTTYPE_TOTALSEATS,
      VAR_CTPTTYPE_STATUS: row.VAR_CTPTTYPE_STATUS,
      VAR_CTPTTYPE_USERNAME: row.VAR_CTPTTYPE_USERNAME,
      VAR_CTPTSTAGE_STATUS: row.VAR_CTPTSTAGE_STATUS,
      VAR_CTPTSTAGE_NAME: row.VAR_CTPTSTAGE_NAME,
      VAR_EMPCTPTENTRY_SUPFLAG: row.VAR_EMPCTPTENTRY_SUPFLAG,
      VAR_EMPCTPTENTRY_SIFLAG: row.VAR_EMPCTPTENTRY_SIFLAG,
      VAR_EMPCTPTENTRY_SIREMARK: row.VAR_EMPCTPTENTRY_SIREMARK,
    }));

    const pagination = {
      page: result.pagination?.page || 1,
      limit: result.pagination?.limit || 10,
      total: result.pagination?.total || 0,
      totalPages: result.pagination?.totalPages || 0,
    };

    logApiSuccess(
      req,
      200,
      { count: cleanData?.length || 0 },
      "Complaint List for SI completed",
    );
    return res.ok({ data: cleanData, pagination });
  } catch (error) {
    logApiError(req, 500, error.message, "Complaint List for SI  search error");
    return next(error);
  }
}

async function getImagesCon(req, res, next) {
  try {
    const { ulbid, toiletId, applid } = req.query;
    const rows = await getImagesService(ulbid, toiletId, applid);
    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      "Images retrieved successfully",
    );
    return res.ok(rows);
  } catch (error) {
    logApiError(req, 500, error.message, "Error retrieving images");
    return next(error);
  }
}

async function resolvedListbyVendor(req, res, next) {
  try {
    const {
      ulbid,
      supervisorId,
      fromDate,
      toDate,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    const result = await getrslvdListbyVendorService(
      ulbid,
      supervisorId,
      fromDate,
      toDate,
      status,
      page,
      limit,
    );

    // Sanitize the result to avoid circular references
    const cleanData = (result.data || []).map((row) => {
      const cleanRow = {
        PRBHAG: row.PRBHAG,
        PRBHAGID: row.PRBHAGID,
        SUPERWISER_ID: row.SUPERWISER_ID,
        SUPERWISER: row.SUPERWISER,
        LOCATION: row.LOCATION,
        VAR_COMPLAINT_STATUS: row.VAR_COMPLAINT_STATUS,
        VAR_COMPLAINT_CITIZNAME: row.VAR_COMPLAINT_CITIZNAME,
        NUM_COMPLAINT_TOILET: row.NUM_COMPLAINT_TOILET,
        MOBILENO: row.MOBILENO,
        COMPLAINT_DATE: row.COMPLAINT_DATE,
        VAR_COMPLAINT_REMARK: row.VAR_COMPLAINT_REMARK,
        VAR_CTPTSANITINSPCTOR_NAME: row.VAR_CTPTSANITINSPCTOR_NAME,
        ULBID: row.ULBID,
        SI_ID: row.SI_ID,
        COMPLAINTID: row.COMPLAINTID,
        VENDEREMARK: row.VENDEREMARK,
      };

      // Only include image fields if they are strings (base64) and not LOB objects
      if (typeof row.BLOB_COMPLAINT_UNITIMG1 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG1 = row.BLOB_COMPLAINT_UNITIMG1;

      if (typeof row.BLOB_COMPLAINT_UNITIMG2 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG2 = row.BLOB_COMPLAINT_UNITIMG2;

      if (typeof row.BLOB_COMPLAINT_UNITIMG3 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG3 = row.BLOB_COMPLAINT_UNITIMG3;

      if (typeof row.BLOB_COMPLAINT_UNITIMG4 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG4 = row.BLOB_COMPLAINT_UNITIMG4;

      if (typeof row.BLOB_COMPLAINT_UNITIMG5 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG5 = row.BLOB_COMPLAINT_UNITIMG5;

      return cleanRow;
    });

    const pagination = {
      page: result.pagination?.page || 1,
      limit: result.pagination?.limit || 10,
      total: result.pagination?.total || 0,
      totalPages: result.pagination?.totalPages || 0,
    };

    logApiSuccess(
      req,
      200,
      { count: cleanData?.length || 0 },
      "Resolved Complaint List for Supervisor completed",
    );
    return res.ok({ data: cleanData, pagination });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Resolved Complaint List for Supervisor search error",
    );
    return next(error);
  }
}

async function resolvedListbyVendorList(req, res, next) {
  try {
    const {
      ulbid,
      vendorId,
      fromDate,
      toDate,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    const result = await getrslvdListbyVendorListService(
      ulbid,
      vendorId,
      fromDate,
      toDate,
      status,
      page,
      limit,
    );

    // Sanitize the result to avoid circular references
    const cleanData = (result.data || []).map((row) => {
      const cleanRow = {
        PRBHAG: row.PRBHAG,
        PRBHAGID: row.PRBHAGID,
        SUPERWISER_ID: row.SUPERWISER_ID,
        SUPERWISER: row.SUPERWISER,
        LOCATION: row.LOCATION,
        VAR_COMPLAINT_STATUS: row.VAR_COMPLAINT_STATUS,
        VAR_COMPLAINT_CITIZNAME: row.VAR_COMPLAINT_CITIZNAME,
        NUM_COMPLAINT_TOILET: row.NUM_COMPLAINT_TOILET,
        MOBILENO: row.MOBILENO,
        COMPLAINT_DATE: row.COMPLAINT_DATE,
        VAR_COMPLAINT_REMARK: row.VAR_COMPLAINT_REMARK,
        VAR_CTPTSANITINSPCTOR_NAME: row.VAR_CTPTSANITINSPCTOR_NAME,
        ULBID: row.ULBID,
        SI_ID: row.SI_ID,
        COMPLAINTID: row.COMPLAINTID,
      };

      // Only include image fields if they are strings (base64) and not LOB objects
      if (typeof row.BLOB_COMPLAINT_UNITIMG1 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG1 = row.BLOB_COMPLAINT_UNITIMG1;

      if (typeof row.BLOB_COMPLAINT_UNITIMG2 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG2 = row.BLOB_COMPLAINT_UNITIMG2;

      if (typeof row.BLOB_COMPLAINT_UNITIMG3 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG3 = row.BLOB_COMPLAINT_UNITIMG3;

      if (typeof row.BLOB_COMPLAINT_UNITIMG4 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG4 = row.BLOB_COMPLAINT_UNITIMG4;

      if (typeof row.BLOB_COMPLAINT_UNITIMG5 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG5 = row.BLOB_COMPLAINT_UNITIMG5;

      return cleanRow;
    });

    const pagination = {
      page: result.pagination?.page || 1,
      limit: result.pagination?.limit || 10,
      total: result.pagination?.total || 0,
      totalPages: result.pagination?.totalPages || 0,
    };

    logApiSuccess(
      req,
      200,
      { count: cleanData?.length || 0 },
      "Resolved Complaint List for Supervisor completed",
    );
    return res.ok({ data: cleanData, pagination });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Resolved Complaint List for Supervisor search error",
    );
    return next(error);
  }
}

async function resolvedListbySup(req, res, next) {
  try {
    const { ulbid, fromDate, toDate, status, page = 0, limit = 10 } = req.query;
    const result = await getrslvdListbySupService(
      ulbid,
      fromDate,
      toDate,
      status,
      page,
      limit,
    );

    // Sanitize the result to avoid circular references
    const cleanData = (result.data || []).map((row) => {
      const cleanRow = {
        PRBHAG: row.PRBHAG,
        PRBHAGID: row.PRBHAGID,
        SUPERWISER_ID: row.SUPERWISER_ID,
        SUPERWISER: row.SUPERWISER,
        LOCATION: row.LOCATION,
        VAR_COMPLAINT_STATUS: row.VAR_COMPLAINT_STATUS,
        VAR_COMPLAINT_CITIZNAME: row.VAR_COMPLAINT_CITIZNAME,
        NUM_COMPLAINT_TOILET: row.NUM_COMPLAINT_TOILET,
        MOBILENO: row.MOBILENO,
        COMPLAINT_DATE: row.COMPLAINT_DATE,
        VAR_COMPLAINT_REMARK: row.VAR_COMPLAINT_REMARK,
        VAR_CTPTSANITINSPCTOR_NAME: row.VAR_CTPTSANITINSPCTOR_NAME,
        ULBID: row.ULBID,
        SI_ID: row.SI_ID,
        COMPLAINTID: row.COMPLAINTID,
        VAR_COMPAINT_SUPERREMARK: row.VAR_COMPAINT_SUPERREMARK,
        VAR_COMPAINT_SIREMARK: row.VAR_COMPAINT_SIREMARK,
      };

      // Only include image fields if they are strings (base64) and not LOB objects
      if (typeof row.BLOB_COMPLAINT_UNITIMG1 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG1 = row.BLOB_COMPLAINT_UNITIMG1;

      if (typeof row.BLOB_COMPLAINT_UNITIMG2 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG2 = row.BLOB_COMPLAINT_UNITIMG2;

      if (typeof row.BLOB_COMPLAINT_UNITIMG3 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG3 = row.BLOB_COMPLAINT_UNITIMG3;

      if (typeof row.BLOB_COMPLAINT_UNITIMG4 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG4 = row.BLOB_COMPLAINT_UNITIMG4;

      if (typeof row.BLOB_COMPLAINT_UNITIMG5 === "string")
        cleanRow.BLOB_COMPLAINT_UNITIMG5 = row.BLOB_COMPLAINT_UNITIMG5;

      if (typeof row.SOLVCOMPIMG1 === "string")
        cleanRow.SOLVCOMPIMG1 = row.SOLVCOMPIMG1;

      if (typeof row.SOLVCOMPIMG2 === "string")
        cleanRow.SOLVCOMPIMG2 = row.SOLVCOMPIMG2;

      if (typeof row.SOLVCOMPIMG3 === "string")
        cleanRow.SOLVCOMPIMG3 = row.SOLVCOMPIMG3;

      return cleanRow;
    });

    const pagination = {
      page: result.pagination?.page || 0,
      limit: result.pagination?.limit || 10,
      total: result.pagination?.total || 0,
      totalPages: result.pagination?.totalPages || 0,
    };

    logApiSuccess(
      req,
      200,
      { count: cleanData?.length || 0 },
      "Resolved Complaint List for Supervisor completed",
    );
    return res.ok({ data: cleanData, pagination });
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Resolved Complaint List for Supervisor search error",
    );
    return next(error);
  }
}

async function getSolvedComplaintImagesCon(req, res, next) {
  try {
    const { ulbid, siid, complaintid } = req.query;
    const rows = await getSolvedComplaintImagesService(
      ulbid,
      siid,
      complaintid,
    );
    logApiSuccess(
      req,
      200,
      { count: rows?.length || 0 },
      "Solved complaint images retrieved successfully",
    );
    return res.ok(rows);
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Error retrieving solved complaint images",
    );
    return next(error);
  }
}

async function getSupervisorStatusCon(req, res, next) {
  try {
    const statuses = await getSupervisorStatusService();
    logApiSuccess(
      req,
      200,
      { count: statuses?.length || 0 },
      "Supervisor status options retrieved successfully",
    );
    return res.ok(statuses);
  } catch (error) {
    logApiError(
      req,
      500,
      error.message,
      "Error retrieving supervisor status options",
    );
    return next(error);
  }
}

module.exports = {
  authComplaint,
  getCompListForSup,
  getCompListForSI,
  getImagesCon,
  resolvedListbyVendor,
  resolvedListbySup,
  getSolvedComplaintImagesCon,
  getSupervisorStatusCon,
  resolvedListbyVendorList,
};

async function complaintStatusUpdate(req, res, next) {
  try {
    const body = req.body || {};

    const payload = {
      userId: body.userId || req.user?.userId,
      mode: body.mode,
      compaintId:
        body.complaintId ??
        body.compaintId ??
        body.in_compaintid ??
        body.compaintid,
      superwiserId: body.superwiserId,
      superstatus: body.superstatus,
      superremark: body.superremark,
      vendorRemark: body.vendorRemark,
      SIID: body.SIID || body.siId,
      si_status: body.si_status,
      si_remrk: body.si_remrk,
      wardno: body.wardno,
      ulbid: body.ulbid,
      vendorId: body.vendorId,
      solvedImg1: body.solvedImg1,
      solvedImg2: body.solvedImg2,
      solvedImg3: body.solvedImg3,
      reworkflag: body.reworkflag,
      reworkId: body.reworkId,
    };

    const out = await complaintStatusUpdateService(payload);
    const isSuccess = String(out.errorCode) === "9999";

    if (isSuccess) {
      logApiSuccess(req, 200, {}, "Complaint status update succeeded");
    } else {
      logApiError(req, 400, out.message, "Complaint status update failed");
    }

    auditLog({
      action: "CTPT_COMPLAINT_STATUS_UPDATE",
      actor: req.user?.userId || payload.userId || "system",
      module: "authComplaint",
      status: isSuccess ? "SUCCESS" : "FAILED",
      details: {
        outErrorCode: out.errorCode,
        outErrorMsg: out.message,
      },
      requestMeta: requestMeta(req),
    });

    return res.ok(out);
  } catch (error) {
    logApiError(req, 500, error.message, "Complaint status update error");
    return next(error);
  }
}

module.exports.complaintStatusUpdate = complaintStatusUpdate;
