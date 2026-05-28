const oracledb = require('oracledb');
const { executeQuery } = require('../../db/queryExecutor');
const { executeProcedure } = require('../../db/procedureExecutor');


async function repoWardList(ulbid) {
  let sql = `
   SELECT DISTINCT num_ctpttype_wardid
                FROM aorts_ctptlist_mas where num_ctpttype_ulbid=:ulbid and
                var_ctpttype_status='Y'
                order by num_ctpttype_wardid `;
  const binds = { ulbid: Number(ulbid) };
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function repoToiletList(ulbid, wardid) {
  let sql = ` select var_ctpttype_toiletlocation from aorts_ctptlist_mas where
                 num_ctpttype_wardid=:wardid and num_ctpttype_ulbid=:ulbid and
                var_ctpttype_status='Y' `;
  const binds = { ulbid: Number(ulbid), wardid: Number(wardid) };
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}

async function repoComplaintTypeList(ulbid) {
  const sql = `
    SELECT num_ctptcompltype_id,
           var_ctptcompltype_name
      FROM aorts_ctptcompltype_mas
     WHERE num_ctptcompltype_ulbid = :ulbid
       AND var_ctptcompltype_flag = 'Y'
     ORDER BY num_ctptcompltype_id`;
  const binds = { ulbid: Number(ulbid) };
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}


async function regComplaintRepo(payload) {

  const statement = `
    BEGIN
      aorts.aorts_citizencomplaint_ins(
        :in_UserId,
        :in_ULBId,
        :in_wardid,
        :in_toiletid,
        :in_complainttypeid,
        :in_citizenmn,
        :in_mobileno,
        :in_unitno,
        :in_complaintstatus,
        :in_complntremark,
        :in_unitimg1,
        :in_unitimg2,
        :in_unitimg3,
        :in_unitimg4,
        :in_unitimg5,
        :OUT_ERRORCODE,
       :OUT_ERRORMSG

 );
    END;
  `;
    const binds = {
    // in_UserId: payload.userId,
    in_UserId: payload.userId,
    in_ULBId: payload.ulbId,
    in_wardid: payload.wardId,
    in_toiletid: payload.toiletId,
    in_complainttypeid: payload.complaintTypeId,
    in_citizenmn: payload.citizenMn,
    in_mobileno: payload.mobileNo,
    in_unitno: payload.unitNo,
    in_complaintstatus: payload.complaintStatus,
    in_complntremark: payload.complntRemark,
  
  in_unitimg1: {
    val: payload.unitImg1
      ? Buffer.from(payload.unitImg1, "base64")
      : null,
    type: oracledb.BLOB
  },

  in_unitimg2: {
    val: payload.unitImg2
      ? Buffer.from(payload.unitImg2, "base64")
      : null,
    type: oracledb.BLOB
  },

  in_unitimg3: {
    val: payload.unitImg3
      ? Buffer.from(payload.unitImg3, "base64")
      : null,
    type: oracledb.BLOB
  },

  in_unitimg4: {
    val: payload.unitImg4
      ? Buffer.from(payload.unitImg4, "base64")
      : null,
    type: oracledb.BLOB
  },

  in_unitimg5: {
    val: payload.unitImg5
      ? Buffer.from(payload.unitImg5, "base64")
      : null,
    type: oracledb.BLOB
  },
    
    OUT_ERRORCODE: {
  dir: oracledb.BIND_OUT,
  type: oracledb.NUMBER
},

OUT_ERRORMSG: {
  dir: oracledb.BIND_OUT,
  type: oracledb.STRING,
  maxSize: 1000
}

  };
    const result = await executeProcedure({
    statement,
    binds,
    useTx: false
  });

  const out = result.outBinds;

 return {
  errorCode: out.OUT_ERRORCODE,
  message: out.OUT_ERRORMSG
};
}

module.exports = { repoWardList, repoToiletList, repoComplaintTypeList, regComplaintRepo };
