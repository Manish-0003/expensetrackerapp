import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import Expenses from '../Expenses';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

     
        setIsLoading(true);

        try {
            const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBE8PDk08I4DVaeEO6auZ9E486cUtvX1pQ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: username,
                    password,
                    returnSecureToken: true,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message);
            }

            setUsername('');
            setPassword('');
            setError('');
            setIsLoggedIn(true);
            navigate("/expenses"); 
        } catch (error) {
            setError(error.message);
            console.error("Error logging in:", error);
        } finally {
          
            setIsLoading(false);
        }
    };

    
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isLoggedIn) {
        return (
            <div className="login-container">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        required 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)} 
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        );
    }

    
    return <Expenses />;
}

export default Login;
