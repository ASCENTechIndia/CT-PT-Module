const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { executeQuery } = require('../../db/queryExecutor');
const { executeProcedure } = require('../../db/procedureExecutor');
const { config } = require('../../config/env');

async function loginWithStoredProcedure(userId, password, corpId , ulbId , logFlag = 'Y') {
  console.log('Login attempt for userId:', userId, 'CorpId:', corpId, 'ULBId:', ulbId, 'LogFlag:', logFlag, 'Password provided:', password);
  const plsql = `
    BEGIN
      aorts.aorts_login_ins(
        :in_CorpId,
        :in_username,
        :in_password,
        :in_ulbID,
        :in_logflag,
        :out_ulbid,
        :out_userUniqueId,
        :out_userFullName,
        :out_lastlogin,
        :out_lastlogout,
        :out_errcode,
        :out_errmsg
      );
    END;
  `;

  const binds = {
    in_CorpId: corpId,
    in_username: userId,
    in_password: password,
    in_ulbID: ulbId,
    in_logflag: logFlag,
    out_ulbid: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_userUniqueId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_userFullName: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 },
    out_lastlogin: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
    out_lastlogout: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 },
    out_errcode: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    out_errmsg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
  };

  const result = await executeProcedure({ statement: plsql, binds, useTx: false });
  const out = result.outBinds;

  const errorCode = String(out.out_errcode ?? '0');
  if (errorCode !== '9999') {
    return {
      success: false,
      errorCode,
      message: out.out_errmsg || 'Login failed',
    };
  }

  const user = {
    userId,
    userUniqueId: out.out_userUniqueId,
    userFullName: out.out_userFullName,
    ulbId: out.out_ulbid,
    lastLogin: out.out_lastlogin,
    lastLogout: out.out_lastlogout,
  };

  const token = jwt.sign(
    {
      sub: user.userId,
      userId: user.userId,
      userUniqueId: user.userUniqueId,
      ulbId: user.ulbId,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    success: true,
    token,
    user,
  };
}

module.exports = {
  loginWithStoredProcedure,
};
