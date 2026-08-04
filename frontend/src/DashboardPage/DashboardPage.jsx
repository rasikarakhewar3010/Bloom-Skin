import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getDashboardStats } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import { NavbarDemo } from '../NavbarDemo';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scan, 
  TrendingUp, 
  Flame, 
  Activity, 
  Bell, 
  ChevronRight, 
  Calendar,
  Sparkles,
  Camera,
  Layers,
  ClipboardList
} from 'lucide-react';

// ─────────────────────────────────────────────
//  BLOOM SCORE RING — Circular Gauge
// ─────────────────────────────────────────────
const BloomScoreRing = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#FDE2E4" strokeWidth="8" />
        <motion.circle
          cx="70" cy="70" r={radius} fill="none" 
          stroke="#F43F5E" strokeWidth="8" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-3xl font-black text-gray-900 leading-none tracking-tight">{animatedScore}</span>
        <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Score</span>
        <div className="mt-1.5 px-2 py-0.5 bg-pink-50 rounded-full border border-pink-100">
           <span className="text-[8px] font-black text-pink-500 whitespace-nowrap uppercase tracking-tighter">Improvement</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  SPARKLINE — Mini chart for metric cards
// ─────────────────────────────────────────────
const Sparkline = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const width = 80;
  const height = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = (max - min) || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' L ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─────────────────────────────────────────────
//  METRIC CARD — Stat with icon and sparkline
// ─────────────────────────────────────────────
const MetricCard = ({ icon: Icon, title, value, subtext, trend, sparkData, color }) => {
  const colorMap = {
    violet: { text: 'text-violet-500', bg: 'bg-violet-500' },
    teal: { text: 'text-teal-500', bg: 'bg-teal-500' },
    orange: { text: 'text-orange-500', bg: 'bg-orange-500' },
    blue: { text: 'text-blue-500', bg: 'bg-blue-500' },
    pink: { text: 'text-pink-500', bg: 'bg-pink-500' },
  };

  const style = colorMap[color] || colorMap.pink;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl bg-opacity-10 ${style.bg}`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
          <p className="text-xl font-black text-gray-900 mt-0.5 tracking-tight">{value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="min-h-[16px]">
          {trend ? (
            <p className={`text-[11px] font-bold flex items-center gap-1 ${trend.startsWith('+') ? 'text-teal-500' : 'text-rose-500'}`}>
              {trend} <span className="text-[9px] text-gray-400 font-medium">improvement</span>
            </p>
          ) : (
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight opacity-70">{subtext}</p>
          )}
        </div>
        {sparkData && sparkData.length > 1 && (
          <div className="opacity-80">
            <Sparkline data={sparkData} color={trend?.startsWith('+') ? '#14B8A6' : (color === 'teal' ? '#14B8A6' : '#8B5CF6')} />
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  DONUT CHART — Condition Distribution
// ─────────────────────────────────────────────
const ConditionDonut = ({ data, total }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center mx-auto">
      <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
        {data.map((item, i) => {
          const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
          const rotateOffset = (currentOffset / 100) * 360;
          currentOffset += item.percentage;
          return (
            <circle
              key={item.name}
              cx="80" cy="80" r={radius}
              fill="none" stroke={item.color} strokeWidth="18"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(${rotateOffset} 80 80)`}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-3xl font-black text-gray-900 leading-none">{total}</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Scans</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  TREND CHART — Severity over time
// ─────────────────────────────────────────────
const TrendChart = ({ data }) => {
  if (!data || data.length < 2) return <div className="h-48 flex items-center justify-center text-gray-300 font-bold text-xs uppercase tracking-widest">Analyzing more scans needed</div>;
  
  const width = 600;
  const height = 180;
  const padding = 30;
  const max = 100;
  const min = 0;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.confidence * 100 - min) / (max - min)) * (height - 2 * padding);
    return { x, y, val: (d.confidence * 100).toFixed(0) };
  });

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="relative w-full h-full min-h-[180px]">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Y Axis Grid */}
        {[0, 50, 100].map(v => (
          <g key={v}>
            <line 
              x1={padding} y1={height - padding - (v / 100) * (height - 2 * padding)} 
              x2={width - padding} y2={height - padding - (v / 100) * (height - 2 * padding)} 
              stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4"
            />
          </g>
        ))}

        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#F43F5E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#F43F5E" stroke="#fff" strokeWidth="2" />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─────────────────────────────────────────────
