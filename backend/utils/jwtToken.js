const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'posh_puzzle_super_secret_jwt_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const createToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

const sendToken = (user, statusCode, res, message = 'Success') => {
  const token = createToken(user._id || user.id, user.role);

  // Cookie options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  // Strip password from user object
  const userPayload = { ...user };
  delete userPayload.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    user: userPayload,
  });
};

module.exports = {
  createToken,
  sendToken,
  JWT_SECRET,
};
