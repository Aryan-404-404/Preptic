import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react';
import { useRouter } from '../contexts/RouterContext';
import heroImage from '../assets/job_interview_Image/7566.jpg';

export const Landing = () => {
    const { navigate } = useRouter();
    return (
        <div>
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
                            onClick={() => navigate('/dashboard')}
                            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white font-medium text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-gray-200"
                        >
                            <span className="relative z-10">Get Started</span>
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:block relative"
                    >
                        <img
                            src={heroImage}
                            alt="Interview Illustration"
                            className="w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 rounded-2xl"
                        />
                    </motion.div>
                </div>
            </div>
            {/* footer */}
            <footer className="w-full bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <span className="text-2xl font-bold tracking-tight text-gray-900">Preptic<span className="text-orange-500">.ai</span></span>
                            <p className="mt-4 text-gray-500 text-sm max-w-sm leading-relaxed">
                                Get role-specific questions, dive deeper into concepts, and organize your preparation. Your ultimate AI interview toolkit.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Use Cases</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Preptic.ai. All rights reserved.</p>
                        <div className="flex gap-4 text-gray-400">
                            <a href="#" className="hover:text-gray-900 transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-gray-900 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-gray-900 transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};