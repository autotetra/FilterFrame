// config/integrations/client.notion.js
require("dotenv").config();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.CLIENT_API_KEY });

module.exports = {
  queryAssignedRecords: async (userEmail) => {
    const databaseId = process.env.CLIENT_DATABASE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Assignee",
        email: {
          equals: userEmail,
        },
      },
    });

    return response.results;
  },

  updatePage: async (pageId, properties) => {
    return await notion.pages.update({
      page_id: pageId,
      properties,
    });
  },

  createPage: async (properties) => {
    return await notion.pages.create({
      parent: {
        database_id: process.env.CLIENT_DATABASE_ID,
      },
      properties,
    });
  },

  archivePage: async (pageId) => {
    return await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
  },
};
