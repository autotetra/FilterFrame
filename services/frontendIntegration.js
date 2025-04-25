const notionClient = require("../config/integrations/notionClient");

module.exports = {
  client: notionClient,
  type: "notion", // Info that can be used to check the integration type
};
