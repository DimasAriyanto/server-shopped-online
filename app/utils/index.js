const {
  createJWT,
  isTokenValid,
  createRefreshJWT,
  isTokenValidRefreshToken,
} = require('./jwt');

const {
  createTokenUser,
  createTokenCustomers
} = require('./createTokenUser');

module.exports = {
  createJWT,
  isTokenValid,
  createRefreshJWT,
  isTokenValidRefreshToken,
  createTokenUser,
  createTokenCustomers
};