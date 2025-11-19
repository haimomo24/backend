const { poolPromise, sql } = require("../db");

// POST /api/contact
const submitContact = async (req, res) => {
  const { name, phone, email, address, date, room_type } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "Vui lòng điền đủ thông tin bắt buộc" });
  }

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("phone", sql.NVarChar, phone)
      .input("email", sql.NVarChar, email)
      .input("address", sql.NVarChar, address || "")
      .input("date", sql.NVarChar, date || "")
      .input("room_type", sql.NVarChar, room_type || "")
      .query(`INSERT INTO contact (name, phone, email, address, date, room_type) 
              VALUES (@name, @phone, @email, @address, @date, @room_type)`);

    res.json({ message: "Gửi liên hệ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/contact
const getContacts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM contact ORDER BY created_at DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM contact WHERE id = @id");

    res.json({ message: "Xoá liên hệ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { submitContact, getContacts, deleteContact };

