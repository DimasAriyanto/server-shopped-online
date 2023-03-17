const {
  createJWT,
  isTokenValid,
} = require('./jwt');

const {
  createTokenUser,
  createTokenCustomers
} = require('./createTokenUser');

module.exports = {
  createJWT,
  isTokenValid,
  createTokenUser,
  createTokenCustomers
};