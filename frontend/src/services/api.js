import axios from 'axios';

// The Vite dev server proxy (configured in vite.config.js) will handle redirecting these requests to the backend.
const API_BASE_URL = '/api';

/**
 * Fetches all expenses from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of expense objects.
 */
export const getExpenses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/expenses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch expenses');
  }
};

/**
 * Adds a new expense to the server.
 * @param {Object} expenseData - The expense data to add (description, amount, date, category).
 * @returns {Promise<Object>} A promise that resolves to the newly added expense object.
 */
export const addExpense = async (expenseData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/expenses`, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error adding expense:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to add expense');
  }
};

/**
 * Deletes an expense from the server by its ID.
 * @param {string|number} id - The ID of the expense to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response (typically a success message).
 */
export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to delete expense');
  }
};
