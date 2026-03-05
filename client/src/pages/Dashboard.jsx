import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { InterviewCard } from '../components/dashboard/InterviewCard';
import { Code, Brain, Plus } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  // Dynamic stack rendering based on chosen niche
  const getStacksForNiche = (niche) => {
    switch(niche) {
      case 'Frontend Developer': return ['React + Tailwind', 'Next.js + Framer', 'Vue + Nuxt'];
      case 'Backend Developer': return ['Node.js + Postgres', 'Python + Django', 'Go + Microservices'];
      case 'Data Scientist': return ['Python + Pandas', 'R + Machine Learning', 'TensorFlow + Deep Learning'];
      default: return ['General Programming', 'System Design'];
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-500">Configure your interview parameters to begin the session.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smart Niche Card */}
          <InterviewCard 
            title={user?.niche || 'General Developer'}
            type="niche"
            icon={<Code className="w-6 h-6" />}
            stacks={getStacksForNiche(user?.niche)}
            bgColorClass="bg-teal-50"
            accentColorClass="text-teal-800"
          />

          {/* Mandatory Behavioral Card */}
          <InterviewCard 
            title="Behavioral & Leadership"
            type="behavioral"
            icon={<Brain className="w-6 h-6" />}
            stacks={['STAR Method General', 'Conflict Resolution Focus', 'Managerial & Leadership']}
            bgColorClass="bg-amber-50"
            accentColorClass="text-amber-800"
          />
        </div>
      </div>
      
      {/* Floating Add Button matching the screenshot */}
      <div className="fixed bottom-10 right-10">
         <button className="flex items-center gap-2 px-6 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-full font-medium shadow-lg transition-transform hover:scale-105">
           <Plus className="w-5 h-5" /> Add New
         </button>
      </div>
    </div>
  );
};