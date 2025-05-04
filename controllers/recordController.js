const { client, type } = require("../services/frontEndIntegration");

const getAllRecords = async (req, res) => {
  try {
    if (type !== "notion") {
      return res.status(400).json({ message: "Unsupported integration type" });
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
    res.status(200).json({
      status: "success",
      message: "Records fetched successfully",
      data: response.results,
    });
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch records",
      error: err.message,
    });
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
    res.status(200).json({
      status: "success",
      message: "Record updated successfully",
      data: response,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Update failed", error: err.mesage });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const pageId = req.params.id;

    await client.pages.update({
      page_id: pageId,
      archived: true, // Notion uses "archived" to mark a page as deleted
    });

    res.status(200).json({
      status: "success",
      message: "Recrord deleted succesfully",
      data: { id: pageId },
    });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete record",
      error: err.message,
    });
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

    res.status(201).json({
      status: "success",
      message: "Record created successfully",
      data: newPage,
    });
  } catch (err) {
    console.error("Error creating record:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to create record",
      error: err.message,
    });
  }
};

module.exports = { getAllRecords, updateRecord, deleteRecord, createRecord };
