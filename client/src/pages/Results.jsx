import React, { useEffect, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, BarChart2, Star, Award } from 'lucide-react';
import api from '../config/axios';

export const Results = () => {
  const { navigate } = useRouter();
  const [results, setResults] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('interviewResults');
    if (data) setResults(JSON.parse(data));
    else navigate('/dashboard');
  }, [navigate]);

  const handleNextLevel = async () => {
    try {
      setIsStarting(true);
      const response = await api.post('/api/interview/start', {
        trackType: results.trackType,
        level: results.level + 1,
        techStack: results.techStack
      });
      const data = response.data

      sessionStorage.setItem('currentInterviewData', JSON.stringify({
        question: data.question,
        questionNumber: data.questionNumber,
        level: results.level + 1
      }));

      navigate(`/interview/${data.sessionId}`);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
      setIsStarting(false);
    }
  };

  if (!results) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${results.passed ? 'bg-green-100 text-green-600 shadow-green-200/50' : 'bg-red-100 text-red-600 shadow-red-200/50'}`}>
              {results.passed ? <Award className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            {results.passed ? 'Interview Passed!' : 'Need More Practice'}
          </h1>
          <p className="text-xl text-gray-600">
            Final Score: <span className="font-bold text-gray-900">{results.finalScore} / 10</span>
          </p>
        </motion.div>

        <div className="space-y-6">
          {results.breakdown.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-sm">
                      Q{idx + 1}
                    </span>
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-sm font-semibold">
                      <Star className="w-4 h-4" /> {item.score} / 10
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{item.question}</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex gap-2 items-center mb-2">
                      <BarChart2 className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Feedback</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.feedback}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-6"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-bold shadow-lg transition-all"
          >
            Return to Dashboard <ChevronRight className="w-5 h-5" />
          </button>

          {results.passed && results.level < 3 && (
            <button
              onClick={handleNextLevel}
              disabled={isStarting}
              className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50"
            >
              {isStarting ? 'Loading...' : `Start Level ${results.level + 1}`}
              {!isStarting && <ChevronRight className="w-5 h-5" />}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};
