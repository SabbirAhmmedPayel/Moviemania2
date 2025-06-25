const { pool } = require('../pool');

const signup = async (username, name, email, birthDate, password) => {
  const query = `
    INSERT INTO "Users" (username, "Name", "Email", "BirthDate", password)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [username, name, email, birthDate, password];

  try {
    await pool.query(query, values);
    console.log('✅ User registered:', username);
    return true;
  } catch (err) {
    console.error('Signup error:', err);

    if (err.code === '23505') { // unique violation
      console.error('❌ Username or Email already exists');
    }
    
    // Check for invalid input errors
    if (err.code === '22007') { // invalid_datetime format
      console.error('❌ Invalid date format for BirthDate');
    }

    return false;
  }
};

module.exports = { signup };