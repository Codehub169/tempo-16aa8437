// backend/db/database.js
const sqlite3 = require('sqlite3').verbose(); // Use verbose mode for more detailed error messages
const path = require('path');

// Define the path for the SQLite database file.
// It will be created in the 'backend/db/' directory, relative to this file.
const dbDir = path.resolve(__dirname); // Ensures the 'db' folder path is correct
const dbPath = path.join(dbDir, 'expenses.db');

// Create a new database instance. 
// The file 'expenses.db' will be created if it doesn't exist.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    // Log critical error if database connection fails
    console.error('FATAL: Error opening/creating database:', err.message);
    // Exit process if DB connection fails, as app cannot function
    // process.exit(1); // Consider if this is too aggressive for all scenarios
  } else {
    console.log(`Successfully connected to SQLite database at ${dbPath}`);
    
    // SQL statement to create the 'expenses' table if it doesn't already exist.
    // This schema includes an ID, description, amount, date, and category.
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL, -- Store dates as ISO8601 strings (YYYY-MM-DD)
        category TEXT       -- Category can be null if not specified
      );
    `;

    // Run the SQL to create the table.
    db.run(createTableSql, (err) => {
      if (err) {
        console.error('Error creating expenses table:', err.message);
      } else {
        console.log('Checked for \'expenses\' table: ensured it exists.');
      }
    });
  }
});

// Export the database connection instance for use in other modules.
module.exports = db;
