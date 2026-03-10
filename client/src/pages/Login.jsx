import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

export const Login = () => {
    const { login } = useAuth();
    const { navigate } = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-6 pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm relative">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Sign in to continue your preparation.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all placeholder-gray-400"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all placeholder-gray-400"
                            placeholder="Min 8 Characters"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-3.5 mt-2 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-70"
                    >
                        {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600 text-sm">
                    Don't have an account? <button onClick={() => navigate('/signup')} className="text-orange-500 font-medium hover:text-orange-600 underline decoration-orange-500/30 underline-offset-4">Sign up</button>
                </p>
            </motion.div>
        </div>
    );
};