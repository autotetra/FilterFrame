const client = require("../config/integrations/clientFactory");
const { DEFAULT_CLIENT_TYPE } = require("../config/constants");

const type = process.env.CLIENT_TYPE || DEFAULT_CLIENT_TYPE;

module.exports = { client, type };
