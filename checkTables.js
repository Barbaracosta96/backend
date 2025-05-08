const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?", 
      [process.env.DB_NAME]
    );

    console.log("Tabelas encontradas:");
    tables.forEach(table => {
      console.log(table.TABLE_NAME);
    });

    await connection.end();
  } catch (error) {
    console.error("Erro ao conectar ou buscar tabelas:", error);
  }
}

checkTables();
