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

module.exports = { repoWardList ,};
