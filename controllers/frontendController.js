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
    res.status(200)({
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
    const { properties } = req.body;

    const response = await client.pages.update({
      page_id: pageId,
      properties: properties,
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

module.exports = { getAllRecords, updateRecord };
