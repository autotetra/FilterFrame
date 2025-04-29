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
    res.json(response.results);
  } catch (err) {
    console.error("Error fetching records:", err);
  }
};

module.exports = { getAllRecords };