//  SCAN CARD — Detailed recent scan entry
// ─────────────────────────────────────────────
const ScanCard = ({ scan }) => {
  const date = new Date(scan.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="flex-shrink-0 w-56 bg-white rounded-3xl p-3 border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
        <img src={scan.imageUrl} alt="scan" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-sm">
          <span className="text-[9px] font-black text-teal-500 flex items-center gap-0.5">
             <TrendingUp className="w-2.5 h-2.5" /> {scan.prediction !== 'Clear Skin' ? 'Detected' : 'Clear'}
          </span>
        </div>
      </div>
      <div>
        <h4 className="font-black text-gray-900 text-base leading-tight tracking-tight">{scan.prediction}</h4>
        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
          {formattedDate} • {formattedTime}
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  QUICK ACTION — Large colorful tile
// ─────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, subtext, color, onClick }) => {
  const bgColors = {
    pink: 'bg-pink-500',
    violet: 'bg-violet-500',
    teal: 'bg-teal-500',
  };
  
  return (
    <button 
      onClick={onClick}
      className={`w-full p-6 rounded-[2.2rem] ${bgColors[color] || 'bg-pink-500'} flex flex-col items-start text-left text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative`}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
        <Icon size={100} />
      </div>
      <div className="bg-white bg-opacity-20 p-3 rounded-2xl mb-3">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-black mb-0.5 tracking-tight">{label}</h3>
      <p className="text-[10px] font-bold text-white text-opacity-80 leading-relaxed uppercase tracking-tighter">{subtext}</p>
    </button>
  );
};

// ─────────────────────────────────────────────
//  MAIN DASHBOARD
// ─────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Real-time sparkline calculations
  const scanSparkData = useMemo(() => {
    if (!stats?.timeline) return [0, 0];
    return stats.timeline.map(t => t.scans);
  }, [stats]);

  const improvementSparkData = useMemo(() => {
    if (!stats?.severityTrend) return [0, 0];
    return stats.severityTrend.map(s => 1 - s.confidence);
  }, [stats]);

  const improvementPercent = useMemo(() => {
    if (!stats?.severityTrend || stats.severityTrend.length < 2) return null;
    const first = stats.severityTrend[0].confidence;
    const last = stats.severityTrend[stats.severityTrend.length - 1].confidence;
    const diff = ((last - first) * 100).toFixed(0);
    return diff >= 0 ? `+${diff}%` : `${diff}%`;
  }, [stats]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-12 h-12 rounded-full border-4 border-pink-50 border-t-pink-500" 
      />
      <p className="mt-4 text-pink-500 font-black tracking-widest text-[10px] uppercase animate-pulse">Syncing Stats...</p>
    </div>
  );

  if (!stats) return null;

  return (
    <>
      <NavbarDemo />
      <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
        <div className="max-w-[1300px] mx-auto px-6 py-8">
          
          {/* TOP SECTION: Greeting & Primary Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
            
            {/* Hero Card */}
            <div className="xl:col-span-5 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
               <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-50 rounded-full blur-3xl opacity-40" />
               
               <div className="flex-1 text-center md:text-left z-10">
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                    {greeting}, <span className="text-pink-500">{user?.name?.split(' ')[0] || 'there'}!</span> 👋
                  </h1>
                  <p className="text-gray-400 font-bold text-xs mt-3 leading-relaxed max-w-[240px]">
                    Your skin is improving beautifully. Keep following your routine!
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-xl border border-pink-100">
                    <TrendingUp className="w-3 h-3 text-pink-500" />
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">You're doing great!</span>
                  </div>
               </div>

               <div className="relative z-10">
                  <BloomScoreRing score={stats.bloomScore} />
               </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <MetricCard 
                  icon={Scan} 
                  title="Total Scans" 
                  value={stats.totalScans} 
                  subtext="All time" 
                  sparkData={scanSparkData} 
                  color="violet"
               />
               <MetricCard 
                  icon={TrendingUp} 
                  title="Improvement" 
                  value={improvementPercent || 'N/A'} 
                  trend={improvementPercent} 
                  sparkData={improvementSparkData} 
                  color="teal"
               />
               <MetricCard 
                  icon={Flame} 
                  title="Current Streak" 
                  value={`${stats.streak} week`} 
                  subtext="Keep it up!" 
                  color="orange"
               />
               <MetricCard 
                  icon={Activity} 
                  title="Trend" 
                  value="Stable" 
                  subtext="Condition is stable" 
                  color="blue"
               />
            </div>
          </div>

          {/* MIDDLE SECTION: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            
            {/* Condition Distribution */}
            <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
               <div className="flex items-center gap-2.5 mb-6">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Condition Distribution</h2>
               </div>
               
               <ConditionDonut data={stats.conditionFrequency} total={stats.totalScans} />

               <div className="mt-8 space-y-3 px-2">
                  {stats.conditionFrequency.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-gray-500">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-gray-900">{item.percentage}%</span>
                    </div>
                  ))}
               </div>
               <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Based on recent scan analysis</span>
               </div>
            </div>

            {/* Severity Trend Chart */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-pink-500" />
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Severity Trend</h2>
                  </div>
                  <div className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      Last 6 scans <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
               </div>
               
               <TrendChart data={stats.severityTrend} />
               
               <div className="mt-4 flex justify-center">
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Severity score over time</span>
               </div>
            </div>
          </div>

          {/* LOWER SECTION: Recent Scans */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 mb-8">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2.5">
                  <ClipboardList className="w-4 h-4 text-gray-400" />
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Scans</h2>
               </div>
               <button onClick={() => navigate('/history')} className="text-[10px] font-black text-pink-500 hover:text-pink-600 transition flex items-center gap-1 uppercase tracking-widest">
                  View all <ChevronRight className="w-3 h-3" />
               </button>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
              <AnimatePresence>
                {stats.recentScans.map((scan, i) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ScanCard scan={scan} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* BOTTOM SECTION: Daily Tip & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Daily Tip */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 flex items-center gap-5 group hover:shadow-md transition-all duration-300">
               <div className="p-3 bg-pink-50 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-gray-900 flex items-center gap-1 uppercase tracking-widest">
                    Daily Tip <span className="text-pink-500">🌸</span>
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 leading-relaxed">
                    Consistency is key. Apply sunscreen every morning!
                  </p>
               </div>
            </div>

            {/* Quick Action Buttons */}
            <QuickAction 
              icon={Camera} 
              label="New Scan" 
              subtext="Analyze your skin" 
              color="pink" 
              onClick={() => navigate('/aichat')}
            />
            <QuickAction 
              icon={ClipboardList} 
              label="Recommendations" 
              subtext="See suggestions" 
              color="violet" 
              onClick={() => navigate('/recommendations')}
            />
            <QuickAction 
              icon={Calendar} 
              label="My Routine" 
              subtext="Track daily tasks" 
              color="teal" 
              onClick={() => navigate('/routine')}
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default DashboardPage;
