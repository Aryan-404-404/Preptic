import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [niche, setNiche] = useState(user?.niche || '');
    const [saved, setSaved] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        await updateProfile({ name, niche });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Display Name</label>
                        <input
                            type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 transition-colors"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Primary Niche</label>
                        <select
                            value={niche} onChange={(e) => setNiche(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 appearance-none focus:outline-none focus:border-orange-400 transition-colors cursor-pointer"
                        >
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="DevOps Engineer">DevOps Engineer</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 mt-2 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                        {saved ? <><CheckCircle2 className="w-5 h-5 text-green-400" /> Saved Successfully</> : 'SAVE CHANGES'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};