import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2, Brain, AlertCircle, Volume2 } from 'lucide-react';
import { useRouter } from '../contexts/RouterContext';

export const Interview = () => {
  const { path, navigate } = useRouter();
  const sessionId = path.split('/')[2];
  
  const [question, setQuestion] = useState('Loading...');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [status, setStatus] = useState('ready'); // ready, listening, processing
  const [errorToast, setErrorToast] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Fetch initial question from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem('currentInterviewData');
    if (data) {
      const parsed = JSON.parse(data);
      setQuestion(parsed.question);
      setQuestionNumber(parsed.questionNumber);
    } else {
      setErrorToast("No active question found! Returning to dashboard.");
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [navigate]);

  // Speech Synthesis Hook (Auto-reads question)
  useEffect(() => {
    if (question && question !== 'Loading...') {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(question);
      
      // Try to find a good English voice
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural')));
        if (preferredVoice) utterance.voice = preferredVoice;
      };
      
      setVoice();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = setVoice;
      }

      utterance.rate = 0.95; // Slightly slower for a clear, interviewer-like cadence
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      // Failsafes to stop speaking indicator
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utterance.onpause = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }

    // Cleanup when component unmounts or before next question plays
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [question]);

  const startRecording = async () => {
    try {
      // Instantly quiet the AI if user starts answering early
      window.speechSynthesis.cancel();
      setIsSpeaking(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = submitAnswer;

      mediaRecorder.start(250); 
      setStatus('listening');
    } catch (error) {
      setErrorToast("Can't get the microphone permissions check your settings");
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setStatus('processing');
    }
  };

  const submitAnswer = async () => {
    const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('audio', audioBlob, 'answer.webm');

    try {
      const response = await fetch('http://localhost:5000/api/interview/answer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit answer');

      if (data.done) {
        sessionStorage.setItem('interviewResults', JSON.stringify(data));
        navigate(`/results/${sessionId}`);
      } else {
        setQuestion(data.nextQuestion);
        setQuestionNumber(data.questionNumber);
        setStatus('ready');
      }
    } catch (error) {
      setErrorToast(error.message);
      setStatus('ready');
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] pt-28 pb-20 px-6 relative flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 z-50 bg-red-500/10 border border-red-500/50 text-red-100 px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            {errorToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl relative z-10">
        <motion.div 
          className="bg-gray-900/50 border border-gray-800/80 rounded-[2rem] backdrop-blur-2xl p-8 md:p-12 shadow-2xl flex flex-col items-center min-h-[500px] justify-between relative overflow-hidden ring-1 ring-white/5"
        >
          {/* Subtle grid pattern overlay purely for aesthetics */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>

          {/* Header Row */}
          <div className="w-full flex justify-between items-center mb-8 relative z-10">
            <span className="px-5 py-2 bg-gray-800/80 border border-gray-700/50 text-orange-400 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
              Question {questionNumber} / 3
            </span>
            
            {/* Speaking Indicator */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold tracking-wider uppercase"
                >
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  AI Interviewer Speaking
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Question Text */}
          <motion.div 
            key={questionNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 w-full flex-1 flex items-center justify-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-50 leading-tight tracking-tight max-w-3xl drop-shadow-md">
              "{question}"
            </h2>
          </motion.div>

          {/* Central Record Button Area */}
          <div className="relative flex flex-col items-center justify-center mt-auto w-full z-10">
            <div className="relative flex justify-center items-center h-40 w-40 mb-6">
              {/* Outer Ripple Effects for Listening */}
              {status === 'listening' && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 bg-red-500/20 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 0.2 }}
                    className="absolute inset-0 bg-red-500/10 rounded-full"
                  />
                </>
              )}

              <motion.button
                whileHover={status === 'ready' ? { scale: 1.05 } : {}}
                whileTap={status === 'ready' ? { scale: 0.95 } : {}}
                onClick={status === 'ready' ? startRecording : status === 'listening' ? stopRecording : undefined}
                disabled={status === 'processing'}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 border-2
                  ${status === 'ready' ? 'bg-gradient-to-tr from-gray-800 to-gray-700 border-gray-600 hover:border-gray-500 hover:shadow-gray-700/50' : ''}
                  ${status === 'listening' ? 'bg-gradient-to-tr from-red-600 to-red-500 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''}
                  ${status === 'processing' ? 'bg-gradient-to-tr from-orange-600 to-orange-500 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.4)] cursor-not-allowed opacity-90' : ''}
                `}
              >
                {status === 'ready' && <Mic className="w-10 h-10 drop-shadow-md" />}
                {status === 'listening' && <Square className="w-8 h-8 drop-shadow-md" fill="currentColor" />}
                {status === 'processing' && <Loader2 className="w-10 h-10 animate-spin drop-shadow-md" />}
              </motion.button>
            </div>

            {/* Status Text Area */}
            <div className="h-8 flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 justify-center font-medium tracking-widest text-xs"
                >
                  {status === 'ready' && <span className="text-gray-400 uppercase">Tap microphone to answer</span>}
                  {status === 'listening' && (
                    <>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                      <span className="text-red-400 uppercase">Recording... Tap to conclude</span>
                    </>
                  )}
                  {status === 'processing' && (
                    <>
                      <Brain className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 uppercase">AI is analyzing response...</span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
