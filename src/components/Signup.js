import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBE8PDk08I4DVaeEO6auZ9E486cUtvX1pQ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message);
            }

            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            console.log("User signed up successfully");
            
        } catch (error) {
            setError(error.message);
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    required 
                    value={confirmPassword} 
                    onChange={(event) => setConfirmPassword(event.target.value)} 
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Signup;
