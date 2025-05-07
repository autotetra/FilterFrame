// core/recordService.js
const { client } = require("../core/integrationBridge");

const getAllRecords = async (userEmail) => {
  return await client.queryAssignedRecords(userEmail);
};

const updateRecord = async (pageId, properties) => {
  return await client.updatePage(pageId, properties);
};

const createRecord = async (properties) => {
  return await client.createPage(properties);
};

const deleteRecord = async (pageId) => {
  return await client.archivePage(pageId);
};

module.exports = {
  getAllRecords,
  updateRecord,
  createRecord,
  deleteRecord,
};
