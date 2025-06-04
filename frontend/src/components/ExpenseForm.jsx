import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

function ExpenseForm({ isOpen, onClose, onSubmit, formError }) {
  // State for form fields
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [category, setCategory] = useState('');
  const [currentError, setCurrentError] = useState(null);

  useEffect(() => {
    setCurrentError(formError); // Update local error state when prop changes
  }, [formError]);

  // Reset form fields and error when modal opens/closes or on successful submit
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setCurrentError(null); // Clear previous submission errors when reopening
    } else {
        setCurrentError(null); // Clear error when form is closed
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentError(null); // Clear previous errors

    if (!description.trim() || !amount || !date) {
      setCurrentError('Description, Amount, and Date are required.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setCurrentError('Amount must be a positive number.');
      return;
    }

    onSubmit({ 
      description: description.trim(), 
      amount: parseFloat(amount), 
      date, 
      category: category.trim() 
    });
    // Don't close here, App.jsx will close on successful submission
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 dialog-overlay" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4 dialog-panel">
        <Dialog.Panel className="mx-auto w-full max-w-lg rounded-xl bg-white shadow-2xl p-6 border border-neutral-200 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-display font-semibold text-primary-600">Add New Expense</Dialog.Title>
            <button 
              onClick={onClose} 
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close form"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Form Error Display */}
          {currentError && (
            <div className="bg-error-50 border border-error-200 text-error-700 p-3 rounded-md mb-4 text-sm flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-error-500 flex-shrink-0" />
              <span>{currentError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <input 
                type="text" 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-input" 
                placeholder="e.g., Coffee with client"
                required 
              />
            </div>
            <div>
              <label htmlFor="amount" className="form-label">Amount ($)</label>
              <input 
                type="number" 
                id="amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="form-input" 
                placeholder="0.00" 
                step="0.01"
                required 
              />
            </div>
            <div>
              <label htmlFor="date" className="form-label">Date</label>
              <input 
                type="date" 
                id="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="form-input" 
                required 
              />
            </div>
            <div>
              <label htmlFor="category" className="form-label">Category (Optional)</label>
              <input 
                type="text" 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="form-input" 
                placeholder="e.g., Food, Travel, Utilities"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Add Expense
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ExpenseForm;
