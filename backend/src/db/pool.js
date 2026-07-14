import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // El servidor local usa un certificado autofirmado (el que MySQL genera
  // por defecto). En producción, en vez de rejectUnauthorized:false, se
  // debe apuntar a la CA real con `ssl: { ca: fs.readFileSync(...) }`.
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});
