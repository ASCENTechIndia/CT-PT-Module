const { loginWithStoredProcedure } = require('./auth.repo');

async function loginUser(userId, password) {
  return loginWithStoredProcedure(userId, password);
}

module.exports = {
  loginUser,
};
