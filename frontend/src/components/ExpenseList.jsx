import React from 'react';
import { TrashIcon, CalendarDaysIcon, TagIcon, BanknotesIcon } from '@heroicons/react/24/outline';

function ExpenseList({ expenses, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl">
        <img 
          src="https://source.unsplash.com/300x200/?empty,finance,note"
          alt="No expenses yet" 
          className="mx-auto mb-6 rounded-lg shadow-md w-48 h-32 object-cover opacity-75"
          loading="lazy"
        />
        <h3 className="text-2xl font-semibold text-neutral-600 mb-2">No Expenses Yet!</h3>
        <p className="text-neutral-500">Add your first expense to see it listed here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-5 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-grow mb-4 sm:mb-0">
              <h3 className="text-xl font-display font-semibold text-primary-700 mb-1 truncate" title={expense.description}>
                {expense.description}
              </h3>
              <div className="flex items-center text-sm text-neutral-500 mb-1">
                <CalendarDaysIcon className="h-4 w-4 mr-2 text-primary-500 flex-shrink-0" /> 
                {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
              </div>
              {expense.category && (
                <div className="flex items-center text-sm text-neutral-500">
                  <TagIcon className="h-4 w-4 mr-2 text-accent-500 flex-shrink-0" /> 
                  <span className="bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full text-xs font-medium">{expense.category}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end sm:items-center sm:flex-row">
              <p className="text-2xl font-display font-bold text-primary-600 mr-0 sm:mr-6 mb-2 sm:mb-0">
                ${parseFloat(expense.amount).toFixed(2)}
              </p>
              <button 
                onClick={() => onDelete(expense.id)} 
                className="btn btn-danger p-2 sm:p-2.5 text-sm group transition-transform transform hover:scale-110"
                aria-label={`Delete expense: ${expense.description}`}
              >
                <TrashIcon className="h-5 w-5 group-hover:animate-bounce" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
