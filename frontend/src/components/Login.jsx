/* frontend/src/components/Login.jsx */
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Talk to your backend on Port 3000!
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                email, password
            });
            login(res.data.token, res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'CHECK_CREDENTIALS...');
        }
    };

    return (
        <div className="auth-fullscreen">
            <div className="brutal-auth-box">
                <header>
                    <LogIn size={20} />
                    <span>00 / SYSTEM_LOGIN</span>
                </header>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email" placeholder="EMAIL_ADDRESS" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="USER_SECRET" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="auth-error">{error}</div>}
                    <button type="submit">AUTHORIZE <ArrowRight size={18} /></button>
                </form>
            </div>
        </div>
    );
};

export default Login;
