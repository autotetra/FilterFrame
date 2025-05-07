const {
  getAllRecords: getRecordsFromService,
  updateRecord: updateRecordInService,
  deleteRecord: deleteRecordInService,
  createRecord: createRecordInService,
} = require("../core/recordService");

const { sendSuccess, sendError } = require("../services/responseService");
const { type } = require("../core/integrationBridge");

const getAllRecords = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const records = await getRecordsFromService(userEmail);

    return sendSuccess(res, "Records fetched successfully", records);
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

    const properties = {
      Name: {
        title: [{ text: { content: name } }],
      },
      Status: {
        status: { name: status },
      },
      Assignee: {
        email: userEmail,
      },
    };

    const result = await updateRecordInService(pageId, properties);
    return sendSuccess(res, "Record updated successfully", result);
  } catch (err) {
    console.error("Update record error:", err);
    return sendError(res, "Update failed", 500, err.message);
  }
};

const deleteRecord = async (req, res) => {
  try {
    const pageId = req.params.id;
    const result = await deleteRecordInService(pageId);
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

    const properties = {
      Name: {
        title: [{ text: { content: name } }],
      },
      Status: {
        status: { name: status },
      },
      Assignee: {
        email: userEmail,
      },
    };

    const newPage = await createRecordInService(properties);
    return sendSuccess(res, "Record created successfully", newPage, 201);
  } catch (err) {
    console.error("Error creating record:", err);
    return sendError(res, "Failed to create record", 500, err.message);
  }
};

module.exports = {
  getAllRecords,
  updateRecord,
  deleteRecord,
  createRecord,
};
