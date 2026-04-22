import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';
import { InterviewCard } from '../components/dashboard/InterviewCard';
import { Code, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ActiveSessionBanner from '../components/dashboard/ActiveSessionBanner';

export const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { navigate } = useRouter();
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  // All available niches for the teaser view
  const allNiches = useMemo(() => [
    {
      id: 'frontend',
      label: 'Frontend Developer',
      icon: Code,
      bgColor: 'bg-teal-50',
      accentColor: 'text-teal-800',
      stacks: ['React', 'NextJS', 'tailwindCSS', 'Vue', 'HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'backend',
      label: 'Backend Developer',
      icon: Code,
      bgColor: 'bg-amber-50',
      accentColor: 'text-amber-800',
      stacks: ['Node', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'Java', 'SpringBoot']
    },
    {
      id: 'fullstack',
      label: 'Full Stack Developer',
      icon: Zap,
      bgColor: 'bg-purple-50',
      accentColor: 'text-purple-800',
      stacks: ['React', 'NextJS', 'tailwindCSS', 'Vue', 'HTML', 'CSS', 'JavaScript', 'Node', 'Express', 'Python', 'Django', 'FastAPI', 'Go', 'Java', 'SpringBoot']
    },
    {
      id: 'devops',
      label: 'DevOps Engineer',
      icon: Code,
      bgColor: 'bg-blue-50',
      accentColor: 'text-blue-800',
      stacks: ['AWS + Terraform', 'Kubernetes + Docker', 'CI/CD Pipelines']
    },
    {
      id: 'datascience',
      label: 'Data Scientist',
      icon: Brain,
      bgColor: 'bg-emerald-50',
      accentColor: 'text-emerald-800',
      stacks: ['Python + Pandas', 'Machine Learning', 'TensorFlow + Deep Learning']
    },
    {
      id: 'ml',
      label: 'ML Engineer',
      icon: Brain,
      bgColor: 'bg-indigo-50',
      accentColor: 'text-indigo-800',
      stacks: ['PyTorch + ML Ops', 'Model Deployment', 'Feature Engineering']
    },
    {
      id: 'genai',
      label: 'Gen AI Engineer',
      icon: Zap,
      bgColor: 'bg-pink-50',
      accentColor: 'text-pink-800',
      stacks: ['LLM Integration', 'RAG Systems', 'Prompt Engineering']
    },
    {
      id: 'ai',
      label: 'AI Engineering',
      icon: Brain,
      bgColor: 'bg-orange-50',
      accentColor: 'text-orange-800',
      stacks: ['AI Architecture', 'ML Systems', 'Model Training']
    }
  ], []);

  const handleGuestCardClick = (nicheLabel) => {
    navigate('/login?redirect=/dashboard');
  };

  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/activeSession`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        console.log("active session response:", data); // ← add this
        if (data.activeSession) setActiveSession(data);
      } catch (err) {
        console.error("active session check failed:", err); // ← and this
      }
    };
    checkSession();
  }, []);

  const handleDiscard = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/interview/discard`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ sessionId: activeSession.sessionId }),
    });
    setActiveSession(null);
  };

  const handleResume = () => {
    sessionStorage.setItem('currentInterviewData', JSON.stringify({
      question: activeSession.currentQuestion,
      questionNumber: activeSession.questionNumber,
      level: activeSession.level,
    }));
    navigate(`/interview/${activeSession.sessionId}`);
  };

  const handleStartInterview = async (levelNumber, selectedStacks, trackType) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          trackType,
          level: levelNumber,
          techStack: selectedStacks
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start interview');
      }

      sessionStorage.setItem('currentInterviewData', JSON.stringify({
        question: data.question,
        questionNumber: data.questionNumber,
        level: levelNumber
      }));

      navigate(`/interview/${data.sessionId}`);
    } catch (error) {
      alert(error.message);
    }
  };

  // Guest teaser view - show all niches as locked cards
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FFFDF7] to-orange-50/30 pt-28 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Explore Interview Paths
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Choose your specialty and ace your technical interviews. Login to unlock personalized preparation.
            </p>
          </motion.div>

          {/* Grid of all niches for guests */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {allNiches.map((niche, index) => (
              <motion.div
                key={niche.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <InterviewCard
                  title={niche.label}
                  type="niche"
                  icon={<niche.icon className="w-6 h-6" />}
                  stacks={niche.stacks}
                  bgColorClass={niche.bgColor}
                  accentColorClass={niche.accentColor}
                  isLocked={true}
                  onCardClick={handleGuestCardClick}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-linear-to-r from-orange-400 to-amber-400 rounded-3xl p-12 shadow-lg shadow-orange-200/50">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Start?</h2>
              <p className="text-gray-800 mb-6 max-w-xl mx-auto">
                Sign in to select your specialty and get personalized interview preparation tailored to your career goals.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-md"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated user view - show personalized dashboard
  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500">
            Configure your interview parameters to begin the session.
          </p>
        </motion.div>

        {activeSession && (
          <ActiveSessionBanner
            session={activeSession}
            onResume={handleResume}
            onDiscard={handleDiscard}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* User's Selected Niche Card */}
          {user?.chosenNiche && (
            (() => {
              const selectedNiche = allNiches.find(n => n.id === user.chosenNiche);
              return selectedNiche ? (
                <InterviewCard
                  title={selectedNiche.label}
                  type="niche"
                  icon={<selectedNiche.icon className="w-6 h-6" />}
                  stacks={selectedNiche.stacks}
                  bgColorClass={selectedNiche.bgColor}
                  accentColorClass={selectedNiche.accentColor}
                  onStartInterview={handleStartInterview}
                />
              ) : null;
            })()
          )}

          {/* Mandatory Behavioral Card */}
          <InterviewCard
            title="Behavioral & Leadership"
            type="behavioral"
            icon={<Brain className="w-6 h-6" />}
            stacks={['STAR Method General', 'Conflict Resolution Focus', 'Managerial & Leadership']}
            bgColorClass="bg-amber-50"
            accentColorClass="text-amber-800"
            onStartInterview={handleStartInterview}
          />
        </motion.div>

        {/* Additional niches available */}
        {user?.chosenNiche && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Other Specialties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allNiches
                .filter(n => n.id !== user.chosenNiche)
                .slice(0, showAllSpecialties ? undefined : 6)
                .map((niche) => (
                  <InterviewCard
                    key={niche.id}
                    title={niche.label}
                    type="niche"
                    icon={<niche.icon className="w-6 h-6" />}
                    stacks={niche.stacks}
                    bgColorClass={niche.bgColor}
                    accentColorClass={niche.accentColor}
                    onStartInterview={handleStartInterview}
                  />
                ))}
            </div>

            {/* View More Button */}
            {!showAllSpecialties && allNiches.filter(n => n.id !== user.chosenNiche).length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex justify-center"
              >
                <button
                  onClick={() => setShowAllSpecialties(true)}
                  className="px-8 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  View More Specialties
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};