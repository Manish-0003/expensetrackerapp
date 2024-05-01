
import React, { useState, useEffect } from 'react';
import './Expenses.css';

function Expenses() {
    const [expenses, setExpenses] = useState([]); 
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [idCounter, setIdCounter] = useState(1); 
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCategory, setEditCategory] = useState('');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch('https://auth-learning-d7bd2-default-rtdb.firebaseio.com/expenses.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                const data = await response.json();
                const expensesData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setExpenses(expensesData);
            } catch (error) {
                console.error('Error fetching expenses: ', error);
            }
        };

        fetchExpenses();
    }, []);

    const handleAddExpense = async () => {
        if (!amount || !description || !category) {
            alert('Please fill out all fields');
            return;
        }

        const newExpense = {
            amount: parseFloat(amount),
            description,
            category,
            id: idCounter,
        };

        try {
            const response = await fetch('https://auth-learning-d7bd2-default-rtdb.firebaseio.com/expenses.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpense),
            });
            if (!response.ok) {
                throw new Error('Failed to add expense');
            }
            setExpenses([...expenses, newExpense]); 
            setAmount('');
            setDescription('');
            setCategory('');
            setIdCounter(idCounter + 1);
        } catch (error) {
            console.error('Error adding expense: ', error);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            const response = await fetch(`https://auth-learning-d7bd2-default-rtdb.firebaseio.com/expenses/${id}.json`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete expense');
            }
            setExpenses(expenses.filter(expense => expense.id !== id));
            console.log('Expense successfully deleted');
        } catch (error) {
            console.error('Error deleting expense: ', error);
        }
    };

    const handleEditExpense = (id) => {
        const expenseToEdit = expenses.find(expense => expense.id === id);
        setEditingExpenseId(id);
        setEditAmount(expenseToEdit.amount);
        setEditDescription(expenseToEdit.description);
        setEditCategory(expenseToEdit.category);
    };

    const handleUpdateExpense = async () => {
        if (!editAmount || !editDescription || !editCategory) {
            alert('Please fill out all fields');
            return;
        }

        const updatedExpense = {
            amount: parseFloat(editAmount),
            description: editDescription,
            category: editCategory,
        };

        try {
            const response = await fetch(`https://auth-learning-d7bd2-default-rtdb.firebaseio.com/expenses/${editingExpenseId}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedExpense),
            });
            if (!response.ok) {
                throw new Error('Failed to update expense');
            }
            const updatedExpenses = expenses.map(expense => {
                if (expense.id === editingExpenseId) {
                    return { ...expense, ...updatedExpense };
                }
                return expense;
            });
            setExpenses(updatedExpenses);
            setEditingExpenseId(null);
            setEditAmount('');
            setEditDescription('');
            setEditCategory('');
        } catch (error) {
            console.error('Error updating expense: ', error);
        }
    };

    return (
        <div className="expenses-container">
            <h2>Add Expense</h2>
            <form>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input 
                        type="number" 
                        id="amount" 
                        placeholder="Enter amount" 
                        value={amount} 
                        onChange={(event) => setAmount(event.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input 
                        type="text" 
                        id="description" 
                        placeholder="Enter description" 
                        value={description} 
                        onChange={(event) => setDescription(event.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select 
                        id="category" 
                        value={category} 
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="">Select category</option>
                        <option value="Food">Food</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Salary">Salary</option>
                    </select>
                </div>
                <button type="button" onClick={handleAddExpense}>Add Expense</button>
            </form>

            <div className='expense-list'>
                <h2>Expenses List</h2>
                <ul>
                    {expenses.map(expense => (
                        <li key={expense.id}>
                            <div>Amount: {expense.amount}</div>
                            <div>Description: {expense.description}</div>
                            <div>Category: {expense.category}</div>
                            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                            <button onClick={() => handleEditExpense(expense.id)}>Edit</button>
                            {editingExpenseId === expense.id && (
                                <div>
                                    <input 
                                        type="number" 
                                        value={editAmount} 
                                        onChange={(event) => setEditAmount(event.target.value)} 
                                    />
                                    <input 
                                        type="text" 
                                        value={editDescription} 
                                        onChange={(event) => setEditDescription(event.target.value)} 
                                    />
                                    <select 
                                        value={editCategory} 
                                        onChange={(event) => setEditCategory(event.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        <option value="Food">Food</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Salary">Salary</option>
                                    </select>
                                    <button onClick={handleUpdateExpense}>Submit</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Expenses;
