const db = require('../db/database');

// Controller to get all expenses
exports.getAllExpenses = (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY date DESC, id DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err.message);
            res.status(500).json({ error: 'Failed to retrieve expenses. Please try again later.' });
            return;
        }
        // Ensure amount is a number
        const expenses = rows.map(expense => ({...expense, amount: parseFloat(expense.amount)}));
        res.json(expenses);
    });
};

// Controller to add a new expense
exports.addExpense = (req, res) => {
    const { description, amount, date, category } = req.body;

    // Basic validation
    if (!description || !amount || !date) {
        return res.status(400).json({ error: 'Description, amount, and date are required.' });
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number.' });
    }
    // Validate date format (ISO8601 YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        try {
            // try to parse it if it's a full ISO string
            new Date(date).toISOString().split('T')[0];
        } catch (e) {
            return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format.' });
        }
    }

    const sql = `INSERT INTO expenses (description, amount, date, category) VALUES (?, ?, ?, ?)`;
    // Ensure date is stored in YYYY-MM-DD format if it's a full ISO string
    const formattedDate = date.includes('T') ? new Date(date).toISOString().split('T')[0] : date;

    db.run(sql, [description, parseFloat(amount), formattedDate, category || null], function(err) {
        if (err) {
            console.error('Error adding expense:', err.message);
            res.status(500).json({ error: 'Failed to add expense. Please try again later.' });
            return;
        }
        // Return the newly created expense with its ID
        res.status(201).json({
            id: this.lastID,
            description,
            amount: parseFloat(amount),
            date: formattedDate,
            category: category || null
        });
    });
};

// Controller to delete an expense
exports.deleteExpense = (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Valid expense ID is required.' });
    }

    const sql = "DELETE FROM expenses WHERE id = ?";
    db.run(sql, parseInt(id), function(err) {
        if (err) {
            console.error('Error deleting expense:', err.message);
            res.status(500).json({ error: 'Failed to delete expense. Please try again later.' });
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found.' });
        }
        res.status(200).json({ message: 'Expense deleted successfully.' }); // Or 204 No Content with res.status(204).send();
    });
};