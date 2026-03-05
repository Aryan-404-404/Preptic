import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Code, Brain, Settings, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

export const Signup = () => {
    const { signup } = useAuth();
    const { navigate } = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', niche: '' });

    const niches = [
        { id: 'Frontend Developer', icon: <LayoutDashboard className="w-5 h-5" />, desc: 'React, Vue, UI/UX', color: 'bg-teal-50 text-teal-700' },
        { id: 'Backend Developer', icon: <Code className="w-5 h-5" />, desc: 'Node, Python, Databases', color: 'bg-amber-50 text-amber-700' },
        { id: 'Data Scientist', icon: <Brain className="w-5 h-5" />, desc: 'ML, Pandas, Statistics', color: 'bg-blue-50 text-blue-700' },
        { id: 'DevOps Engineer', icon: <Settings className="w-5 h-5" />, desc: 'AWS, Docker, CI/CD', color: 'bg-purple-50 text-purple-700' }
    ];

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1) setStep(2);
    };

    const handleComplete = async () => {
        if (!formData.niche) return;
        await signup(formData);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center px-6 pt-20">
            <motion.div
                layout
                className="w-full max-w-xl bg-white p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {step === 1 ? 'Create an Account' : 'Select Your Track'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {step === 1 ? 'Join us today by entering your details below.' : 'Select your primary domain to calibrate the AI.'}
                        </p>
                    </div>
                    {step === 2 && (
                        <button onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Back</button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleNext} className="space-y-5"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm relative">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 transition-all placeholder-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 transition-all placeholder-gray-400"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-orange-400 transition-all placeholder-gray-400"
                                    placeholder="Min 8 Characters"
                                />
                            </div>
                            <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors">
                                SIGN UP
                            </button>
                            <p className="text-left mt-4 text-gray-600 text-sm">
                                Already an account? <button type="button" onClick={() => navigate('/login')} className="text-orange-500 font-medium hover:text-orange-600 underline decoration-orange-500/30 underline-offset-4">Login</button>
                            </p>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {niches.map((niche) => (
                                    <button
                                        key={niche.id}
                                        onClick={() => setFormData({ ...formData, niche: niche.id })}
                                        className={`p-5 rounded-2xl border text-left transition-all relative ${formData.niche === niche.id
                                                ? 'bg-orange-50/50 border-orange-400 shadow-sm shadow-orange-100'
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`p-2 rounded-lg ${niche.color}`}>
                                                {niche.icon}
                                            </div>
                                            <h3 className="font-bold text-gray-900">{niche.id}</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">{niche.desc}</p>
                                        {formData.niche === niche.id && (
                                            <div className="absolute top-4 right-4 text-orange-500">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={handleComplete}
                                    disabled={!formData.niche}
                                    className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:hover:bg-black"
                                >
                                    FINISH & ENTER PLATFORM
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};