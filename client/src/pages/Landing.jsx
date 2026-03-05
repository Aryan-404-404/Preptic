import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useRouter } from '../contexts/RouterContext';

export const Landing = () => {
    const { navigate } = useRouter();
    return (
        <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center px-6 pt-20">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="max-w-xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-500 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Powered</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                        Ace Interviews with <br />
                        <span className="text-orange-400">AI-Powered</span> Learning
                    </h1>
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                        Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery — your ultimate interview toolkit is here.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white font-medium text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-gray-200"
                    >
                        <span className="relative z-10">Get Started</span>
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden lg:block relative"
                >
                    <div className="w-full h-125 bg-white rounded-2xl shadow-2xl shadow-gray-200 border border-gray-100 p-6 relative overflow-hidden">
                        {/* Mockup UI representing the app */}
                        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-8 w-1/3 bg-gray-100 rounded-lg"></div>
                            <div className="h-4 w-1/4 bg-gray-100 rounded-lg"></div>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 p-4">
                                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 p-4">
                                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};