import React, { useState, useEffect, useCallback } from 'react';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
// Dialog is not directly used here but might be intended for future use or is a remnant. Keeping for now.
import { Dialog } from '@headlessui/react'; 
import { PlusIcon, CurrencyDollarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { getExpenses, addExpense, deleteExpense as apiDeleteExpense } from './services/api'; // Corrected import

function App() {
  // State for expenses, loading status, errors, and form modal visibility
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch expenses from the API
  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getExpenses(); // Corrected API call
      setExpenses(data);
    } catch (err) {
      setError('Failed to fetch expenses. Please try again later.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  // Effect to fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Handler for adding a new expense
  const handleAddExpense = async (expenseData) => {
    try {
      setError(null); // Clear previous errors before attempting to add
      await addExpense(expenseData); // Corrected API call
      fetchExpenses(); // Refetch expenses to update the list
      setIsFormOpen(false); // Close the form modal
    } catch (err) {
      // err from api.js is expected to be { error: 'message' } or Error object
      const errorMessage = err.error || 'Failed to add expense. Please check your input and try again.';
      setError(errorMessage);
      console.error(err);
      // Keep form open if error to allow correction
    }
  };

  // Handler for deleting an expense
  const handleDeleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id); // Corrected API call, aliased to avoid conflict if any
      fetchExpenses(); // Refetch expenses to update the list
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error(err);
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

  return (
    <div 
      className="min-h-screen bg-neutral-100 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080?random=cfcd208495')" }}
    >
      <div className="min-h-screen bg-black bg-opacity-50 backdrop-blur-sm">
        <header className="bg-blue-600 bg-opacity-80 shadow-lg text-white py-6 sticky top-0 z-50 backdrop-filter backdrop-blur-md">
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
          {/* Total Expenses Display */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-6 mb-8 text-center transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Total Expenses</h2>
            <p className="text-5xl font-display font-bold text-blue-600">
              ${totalExpenses.toFixed(2)}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          )}

          {/* Error Display */}
          {error && !isLoading && (
            // This error display is for general errors. Form errors are handled within the form.
            // However, if add/delete fails, this will show. And it's passed to ExpenseForm too.
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6 flex items-center">
              <ExclamationCircleIcon className="h-6 w-6 mr-3 text-red-500" />
              <p>{error}</p>
            </div>
          )}

          {/* Expense List - only show if not loading and no critical error preventing data display */}
          {!isLoading && (
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          )}
        </main>

        {/* Expense Form Modal */}
        <ExpenseForm 
          isOpen={isFormOpen} 
          onClose={() => {
            setIsFormOpen(false);
            setError(null); // Clear errors when closing form manually, especially form-related ones.
          }} 
          onSubmit={handleAddExpense} 
          formError={error} // Pass error to form for display if it's a submission error
        />
      </div>
    </div>
  );
}

export default App;
