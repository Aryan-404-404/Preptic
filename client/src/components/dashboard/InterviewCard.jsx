import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Lock, X } from 'lucide-react';

export const InterviewCard = ({ title, type, icon, stacks, bgColorClass, accentColorClass, isLocked = false, onCardClick = null, onStartInterview = null }) => {
    const [selectedStacks, setSelectedStacks] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (selectedStacks.length > 0 && !isLocked) setIsExpanded(true);
        else if (selectedStacks.length === 0) setIsExpanded(false);
    }, [selectedStacks, isLocked]);

    const levels = [
        { id: 'easy', label: 'Easy - Level', desc: 'Basic concepts & fundamentals', dot: 'bg-emerald-400', levelNumber: 1 },
        { id: 'medium', label: 'Mid - Level', desc: 'Architecture & problem solving', dot: 'bg-blue-400', levelNumber: 2 },
        { id: 'hard', label: 'High - Level', desc: 'System design & high-pressure', dot: 'bg-purple-400', levelNumber: 3 }
    ];

    const handleCardClick = () => {
        if (isLocked && onCardClick) {
            onCardClick(title);
        }
    };

    const handleAdd = (stack) => {
        if (!selectedStacks.includes(stack)) {
            setSelectedStacks([...selectedStacks, stack]);
        }
        setInputValue('');
    };

    const handleRemove = (stack) => {
        setSelectedStacks(selectedStacks.filter(s => s !== stack));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            handleAdd(inputValue.trim());
        }
    };

    const availableSuggestions = (stacks || []).filter(s =>
        !selectedStacks.includes(s) &&
        s.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <motion.div
            layout
            onClick={handleCardClick}
            className={`bg-white border border-gray-200 transition-all duration-300 rounded-2xl ${isExpanded && !isLocked ? 'shadow-md border-gray-300' : 'shadow-sm'} ${isLocked
                ? 'cursor-pointer hover:shadow-md hover:border-orange-300'
                : 'hover:shadow-md'
                } ${showSuggestions ? 'z-50' : 'z-1'}`}
            style={{ position: 'relative' }}
        >
            <div className="p-6 relative z-10">
                {/* Lock Badge for Guests */}
                {isLocked && (
                    <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full shadow-sm">
                            <Lock className="w-3.5 h-3.5 text-orange-600" />
                            <span className="text-xs font-semibold text-orange-700">Login to Unlock</span>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${bgColorClass} ${accentColorClass} ${isLocked ? 'opacity-60' : ''}`}>
                        {type === 'niche' ? title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'BH'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className={`text-xl font-bold ${isLocked ? 'text-gray-600' : 'text-gray-900'}`}>{title}</h3>
                            {isExpanded && !isLocked && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className={`text-sm mt-1 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                            {type === 'niche' ? 'Technical domain assessment' : 'Mandatory soft-skills & leadership'}
                        </p>

                        {/* Tags matching screenshot style */}
                        <div className="flex gap-2 mt-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${isLocked ? 'text-gray-400 bg-gray-50 border border-gray-200' : 'text-gray-700 bg-white border border-gray-300'}`}>10 Q&A</span>
                        </div>
                    </div>
                </div>

                {!isLocked && (
                    <div className="mt-4 relative z-20">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Focus Stack</label>
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-sm transition-all flex flex-wrap gap-2 items-center min-h-[46px]">
                            {selectedStacks.map(stack => (
                                <span key={stack} className="px-3 py-1 text-xs font-medium rounded-full text-gray-700 bg-white border border-gray-300 flex items-center gap-1 shadow-sm">
                                    {stack}
                                    <button
                                        type="button"
                                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onClick={(e) => { e.stopPropagation(); handleRemove(stack); }}
                                        className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors ml-0.5 flex items-center justify-center rounded-full hover:bg-red-50"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={selectedStacks.length === 0 ? "Type or select skills..." : ""}
                                className="flex-1 bg-transparent min-w-[140px] text-sm text-gray-900 focus:outline-none placeholder-gray-400 py-1 px-2"
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            />
                        </div>

                        <AnimatePresence>
                            {showSuggestions && availableSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                                    className="absolute top-[100%] left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto"
                                >
                                    {availableSuggestions.map(s => (
                                        <div
                                            key={s}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => handleAdd(s)}
                                            className="px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 hover:text-orange-900 font-medium transition-colors"
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isExpanded && !isLocked && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gray-100 bg-gray-50/50 overflow-hidden rounded-b-2xl"
                    >
                        <div className="p-6 relative z-0">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Select Difficulty Tier</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {levels.map(level => (
                                    <button
                                        key={level.id}
                                        onClick={() => onStartInterview && onStartInterview(level.levelNumber, selectedStacks, type)}
                                        className="flex flex-col items-start p-4 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:shadow-sm text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
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