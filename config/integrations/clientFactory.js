const path = require("path");
const { DEFAULT_CLIENT_TYPE } = require("../constants");

const clientType = process.env.CLIENT_TYPE || DEFAULT_CLIENT_TYPE;

try {
  const client = require(path.join(__dirname, `client.${clientType}`));
  module.exports = client;
} catch (err) {
  console.error(`❌ Failed to load client for type: ${clientType}`);
  throw err;
}
