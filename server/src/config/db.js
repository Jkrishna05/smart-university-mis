import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function dbConnect() {
  try {
    const connection = await pool.getConnection();

    console.log("✅ Connected to MySQL");

    connection.release();
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error.message);
    process.exit(1);
  }
}

export { pool };
export default dbConnect;