const { client, type } = require("../core/integrationBridge");
const { sendSuccess, sendError } = require("../services/responseService");

const getAllRecords = async (req, res) => {
  try {
    if (type !== "notion") {
      return sendError(res, "Unsupported integration type", 400);
    }

    const databaseId = process.env.NOTION_DATABASE_ID;
    const userEmail = req.user.email;

    const response = await client.databases.query({
      database_id: databaseId,
      filter: {
        property: "Assignee",
        email: {
          equals: userEmail,
        },
      },
    });

    return sendSuccess(res, "Records fetched successfully", response.results);
  } catch (err) {
    console.error("Error fetching records:", err);
    return sendError(res, "Failed to fetch records", 500, err.message);
  }
};

const updateRecord = async (req, res) => {
  try {
    const pageId = req.params.id;
    const { name, status } = req.body;
    const userEmail = req.user.email;

    const response = await client.pages.update({
      page_id: pageId,
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Status: {
          status: {
            name: status,
          },
        },
        Assignee: {
          email: userEmail,
        },
      },
    });

    return sendSuccess(res, "Record updated successfully", response);
  } catch (err) {
    console.error("Update record error:", err);
    return sendError(res, "Update failed", 500, err.message);
  }
};

const deleteRecord = async (req, res) => {
  try {
    const pageId = req.params.id;

    await client.pages.update({
      page_id: pageId,
      archived: true, // Notion uses "archived" to mark a page as deleted
    });

    return sendSuccess(res, "Record deleted successfully", { id: pageId });
  } catch (err) {
    console.error("Error deleting record:", err);
    return sendError(res, "Failed to delete record", 500, err.message);
  }
};

const createRecord = async (req, res) => {
  try {
    const { name, status } = req.body;
    const userEmail = req.user.email;

    const newPage = await client.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Status: {
          status: {
            name: status,
          },
        },
        Assignee: {
          email: userEmail,
        },
      },
    });

    return sendSuccess(res, "Record created successfully", newPage, 201);
  } catch (err) {
    console.error("Error creating record:", err);
    return sendError(res, "Failed to create record", 500, err.message);
  }
};

module.exports = { getAllRecords, updateRecord, deleteRecord, createRecord };
