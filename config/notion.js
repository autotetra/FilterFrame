const { Client } = require("@notionhq/client");

// Initilize Notion client with the integration token from .env
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

module.exports = notion;
