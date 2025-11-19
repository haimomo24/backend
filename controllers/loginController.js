const { poolPromise, sql } = require("../db");

// POST /api/login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập username và password" });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .query("SELECT * FROM login WHERE username=@username AND password=@password");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Sai username hoặc password" });
    }

    const user = result.recordset[0];
    
    res.json({
      id: user.id,
      username: user.username,
      level: user.level,
      created_at: user.created_at
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/login => lấy danh sách tất cả user
const getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT id, username, level, created_at FROM login");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { loginUser, getAllUsers };
