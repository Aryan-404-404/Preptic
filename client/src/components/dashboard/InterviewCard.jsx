import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export const InterviewCard = ({ title, type, icon, stacks, bgColorClass, accentColorClass }) => {
    const [selectedStack, setSelectedStack] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (selectedStack) setIsExpanded(true);
    }, [selectedStack]);

    const levels = [
        { id: 'easy', label: 'L1 - Screening', desc: 'Basic concepts & fundamentals', dot: 'bg-emerald-400' },
        { id: 'medium', label: 'L5 - Mid Level', desc: 'Architecture & problem solving', dot: 'bg-blue-400' },
        { id: 'hard', label: 'L10 - Executive', desc: 'System design & high-pressure', dot: 'bg-purple-400' }
    ];

    return (
        <motion.div
            layout
            className={`bg-white border border-gray-200 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-md ${isExpanded ? 'shadow-md border-gray-300' : 'shadow-sm'
                }`}
        >
            <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${bgColorClass} ${accentColorClass}`}>
                        {type === 'niche' ? title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'BH'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            {isExpanded && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{type === 'niche' ? 'Technical domain assessment' : 'Mandatory soft-skills & leadership'}</p>

                        {/* Tags matching screenshot style */}
                        <div className="flex gap-2 mt-4">
                            <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full">Experience: 2 Years</span>
                            <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full">10 Q&A</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Focus Stack</label>
                    <div className="relative">
                        <select
                            value={selectedStack}
                            onChange={(e) => setSelectedStack(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 text-sm appearance-none focus:outline-none focus:border-orange-400 transition-colors cursor-pointer"
                        >
                            <option value="" disabled>Choose your focus area...</option>
                            {stacks.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-100 bg-gray-50/50"
                    >
                        <div className="p-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Select Difficulty Tier</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {levels.map(level => (
                                    <button
                                        key={level.id}
                                        className="flex flex-col items-start p-4 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-sm text-left transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`w-2 h-2 rounded-full ${level.dot}`}></span>
                                            <h5 className="text-gray-900 font-bold text-sm">{level.label}</h5>
                                        </div>
                                        <p className="text-xs text-gray-500">{level.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};