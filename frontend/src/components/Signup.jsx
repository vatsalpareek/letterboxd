/* frontend/src/components/Signup.jsx */
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = ({ onBackToLogin }) => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:3000/api/auth/signup', {
                username, email, password
            });
            login(res.data.token, res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || 'REGISTRATION_FAILED');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-fullscreen">
            <div className="brutal-auth-box">
                <header>
                    <UserPlus size={20} />
                    <span>SYSTEM_REGISTRATION</span>
                </header>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text" placeholder="CHOOSE_USERNAME" required
                        value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email" placeholder="EMAIL_ADDRESS" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="USER_SECRET" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <div className="auth-error">{error}</div>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'PROCESSING...' : 'INITIALIZE_ACCOUNT'} <ArrowRight size={18} />
                    </button>
                    <div className="auth-switch" onClick={onBackToLogin}>
                         Already have a passport? LOGIN_HERE
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
