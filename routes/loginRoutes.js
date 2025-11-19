const express = require("express");
const router = express.Router();
const { loginUser, getAllUsers } = require("../controllers/loginController");

// POST đăng nhập
router.post("/", loginUser);

// GET danh sách user
router.get("/", getAllUsers);

module.exports = router;