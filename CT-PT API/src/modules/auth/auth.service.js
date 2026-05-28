const { loginWithStoredProcedure } = require('./auth.repo');

async function loginUser(userId, password, corpId , ulbId , logFlag = 'Y') {
  return loginWithStoredProcedure(userId, password, corpId, ulbId, logFlag);
}

module.exports = {
  loginUser,
};
