const crypto = require('crypto');
const bcrypt = require('bcryptjs');

function generateRandomToken(tokenSize) {
  return crypto.randomBytes(tokenSize).toString('hex').slice(0, tokenSize);
}

async function hash(string) {
  return bcrypt.hash(string, 10);
}

async function compare(string, hashedString) {
  return bcrypt.compare(string, hashedString);
}

module.exports = { generateRandomToken, hash, compare };
