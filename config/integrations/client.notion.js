const { Client } = require("@notionhq/client");
const notion = new Client({
  auth: process.env.CLIENT_API_KEY,
});
const databaseId = process.env.CLIENT_DATABASE_ID;

const queryAssigneeRecords = async (userEmail) => {
  return await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Assignee",
      email: {
        equals: userEmail,
      },
    },
  });
};

const updatePage = async (pageId, properties) => {
  return await notion.pages.update({
    page_id: pageId,
    properties,
  });
};

const createPage = async (properties) => {
  return await notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
};

const archivePage = async (pageId) => {
  return await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
};

module.exports = {
  queryAssigneeRecords,
  updatePage,
  createPage,
  archivePage,
};
