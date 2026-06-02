const oracledb = require("oracledb");
const { getConnection }  = require("../../config/db");
const { logApiSuccess, logApiError } = require('../../utils/log');
// const logger = require("../../libs/logger");

async function isValidToken(req, res) {
  const tokenno =
    req.cookies?.access_token ||
    req.body?.in_tokenno;

  logApiSuccess(
    req,
    200,
    {
      hasToken: !!tokenno,
      tokenLength: tokenno?.length,
      tokenPreview: tokenno?.substring(0, 20),
      cookies: req.cookies,
    },
    "Validate Token Request Received"
  );

  let connection;

  try {
    connection = await getConnection();

    const binds = {
      in_mode: 2,
      in_userid: "",
      in_UserPassword: "",
      in_tokenno: tokenno,
      in_ipaddress: "",
      in_requestloginurl: "",
      in_requestfromurl: "",
      in_deptFlag: "",
      out_ErrorCode: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
      out_ErrorMsg: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 3000,
      },
      out_userid: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 3000,
      },
      out_encpassword: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 3000,
      },
    };

    const result = await connection.execute(
      `BEGIN
         admins.aoma_singlelogintoken_ins(
           :in_mode,
           :in_userid,
           :in_UserPassword,
           :in_tokenno,
           :in_ipaddress,
           :in_requestloginurl,
           :in_requestfromurl,
           :in_deptFlag,
           :out_ErrorCode,
           :out_ErrorMsg,
           :out_userid,
           :out_encpassword
         );
       END;`,
      binds
    );

    logApiSuccess(
      req,
      200,
      result.outBinds,
      "Validate Token Procedure Response"
    );

    return res.status(200).json({
      success: true,
      outBinds: result.outBinds,
    });

  } catch (err) {

    logApiError(
      req,
      500,
      err,
      "Validate Token Failed"
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = isValidToken;