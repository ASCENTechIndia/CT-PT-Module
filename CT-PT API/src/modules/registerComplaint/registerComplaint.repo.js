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

module.exports = { repoWardList, repoToiletList, repoComplaintTypeList };
