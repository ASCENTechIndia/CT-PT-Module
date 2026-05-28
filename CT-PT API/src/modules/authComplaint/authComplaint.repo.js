const oracledb = require('oracledb');
const { executeQuery } = require('../../db/queryExecutor');
const { executeProcedure } = require('../../db/procedureExecutor');

async function compListforSupRepo(ulbid) {
  let sql = `
  SELECT *
  FROM (SELECT e.num_empctptentry_id, e.dat_empctptentry_date,
               e.var_empctptentry_latitude, e.num_empctptentry_id AS uniqueid,
               u.var_user_username AS username,
               e.var_empctptentry_userid AS userid,
               e.var_empctptentry_longitude, e.num_empctptentry_toiletid,
               e.num_empctptentry_stageid, e.var_empctptentry_remark,
               e.dat_empctptentry_insdate, e.num_empctptentry_ulbid,
               e.bolb_empctptentry_image, e.bolb_empctptentry_image2,
               e.bolb_empctptentry_image3, ctpt.num_ctpttype_wardid,
               ctpt.var_ctpttype_toiletlocation,
               ctpt.var_ctpttype_femaleseats, ctpt.var_ctpttype_maleseats,
               ctpt.var_ctpttype_totalseats, ctpt.var_ctpttype_status,
               ctpt.var_ctpttype_username, st.var_ctptstage_status,
               st.var_ctptstage_name,
               ROW_NUMBER () OVER (PARTITION BY e.var_empctptentry_userid, e.num_empctptentry_toiletid, TRUNC (e.dat_empctptentry_date) ORDER BY e.dat_empctptentry_date DESC) AS rn
          FROM aorts_empctptentry_mst e
               INNER JOIN admins.aoma_user_def u
                   ON u.num_user_userid = e.var_empctptentry_userid
               LEFT JOIN aorts_ctptlist_mas ctpt
                   ON ctpt.num_ctpttype_id = e.num_empctptentry_toiletid
               LEFT JOIN aorts_ctptstage_mas st
                   ON st.num_ctptstage_id = e.num_empctptentry_stageid
         WHERE     1 = 1 and num_empctptentry_stageid=3
               AND var_empctptentry_supflag IS NULL
               AND num_empctptentry_toiletid IN (1, 2)  )
WHERE rn = 1 and num_empctptentry_ulbid = :ulbid `;
  const binds = { ulbid: Number(ulbid) };
  const result = await executeQuery(sql, binds);
  return result.rows || [];
}


module.exports = { compListforSupRepo };
