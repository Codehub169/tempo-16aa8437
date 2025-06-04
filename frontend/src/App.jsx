import React, { useState, useEffect, useCallback } from 'react';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import { PlusIcon, CurrencyDollarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { getExpenses, addExpense, deleteExpense as apiDeleteExpense } from './services/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Failed to fetch expenses. Please try again later.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (expenseData) => {
    try {
      setError(null); // Clear previous global errors before attempting to add
      await addExpense(expenseData);
      fetchExpenses(); // Refetch expenses to update the list
      setIsFormOpen(false); // Close the form modal on success
    } catch (err) {
      // err from api.js is expected to be an object like { error: 'message' } or an Error instance
      const errorMessage = err.error || (err.message || 'Failed to add expense. Please check your input and try again.');
      setError(errorMessage);
      console.error(err);
      // Keep form open if there's an error to allow correction
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setError(null); // Clear previous global errors before attempting to delete
      await apiDeleteExpense(id);
      fetchExpenses(); // Refetch expenses to update the list
    } catch (err) {
      const errorMessage = err.error || (err.message || 'Failed to delete expense. Please try again.');
      setError(errorMessage);
      console.error(err);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100"> {/* Simplified background */}
      <header className="bg-blue-600 shadow-lg text-white py-6 sticky top-0 z-50"> {/* Simplified header styling */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <CurrencyDollarIcon className="h-10 w-10 mr-3 text-emerald-400" />
            <h1 className="text-4xl font-display font-bold tracking-tight">Expense Tracker</h1>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center shadow-xl transform hover:scale-105 transition-transform duration-150"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Expense
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-2xl rounded-xl p-6 mb-8 text-center transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Total Expenses</h2>
          <p className="text-5xl font-display font-bold text-blue-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <span className="sr-only">Loading expenses...</span>
          </div>
        )}

        {error && !isLoading && (
          <div role="alert" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6 flex items-center">
            <ExclamationCircleIcon className="h-6 w-6 mr-3 text-red-500 flex-shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && (
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        )}
      </main>

      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setError(null); // Clear errors when closing form manually, especially form-related ones.
        }} 
        onSubmit={handleAddExpense} 
        // Pass the error state to the form, so it can display submission-related errors.
        // The form itself will handle its own client-side validation errors separately.
        formError={error} 
      />
    </div>
  );
}

export default App;
