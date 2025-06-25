const { pool } = require('../pool'); // Assuming pool.js is your DB config
require('dotenv').config();

const signin = async (username, password) => {

  const query = `
     SELECT username, "Name", "Email", "BirthDate"
    FROM "Users"
    WHERE username = $1 AND password = $2
    LIMIT 1
    `;
  const values = [username, password];
  try {
    const result = await pool.query(query, values);
    if (result.rows.length > 0) {
      return result.rows[0];  // return user details object
    } else {
      return null; // invalid credentials
    }
  } catch (err) {
    console.error('Signin error:', err);
    throw err;
  }

};


module.exports = { signin };
