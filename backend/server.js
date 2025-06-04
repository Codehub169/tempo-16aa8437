// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

// Import database instance - this will trigger db connection and table creation if not exists
const db = require('./db/database');

// Placeholder for actual expense routes - to be implemented in a later batch
// const expenseRoutes = require('./routes/expenseRoutes'); 

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
// Enable CORS for all routes. Useful for development, can be configured more strictly for production.
app.use(cors()); 
// Parse JSON request bodies
app.use(express.json()); 

// --- Static file serving for Frontend ---
// Construct the path to the frontend build directory.
// __dirname is the directory of the current module (backend/)
// So, path.join(__dirname, '..', 'frontend', 'dist') navigates up one level, then into frontend/dist
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');

// Serve static files (HTML, CSS, JS, images, etc.) from the frontend build directory
app.use(express.static(frontendDistPath));

// --- API Routes ---
// All API routes will be prefixed with /api

// Create a dummy router for /api/expenses until actual routes are implemented
const dummyExpenseRouter = express.Router();
dummyExpenseRouter.get('/', (req, res) => {
  res.json({ message: 'Expense API endpoint. Routes to be implemented.' });
});
app.use('/api/expenses', dummyExpenseRouter);
// Uncomment and use actual routes when backend/routes/expenseRoutes.js is created:
// app.use('/api/expenses', expenseRoutes);

// --- Fallback for Single Page Application (SPA) ---
// For any route not caught by API routes or static file serving, serve the frontend's index.html.
// This is crucial for client-side routing in SPAs (like React, Vue, Angular).
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // Log the error and send a 500 status code if index.html cannot be sent.
      // This might happen if the frontend hasn't been built yet or path is incorrect.
      console.error('Error sending index.html:', err);
      if (!res.headersSent) {
        res.status(500).send('Error serving frontend application. Ensure frontend is built and accessible at ' + frontendDistPath);
      }
    }
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Serving frontend static files from: ${frontendDistPath}`);
  console.log('Database initialized and connected (see console logs from database.js).');
  // Optional: A small check to confirm the expenses table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='expenses'", (err, row) => {
    if (err) {
      console.error("DB Check Error: Could not verify 'expenses' table existence.", err.message);
    } else if (row) {
      console.log("DB Check Success: 'expenses' table found in the database.");
    } else {
      console.warn("DB Check Warn: 'expenses' table not found. This might be an issue if database.js didn't create it.");
    }
  });
});
