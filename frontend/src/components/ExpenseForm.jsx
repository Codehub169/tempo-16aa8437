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
    // Only update currentError from formError if formError is relevant (e.g., a string message)
    // This prevents null or other types of errors from unnecessarily clearing a client-side validation message
    if (typeof formError === 'string') {
        setCurrentError(formError);
    } else if (formError === null && isOpen) {
        // If formError is explicitly cleared from parent and form is open, clear local error too
        // (unless handleSubmit just set a local error)
    } 
  }, [formError, isOpen]);

  // Reset form fields and error when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
      setCurrentError(null); // Clear previous submission errors when reopening
    } else {
        // Error is already cleared by App.jsx on manual close, 
        // but this handles other ways of closing if any.
        setCurrentError(null); 
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentError(null); // Clear previous local errors before new validation

    if (!description.trim() || !amount || !date) {
      setCurrentError('Description, Amount, and Date are required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setCurrentError('Amount must be a positive number.');
      return;
    }

    onSubmit({ 
      description: description.trim(), 
      amount: parsedAmount, 
      date, 
      category: category.trim() 
    });
    // Don't close here or reset fields; App.jsx will close on successful submission
    // and useEffect[isOpen] will reset fields when it reopens.
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 dialog-overlay" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4 dialog-panel">
        <Dialog.Panel className="mx-auto w-full max-w-lg rounded-xl bg-white shadow-2xl p-6 border border-neutral-200 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-display font-semibold text-blue-600">Add New Expense</Dialog.Title>
            <button 
              onClick={onClose} 
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close form"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Form Error Display */}
          {currentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
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
