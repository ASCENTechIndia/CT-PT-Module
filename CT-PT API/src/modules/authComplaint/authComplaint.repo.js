const oracledb = require("oracledb");
const { executeQuery } = require("../../db/queryExecutor");
const { executeProcedure } = require("../../db/procedureExecutor");

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

async function lobToBase64(lob) {
  if (!lob) return null;

  return new Promise((resolve, reject) => {
    const chunks = [];

    lob.on("data", (chunk) => {
      chunks.push(chunk);
    });

    lob.on("end", () => {
      const buffer = Buffer.concat(chunks);

      resolve(buffer.toString("base64"));
    });

    lob.on("error", (err) => {
      reject(err);
    });
  });
}

async function compListforSupRepo(ulbid, page = 1, limit = 10) {
  const offset = (Number(page) - 1) * Number(limit);
  let sql = ` SELECT * FROM ( SELECT e.num_empctptentry_id, e.dat_empctptentry_date, 
   e.var_empctptentry_latitude, e.num_empctptentry_id AS uniqueid,
    u.var_user_username AS username, e.var_empctptentry_userid AS userid, e.var_empctptentry_longitude,
     e.num_empctptentry_toiletid, e.num_empctptentry_stageid, e.var_empctptentry_remark,
      e.dat_empctptentry_insdate, e.num_empctptentry_ulbid, e.bolb_empctptentry_image,
       e.bolb_empctptentry_image2, e.bolb_empctptentry_image3, ctpt.num_ctpttype_wardid, 
       ctpt.var_ctpttype_toiletlocation, ctpt.var_ctpttype_femaleseats, ctpt.var_ctpttype_maleseats, 
       ctpt.var_ctpttype_totalseats, ctpt.var_ctpttype_status, ctpt.var_ctpttype_username,
        st.var_ctptstage_status, st.var_ctptstage_name, ROW_NUMBER() 
        OVER ( PARTITION BY e.var_empctptentry_userid, e.num_empctptentry_toiletid,
         TRUNC(e.dat_empctptentry_date) ORDER BY e.dat_empctptentry_date DESC ) AS rn
          FROM aorts_empctptentry_mst e 
          INNER JOIN admins.aoma_user_def u ON u.num_user_userid = e.var_empctptentry_userid
           LEFT JOIN aorts_ctptlist_mas ctpt ON ctpt.num_ctpttype_id = e.num_empctptentry_toiletid 
           LEFT JOIN aorts_ctptstage_mas st ON st.num_ctptstage_id = e.num_empctptentry_stageid 
           WHERE e.num_empctptentry_stageid = 3 ) WHERE rn = 1 AND num_empctptentry_ulbid = :ulbid 
           ORDER BY num_empctptentry_id DESC 
           OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY `;
  const binds = {
    ulbid: Number(ulbid),
    offset: Number(offset),
    limit: Number(limit),
  };
  const result = await executeQuery(sql, binds);
  const rows = result.rows || []; // Convert LOB images to base64
  for (const row of rows) {
    row.BOLB_EMPCTPTENTRY_IMAGE = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE,
    );
    row.BOLB_EMPCTPTENTRY_IMAGE2 = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE2,
    );
    row.BOLB_EMPCTPTENTRY_IMAGE3 = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE3,
    );
  } // Total count query
  const countSql = ` SELECT COUNT(*) AS total FROM ( SELECT ROW_NUMBER() OVER 
                ( PARTITION BY e.var_empctptentry_userid, e.num_empctptentry_toiletid, TRUNC(e.dat_empctptentry_date)
                  ORDER BY e.dat_empctptentry_date DESC ) AS rn,
                 e.num_empctptentry_ulbid FROM aorts_empctptentry_mst e WHERE e.num_empctptentry_stageid = 3 )
                  WHERE rn = 1 AND num_empctptentry_ulbid = :ulbid `;
  const countResult = await executeQuery(countSql, { ulbid: Number(ulbid) });
  const total = countResult.rows?.[0]?.TOTAL || 0;
  return {
    data: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

async function compListforSIRepo(ulbid, page = 1, limit = 10) {
  const offset = (Number(page) - 1) * Number(limit);
  let sql = ` SELECT * FROM ( SELECT e.num_empctptentry_id, e.dat_empctptentry_date, e.var_empctptentry_latitude,
     e.num_empctptentry_id AS uniqueid, u.var_user_username AS username, 
     e.var_empctptentry_userid AS userid, e.var_empctptentry_longitude, 
     e.num_empctptentry_toiletid, e.num_empctptentry_stageid, e.var_empctptentry_remark,
      e.dat_empctptentry_insdate, e.num_empctptentry_ulbid, e.bolb_empctptentry_image,
       e.bolb_empctptentry_image2, e.bolb_empctptentry_image3, ctpt.num_ctpttype_wardid,
        ctpt.var_ctpttype_toiletlocation, ctpt.var_ctpttype_femaleseats, ctpt.var_ctpttype_maleseats,
         ctpt.var_ctpttype_totalseats, ctpt.var_ctpttype_status, ctpt.var_ctpttype_username, 
         st.var_ctptstage_status, st.var_ctptstage_name, var_empctptentry_supflag, 
         var_empctptentry_siflag, ROW_NUMBER() OVER ( PARTITION BY e.var_empctptentry_userid, 
         e.num_empctptentry_toiletid, TRUNC(e.dat_empctptentry_date)
          ORDER BY e.dat_empctptentry_date DESC ) AS rn FROM aorts_empctptentry_mst e 
          INNER JOIN admins.aoma_user_def u ON u.num_user_userid = e.var_empctptentry_userid
           LEFT JOIN aorts_ctptlist_mas ctpt ON ctpt.num_ctpttype_id = e.num_empctptentry_toiletid 
           LEFT JOIN aorts_ctptstage_mas st ON st.num_ctptstage_id = e.num_empctptentry_stageid 
           WHERE e.num_empctptentry_stageid = 3 ) WHERE rn = 1 AND num_empctptentry_ulbid = :ulbid 
           ORDER BY num_empctptentry_id DESC OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY `;
  const binds = {
    ulbid: Number(ulbid),
    offset: Number(offset),
    limit: Number(limit),
  };
  const result = await executeQuery(sql, binds);
  const rows = result.rows || []; // Convert LOB images to base64
  for (const row of rows) {
    row.BOLB_EMPCTPTENTRY_IMAGE = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE,
    );
    row.BOLB_EMPCTPTENTRY_IMAGE2 = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE2,
    );
    row.BOLB_EMPCTPTENTRY_IMAGE3 = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE3,
    );
  } // Total count query
  const countSql = ` SELECT COUNT(*) AS total FROM ( SELECT ROW_NUMBER() OVER
                  ( PARTITION BY e.var_empctptentry_userid, e.num_empctptentry_toiletid, 
                 TRUNC(e.dat_empctptentry_date) ORDER BY e.dat_empctptentry_date DESC ) AS rn,
                  e.num_empctptentry_ulbid FROM aorts_empctptentry_mst e WHERE e.num_empctptentry_stageid = 3 ) 
                  WHERE rn = 1 AND num_empctptentry_ulbid = :ulbid `;
  const countResult = await executeQuery(countSql, { ulbid: Number(ulbid) });
  const total = countResult.rows?.[0]?.TOTAL || 0;
  return {
    data: rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

async function getImages(ulbid, toiletId, applid) {
  let sql = `
SELECT num_empctptentry_id, dat_empctptentry_date, num_empctptentry_stageid,
        var_empctptentry_remark, num_empctptentry_ulbid,
        bolb_empctptentry_image,
        bolb_empctptentry_image2, bolb_empctptentry_image3,
        var_ctptstage_status, var_ctptstage_name
        FROM aorts_empctptentry_mst
        INNER JOIN admins.aoma_user_def ON num_user_userid = var_empctptentry_userid
        LEFT JOIN aorts_ctptlist_mas ctpt ON ctpt.num_ctpttype_id = num_empctptentry_toiletid
        LEFT JOIN aorts_ctptstage_mas st ON st.num_ctptstage_id = num_empctptentry_stageid
        WHERE num_empctptentry_ulbid= :ulbid 
        AND num_empctptentry_toiletid= :toiletId
AND TRUNC(dat_empctptentry_insdate)= (SELECT TRUNC(dat_empctptentry_date) FROM aorts_empctptentry_mst WHERE num_empctptentry_id= :applid )
ORDER BY num_empctptentry_stageid ASC
  `;

  const binds = {
    ulbid: Number(ulbid),
    toiletId: Number(toiletId),
    applid: Number(applid),
  };

  const result = await executeQuery(sql, binds);

  const rows = result.rows || [];

  for (const row of rows) {
    row.BOLB_EMPCTPTENTRY_IMAGE = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE,
    );

    row.BOLB_EMPCTPTENTRY_IMAGE2 = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE2,
    );

    row.BOLB_EMPCTPTENTRY_IMAGE3 = await lobToBase64(
      row.BOLB_EMPCTPTENTRY_IMAGE3,
    );
  }

  return rows;
}

module.exports = {
  authComplaintRepo,
  compListforSupRepo,
  compListforSIRepo,
  getImages,
};
