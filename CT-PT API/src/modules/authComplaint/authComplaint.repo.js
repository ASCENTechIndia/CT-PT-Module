const oracledb = require('oracledb');
const { executeProcedure } = require('../../db/procedureExecutor');

async function authComplaintRepo(payload) {
  const statement = `
    BEGIN
      aorts.aorts_empctptauth_ins(
        :in_UserId,
        :in_applid,
        :in_ULBId,
        :in_mode,
        :in_status,
        :in_Remark,
        :Out_ErrorCode,
        :Out_ErrorMsg
      );
    END;
  `;

  const binds = {
    in_UserId: payload.userId,
    in_applid: Number(payload.applId),
    in_ULBId: Number(payload.ulbId),
    in_mode: Number(payload.mode),
    in_status: payload.status,
    in_Remark: payload.remark,
    Out_ErrorCode: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
    Out_ErrorMsg: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
      maxSize: 1000,
    },
  };

  const result = await executeProcedure({ statement, binds, useTx: false });
  const out = result.outBinds;

  return {
    errorCode: out.Out_ErrorCode,
    message: out.Out_ErrorMsg,
  };
}

module.exports = {
  authComplaintRepo,
};