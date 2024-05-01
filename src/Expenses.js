import React, { useState, useEffect } from 'react';
import './Expenses.css';

function Expenses() {
    const [expenses, setExpenses] = useState([]); 
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [idCounter, setIdCounter] = useState(1); 

    useEffect(() => {
      
        const fetchExpenses = async () => {
            try {
                const response = await fetch('https://auth-learning-d7bd2-default-rtdb.firebaseio.com//expenses.json');
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
           
            await fetch('https://auth-learning-d7bd2-default-rtdb.firebaseio.com//expenses.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newExpense),
            });
            setExpenses([...expenses, newExpense]); 
            setAmount('');
            setDescription('');
            setCategory('');
            setIdCounter(idCounter + 1);
        } catch (error) {
            console.error('Error adding expense: ', error);
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
                        <option value="Food">Food</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Salary">Salary</option>
                    </select>
                </div>
                <button type="button" onClick={handleAddExpense}>Add Expense</button>
            </form>

            <div>
                <h2>Expenses List</h2>
                <ul>
                    {expenses.map(expense => (
                        <li key={expense.id}>
                            <div>Amount: {expense.amount}</div>
                            <div>Description: {expense.description}</div>
                            <div>Category: {expense.category}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Expenses;
