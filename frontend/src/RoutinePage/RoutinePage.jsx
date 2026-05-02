import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getRoutine, trackRoutine } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import { NavbarDemo } from '../NavbarDemo';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
//  ROUTINE STEP CARD (Boutique Style)
// ─────────────────────────────────────────────
const RoutineStepCard = ({ step, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 group relative overflow-hidden cursor-pointer"
    >
      {/* Numbering Circle */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
        {index + 1}
      </div>

      {/* Product Image Holder (Placeholder logic as before but cleaner) */}
      <div className="flex-shrink-0 w-20 h-24 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden p-2">
        <img 
          src={step.imageUrl || "https://cdn-icons-png.flaticon.com/512/3233/3233497.png"} 
          alt={step.product}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2 justify-center sm:justify-start">
          <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{step.type}</span>
          {step.forCondition && (
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">· for {step.forCondition}</span>
          )}
        </div>
        <h4 className="font-bold text-gray-900 text-lg mb-1 leading-tight group-hover:text-pink-600 transition-colors">
          {step.product}
        </h4>
        <p className="text-[12px] text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1.5 uppercase tracking-tighter">
          <span className="text-sm">🕐</span> {step.usage}
        </p>
      </div>

      {/* Features Tags (Desktop Only) */}
      <div className="hidden lg:flex flex-col gap-2 items-end">
        <div className="flex items-center gap-2 text-xs text-teal-600 font-bold">
          <span>✨</span> {step.type === 'Cleanser' ? 'Gentle' : 'Brightening'}
        </div>
        <div className="flex items-center gap-2 text-xs text-teal-600 font-bold">
          <span>🛡️</span> pH Balanced
        </div>
      </div>

      {/* CTA Button */}
      <motion.a
        href={step.buyLink}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex-shrink-0 px-6 py-3 bg-pink-50 text-pink-500 font-bold text-[11px] uppercase tracking-widest rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-sm border border-pink-100"
      >
        Shop Best Price →
      </motion.a>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
//  CONFLICT CENTER
// ─────────────────────────────────────────────
const ConflictCenter = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-8 mb-10 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg font-black text-amber-900 flex items-center gap-3">
          <span className="text-2xl">⚠️</span> Ingredient Conflicts Detected
        </h3>
        <button className="text-xs font-bold text-amber-700 underline flex items-center gap-1 hover:text-amber-900">
          <span className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center text-[8px] italic">i</span>
          Learn More
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {conflicts.map((conflict, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl text-amber-500 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <div>
              <p className="text-[13px] text-amber-900 font-bold">
                {conflict.a} <span className="text-amber-400 font-medium">×</span> {conflict.b}
              </p>
              <p className="text-[10px] text-amber-700 font-medium opacity-80 leading-tight">
                Can cause irritation or reduce effectiveness.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 blur-[100px] rounded-full -mr-32 -mt-32" />
    </div>
  );
};

// ─────────────────────────────────────────────
//  SIDEBAR COMPONENT
// ─────────────────────────────────────────────
const SidebarSection = ({ title, icon, children, colorClass = "bg-white" }) => (
  <div className={`${colorClass} border border-gray-100 rounded-[32px] p-6 shadow-sm mb-6`}>
    <h3 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
      <span className="text-xl">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

// ─────────────────────────────────────────────
//  MAIN ROUTINE PAGE
// ─────────────────────────────────────────────
const RoutinePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth();
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const navigate = useNavigate();

  const fetchRoutine = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getRoutine();
      setData(result);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please log in to view your routine.' : 'Failed to generate routine.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoutine(); }, [fetchRoutine]);

  const handleTrackRoutine = async () => {
    try {
      const res = await trackRoutine(timeOfDay === 'morning' ? 'am' : 'pm');
      if (res?.routineTracking) {
        setUser({ ...user, routineTracking: res.routineTracking });
      }
    } catch (err) {
      console.error("Tracking error:", err);
    }
  };

  const isCompletedToday = (() => {
    if (!user?.routineTracking) return false;
    const lastDate = timeOfDay === 'morning' 
      ? user.routineTracking.lastAmCompletion 
      : user.routineTracking.lastPmCompletion;
    if (!lastDate) return false;
    return new Date(lastDate).toDateString() === new Date().toDateString();
  })();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full mx-auto"
          />
          <p className="mt-6 text-gray-400 font-bold text-sm tracking-widest uppercase">Building Your Routine...</p>
        </div>
      </div>
    );
  }

  if (error || !data) return (
    <div className="text-center py-40">
      <p className="text-gray-400 mb-6">{error || 'Session Expired'}</p>
      <button onClick={() => navigate('/login')} className="px-8 py-3 bg-pink-500 text-white rounded-full font-bold">Back to Login</button>
    </div>
  );

  const { routine, basedOn } = data;
  const currentSteps = timeOfDay === 'morning' ? routine.morning : routine.night;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <NavbarDemo />

      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        
        {/* HERO SECTION */}
        <section className="relative flex flex-col lg:flex-row items-center justify-between mb-16 pt-10">
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 border border-orange-100 shadow-sm"
            >
              🔥 Streak: {user?.routineTracking?.streak || 0} Days
            </motion.div>
            
            <h1 className="text-[42px] lg:text-[64px] font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Your Skincare Routine
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-500 font-medium max-w-xl leading-relaxed">
              Your routine is customized for <span className="text-pink-500 font-bold">{basedOn.conditions.join(' & ')} Skin</span>, 
              based on your 3 most recent scans.
            </p>
          </div>

          {/* Hero Image Block */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center relative"
          >
            <div className="absolute inset-0 bg-pink-100/30 blur-[120px] rounded-full scale-125" />
            <img 
              src="/images/Routine_image.png" 
              alt="Routine Hero" 
              className="relative w-full max-w-[500px] drop-shadow-2xl floating-animation"
            />
          </motion.div>
        </section>

        {/* DATA SUMMARY BAR */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="flex gap-3">
              {basedOn.conditions.map(c => (
                <span key={c} className="px-5 py-2 bg-teal-50 text-teal-600 rounded-full font-bold text-xs uppercase tracking-widest border border-teal-100">
                  {c}
                </span>
              ))}
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Latest Scan Intelligence</p>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Detected <span className="font-black text-gray-900">{basedOn.latestScan.prediction}</span> with{' '}
                <span className="text-pink-500 font-black">{(basedOn.latestScan.confidence * 100).toFixed(0)}%</span> accuracy. 
                {basedOn.latestScan.description || ''}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[32px] p-8 flex items-center justify-center gap-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl">📅</div>
            <div>
              <p className="text-2xl font-black text-gray-900">{basedOn.totalScansAnalyzed}</p>
              <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Recent Scans</p>
            </div>
          </div>
        </section>

        {/* MAIN BODY GRID */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column (Routine) */}
          <div className="flex-1">
            
            <ConflictCenter conflicts={routine.conflicts} />

            {/* PREMIUM ANIMATED TOGGLE */}
            <div className="flex flex-col items-center mb-10">
              <div className="bg-gray-100/80 backdrop-blur-md rounded-full p-1.5 flex relative w-full max-w-[320px] shadow-inner border border-gray-200/50 mb-6">
                {/* Sliding Background Pill */}
                <motion.div
                  className={`absolute top-1.5 bottom-1.5 rounded-full shadow-lg z-0 ${
                    timeOfDay === 'morning' 
                      ? 'bg-gradient-to-r from-teal-400 to-emerald-500' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                  }`}
                  initial={false}
                  animate={{
                    x: timeOfDay === 'morning' ? 0 : '100%',
                    width: '50%'
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  style={{
                    left: '1.5px',
                    right: 'auto',
                    width: 'calc(50% - 3px)'
                  }}
                />

                <button
                  onClick={() => setTimeOfDay('morning')}
                  className={`flex-1 py-3.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    timeOfDay === 'morning' ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <motion.span 
                    animate={{ scale: timeOfDay === 'morning' ? 1.2 : 1, rotate: timeOfDay === 'morning' ? 0 : -20 }}
                    className="text-lg"
                  >
                    ☀️
                  </motion.span>
                  Morning
                </button>

                <button
                  onClick={() => setTimeOfDay('night')}
                  className={`flex-1 py-3.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-colors duration-300 cursor-pointer flex items-center justify-center gap-2 relative z-10 ${
                    timeOfDay === 'night' ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <motion.span 
                    animate={{ scale: timeOfDay === 'night' ? 1.2 : 1, rotate: timeOfDay === 'night' ? 0 : 20 }}
                    className="text-lg"
                  >
                    🌙
                  </motion.span>
                  Night
                </button>
              </div>

              {/* Mark as Done Button */}
              <motion.button
                whileHover={!isCompletedToday ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isCompletedToday ? { scale: 0.95 } : {}}
                onClick={handleTrackRoutine}
                disabled={isCompletedToday}
                className={`px-10 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-lg transition-all flex items-center gap-3 ${
                  isCompletedToday 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' 
                    : 'bg-white text-gray-900 border border-gray-100 hover:shadow-2xl hover:border-pink-200'
                }`}
              >
                {isCompletedToday ? (
                  <>
                    <span className="text-base">✅</span> {timeOfDay.toUpperCase()} Completed Today
                  </>
                ) : (
                  <>
                    <span className="text-base">⭕</span> Mark {timeOfDay.toUpperCase()} as Done
                  </>
                )}
              </motion.button>
            </div>

            {/* ROUTINE LIST */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={timeOfDay}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {currentSteps.map((step, i) => (
                    <RoutineStepCard key={i} step={step} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="lg:w-[380px]">
            <SidebarSection title="Active Ingredients" icon="🔬" colorClass="bg-white">
              <div className="space-y-4">
                {routine.activeIngredients?.map((ing, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center font-black text-xs">
                        {ing.priority}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-800">{ing.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{ing.benefit.split('—')[0]}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title="Avoid These Ingredients" icon="🚫" colorClass="bg-red-50/50">
              <div className="space-y-3">
                {routine.avoidIngredients?.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/50 border border-red-100 rounded-2xl group hover:scale-105 transition-all cursor-pointer">
                    <span className="text-red-400">⚠️</span>
                    <span className="text-[12px] font-bold text-red-700">{ing}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-red-400 font-medium mt-6 leading-relaxed">
                DIY remedies like toothpaste or lemon can cause severe burns on inflamed skin.
              </p>
            </SidebarSection>
          </aside>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/aichat')}
            className="w-full md:w-auto px-12 py-4 bg-pink-500 text-white font-black uppercase tracking-widest text-sm rounded-full shadow-2xl hover:bg-pink-600 flex items-center justify-center gap-3"
          >
            📸 New Scan
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/recommendations')}
            className="w-full md:w-auto px-12 py-4 bg-white text-gray-800 font-black uppercase tracking-widest text-sm rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            ✨ View Recommendations
          </motion.button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .floating-animation {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
};

export default RoutinePage;

