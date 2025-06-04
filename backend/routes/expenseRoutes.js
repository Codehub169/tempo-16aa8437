const express = require('express');
const router = express.Router();
const {
    getAllExpenses,
    addExpense,
    deleteExpense
} = require('../controllers/expenseController');

// Route to get all expenses
// GET /api/expenses
router.get('/', getAllExpenses);

// Route to add a new expense
// POST /api/expenses
router.post('/', addExpense);

// Route to delete an expense by ID
// DELETE /api/expenses/:id
router.delete('/:id', deleteExpense);

module.exports = router;