import React from 'react';
import PropTypes from 'prop-types';
import { TrashIcon, CalendarIcon, TagIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const ExpenseItem = ({ expense, onDelete }) => {
  const { id, description, amount, date, category } = expense;

  // Format date to be more readable, e.g., "October 26, 2023"
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <li className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out group">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{description}</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-500">
            <p className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              <span>{formattedDate}</span>
            </p>
            {category && (
              <p className="flex items-center">
                <TagIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{category}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <p className="text-2xl font-bold text-green-600 flex items-center justify-end sm:justify-start w-full sm:w-auto">
            <CurrencyDollarIcon className="h-6 w-6 mr-1 text-green-500" />
            {amount.toFixed(2)}
          </p>
          <button
            onClick={() => onDelete(id)}
            aria-label={`Delete expense: ${description}`}
            className="p-2 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform group-hover:opacity-100 sm:opacity-0 group-hover:translate-x-0 sm:translate-x-2"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </li>
  );
};

ExpenseItem.propTypes = {
  expense: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired, // ISO date string
    category: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ExpenseItem;
