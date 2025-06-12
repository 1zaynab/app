import React, { useState, useEffect } from 'react';
import './App.css';

const LOCAL_STORAGE_KEY = 'ora-expenses';
const PREDEFINED_CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [formError, setFormError] = useState('');

  // Load expenses from Local Storage
  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses).map(exp => ({
          ...exp,
          category: exp.category || 'Uncategorized',
          // isExiting: false, // Not implementing animations in this pass
        })));
      }
    } catch (error) {
      console.error("Failed to parse expenses from local storage:", error);
      setExpenses([]); // Default to empty array on error
    }
  }, []);

  // Save expenses to Local Storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (formError) setFormError(''); // Clear error when user starts typing
  };

  const addExpense = (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous errors

    if (!description.trim()) {
      setFormError('Description cannot be empty.');
      return;
    }
    if (!amount.trim()) {
      setFormError('Amount cannot be empty.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }
    if (!category.trim()) {
      setFormError('Category cannot be empty.');
      return;
    }

    const newExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: numericAmount,
      category: category.trim(),
      date: new Date().toLocaleDateString(),
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const deleteExpense = (id) => {
    // Not implementing exit animation for now to simplify after reset
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="App">
      <header className="app-header"> {/* Changed class for clarity */}
        <h1>Ora Expense Tracker</h1>
      </header>

      <form className="expense-form" onSubmit={addExpense}>
        <h2>Add New Expense</h2>
        {formError && <p className="form-error-message">{formError}</p>}
        <input
          type="text"
          placeholder="Description (e.g., Coffee)"
          className="neumorphic-input"
          value={description}
          onChange={handleInputChange(setDescription)}
        />
        <input
          type="number"
          placeholder="Amount (e.g., 4.50)"
          className="neumorphic-input"
          value={amount}
          onChange={handleInputChange(setAmount)}
          step="0.01"
        />
        <input
          list="category-suggestions"
          type="text"
          placeholder="Category (e.g., Food)"
          className="neumorphic-input"
          value={category}
          onChange={handleInputChange(setCategory)}
        />
        <datalist id="category-suggestions">
          {PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
        </datalist>
        <button type="submit" className="neumorphic-button">
          Add Expense
        </button>
      </form>

      <section className="expense-list-container">
        <h2>My Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet. Add some!</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense) => (
              <li key={expense.id}>
                <div className="expense-details">
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-category">Category: {expense.category}</span>
                  <span className="expense-date">{expense.date}</span>
                </div>
                <div className="expense-actions">
                  <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="neumorphic-button delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
