import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [chosenNiche, setChosenNiche] = useState(user?.chosenNiche || '');
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const niches = [
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'fullstack', label: 'Full Stack Developer' },
        { value: 'devops', label: 'DevOps Engineer' },
        { value: 'datascience', label: 'Data Scientist' },
        { value: 'ml', label: 'ML Engineer' },
        { value: 'genai', label: 'Gen AI Engineer' },
        { value: 'ai', label: 'AI Engineering' }
    ];

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSaved(false);

        try {
            await updateProfile({
                name,
                chosenNiche
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save changes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-6 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white p-10 rounded-3xl border border-gray-200 shadow-sm"
            >
                <div className="mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h2>
                    <p className="text-gray-500 text-sm">Update your details. Changes reflect immediately on the dashboard.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Display Name</label>
                        <input
                            type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Primary Niche</label>
                        <select
                            value={chosenNiche} onChange={(e) => setChosenNiche(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 appearance-none focus:outline-none focus:border-orange-400 transition-colors cursor-pointer"
                            disabled={loading}
                        >
                            <option value="">Select a niche</option>
                            {niches.map(niche => (
                                <option key={niche.value} value={niche.value}>{niche.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 mt-2 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {saved ? <><CheckCircle2 className="w-5 h-5 text-green-400" /> Saved Successfully</> : loading ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};