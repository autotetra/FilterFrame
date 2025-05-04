const { isAdmin } = require("../middleware/adminMiddleware");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  getPendingUsers,
  updateUserStatus,
} = require("../controllers/adminController");

router.get("/pending-users", authenticateToken, isAdmin, getPendingUsers);

router.patch("/users/:id/status", authenticateToken, isAdmin, updateUserStatus);
