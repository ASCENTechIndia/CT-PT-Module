const { loginUser } = require('./auth.service');
const { logApiSuccess, logApiError } = require('../../utils/log');
const { decryptPassword } = require('../../utils/login-password-crypto');

async function login(req, res, next) {
  try {
    const payload = req.body;

    let decryptedPassword;
    try {
      decryptedPassword = decryptPassword(payload.password);
    } catch (_error) {
      logApiError(req, 400, 'Invalid encrypted password', 'Login failed: invalid encrypted password payload');
      return res.fail('Invalid encrypted password', 400);
    }

    const normalizedUserId = payload.userId.startsWith('E')
      ? payload.userId
      : `E${payload.userId}`;

    const result = await loginUser(normalizedUserId, decryptedPassword);

    if (!result.success) {
      logApiError(req, 401, result.message, `Login failed for user: ${normalizedUserId}`);
      return res.fail(result.message, 401, { errorCode: result.errorCode });
    }

    logApiSuccess(req, 200, { userId: result.user.userId, userName: result.user.userName }, `Login successful for user: ${result.user.userName}`);

    return res.ok({ token: result.token, user: result.user });
  } catch (error) {
    logApiError(req, 500, error.message, 'Login controller error');
    return next(error);
  }
}

module.exports = {
  login,
};
