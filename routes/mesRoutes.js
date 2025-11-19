const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// Thêm liên hệ mới
router.post("/", async (req, res) => {
  const { name, email, phone, content } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("name", sql.NVarChar(255), name)
      .input("email", sql.NVarChar(255), email)
      .input("phone", sql.NVarChar(50), phone)
      .input("content", sql.NVarChar(sql.MAX), content || null)
      .query(`
        INSERT INTO mess (name, email, phone, content)
        VALUES (@name, @email, @phone, @content)
      `);
    res.status(200).json({ message: "Gửi liên hệ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Lấy danh sách liên hệ
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT * FROM mess ORDER BY created_at DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Cập nhật trạng thái đã xem
router.put("/:id/viewed", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("UPDATE mess SET status = 1 WHERE id = @id");
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
