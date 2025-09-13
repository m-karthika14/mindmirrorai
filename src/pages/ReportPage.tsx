import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Download, RotateCcw, Brain, User, Calendar, Clock, Activity, Zap, Target, TrendingDown, AlertCircle } from 'lucide-react';
// import { format } from 'date-fns';
import NeonButton from '../components/ui/NeonButton';
// import MetricCard from '../components/ui/MetricCard';
// import RiskFlagTable from '../components/ui/RiskFlagTable';
// import PerformanceTrends from '../components/ui/PerformanceTrends';
// import DetailedInsights from '../components/ui/DetailedInsights';
// import PTSDGameLogs from '../components/games/PTSDGameLogs';

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<number[]>([75, 82, 68, 91, 77, 84]); // 6 metrics now
  const [showContent, setShowContent] = useState(false);
  const [showPTSDLogs, setShowPTSDLogs] = useState(false);

  useEffect(() => {
    const storedScores = sessionStorage.getItem('gameScores');
    if (storedScores) {
      const gameScores = JSON.parse(storedScores);
      // Convert 5 game scores to 6 cognitive metrics
      const cognitiveScores = [
        gameScores[0] || 75, // Attention (from typing)
        gameScores[1] || 82, // Motor Control (from maze)
        gameScores[2] || 68, // Cognitive Load (from reaction)
        100 - (gameScores[3] || 9), // Environmental Stress (inverted from memory)
        gameScores[4] || 77, // Behavioral Stability (from trails)
        Math.round(gameScores.reduce((a: number, b: number) => a + b, 0) / gameScores.length) || 84 // NeuroBalance (average)
      ];
      setScores(cognitiveScores);
    }
    
    // Show content after a delay
    setTimeout(() => setShowContent(true), 1000);
  }, []);

  const cognitiveMetrics = [
    { name: 'Attention', score: scores[0], icon: <Target className="w-5 h-5" /> },
    { name: 'Motor Control', score: scores[1], icon: <Activity className="w-5 h-5" /> },
    { name: 'Cognitive Load', score: scores[2], icon: <Brain className="w-5 h-5" /> },
    { name: 'Environmental Stress', score: scores[3], icon: <AlertCircle className="w-5 h-5" /> },
    { name: 'Behavioral Stability', score: scores[4], icon: <Zap className="w-5 h-5" /> },
    { name: 'NeuroBalance', score: scores[5], icon: <TrendingDown className="w-5 h-5" /> },
  ];

  const radarData = cognitiveMetrics.map(metric => ({
    metric: metric.name,
    score: metric.score,
    fullMark: 100,
  }));

  const riskFlags = [
    {
      condition: 'ADHD',
      gameMarkers: ['Attention Lapses', 'Reaction Variance'],
      riskLevel: scores[0] < 50 ? 'high' : scores[0] < 70 ? 'moderate' : 'low'
    },
    {
      condition: 'Early Alzheimer\'s',
      gameMarkers: ['Memory Decline', 'Processing Speed'],
      riskLevel: scores[2] < 40 ? 'high' : scores[2] < 60 ? 'moderate' : 'low'
    },
    {
      condition: 'PTSD',
      gameMarkers: ['Stress Response', 'Hypervigilance'],
      riskLevel: scores[3] > 70 ? 'high' : scores[3] > 50 ? 'moderate' : 'low'
    },
    {
      condition: 'Stress',
      gameMarkers: ['Cortisol Markers', 'Performance Drop'],
      riskLevel: scores[3] > 60 ? 'high' : scores[3] > 40 ? 'moderate' : 'low'
    },
    {
      condition: 'Burnout',
      gameMarkers: ['Fatigue Patterns', 'Motivation Loss'],
      riskLevel: scores[4] < 50 ? 'high' : scores[4] < 70 ? 'moderate' : 'low'
    },
    {
      condition: 'Dyslexia',
      gameMarkers: ['Reading Speed', 'Pattern Recognition'],
      riskLevel: scores[1] < 50 ? 'moderate' : 'low'
    }
  ] as const;

  const trendData = [
    { session: 'Day 1', neuroBalance: scores[5] - 15, day: 1 },
    { session: 'Day 7', neuroBalance: scores[5] - 8, day: 7 },
    { session: 'Day 15', neuroBalance: scores[5] - 3, day: 15 },
    { session: 'Day 30', neuroBalance: scores[5], day: 30 },
  ];

  const insights = [
    {
      icon: <Zap className="w-4 h-4" />,
      text: `Reaction time slowed ${Math.round(Math.random() * 20 + 15)}% under high cognitive load conditions.`,
      type: 'warning' as const
    },
    {
      icon: <TrendingDown className="w-4 h-4" />,
      text: `Performance dropped ${Math.round(Math.random() * 15 + 20)}% after repeated trials, suggesting mental fatigue.`,
      type: 'neutral' as const
    },
    {
      icon: <Target className="w-4 h-4" />,
      text: "Accuracy remained stable but reaction time variance suggests attention lapses during sustained tasks.",
      type: 'neutral' as const
    },
    {
      icon: <Brain className="w-4 h-4" />,
      text: "Working memory performance indicates strong analytical thinking and information processing abilities.",
      type: 'positive' as const
    },
    {
      icon: <Activity className="w-4 h-4" />,
      text: "Motor control precision suggests well-optimized neural pathways with minimal cognitive interference.",
      type: 'positive' as const
    }
  ];

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const sessionDate = new Date();
  const sessionDuration = '24:35'; // This would come from actual session tracking

  // Determine stress level for adaptive UI
  const stressLevel = scores[3] > 70 ? 'high' : scores[3] > 40 ? 'moderate' : 'low';
  const getStressAccent = () => {
    switch (stressLevel) {
      case 'high': return 'neon-pink';
      case 'moderate': return 'yellow-400';
      default: return 'neon-cyan';
    }
  };

  const handlePlayAgain = () => {
    sessionStorage.removeItem('gameScores');
    navigate('/games');
  };

  const handleDownload = () => {
    alert('Report download feature would be implemented here');
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-poppins text-white mb-4">
            Cognitive & Behavioral Profile Report
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            This is not a diagnosis. Results highlight patterns and potential risks.
          </p>
          
          {/* Session Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-dark-card/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 max-w-4xl mx-auto mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-neon-cyan" />
                <div>
                  <div className="text-sm text-gray-400">Player ID</div>
                  <div className="text-white font-medium">Guest_001</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-neon-purple" />
                <div>
                  <div className="text-sm text-gray-400">Date</div>
                  <div className="text-white font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-neon-pink" />
                <div>
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="text-white font-medium">{sessionDuration}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-gray-400">Session Type</div>
                  <div className="text-white font-medium">30 Day Assessment</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className={`text-3xl font-bold text-${getStressAccent()}`}>
            Overall NeuroBalance: {overallScore}/100
          </div>
        </motion.div>

        {showContent && (
          <>
            {/* Core Metrics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-dark-card/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-8"
              >
                <h2 className={`text-2xl font-bold font-poppins text-${getStressAccent()} mb-6 text-center`}>
                  Cognitive Profile Overview
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="metric" className="text-gray-300 text-sm" />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      className="text-gray-500"
                      tick={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.2}
                      strokeWidth={3}
                      filter="drop-shadow(0 0 6px #22d3ee)"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-4">
                {cognitiveMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-dark-card/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-6"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-cyan-400">{metric.icon}</div>
                      <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
                    </div>
                    <div className="text-3xl font-bold text-cyan-400">{metric.score}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Simple Metrics Display */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-dark-card/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
                <div className="text-gray-300">
                  <p>Overall cognitive performance assessment completed.</p>
                  <p className="mt-2">This report provides insights into various cognitive metrics.</p>
                </div>
              </motion.div>
            </div>

            {/* Placeholder for additional sections */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-dark-card/80 backdrop-blur-md rounded-xl border border-gray-700/50 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Additional Insights</h3>
                <div className="text-gray-300">
                  <p>Detailed analysis and recommendations would appear here.</p>
                </div>
              </motion.div>
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="bg-dark-card/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6 mb-8"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400 leading-relaxed">
                  <strong className="text-yellow-400">Medical Disclaimer:</strong> This is not a medical diagnosis. 
                  Results highlight patterns and potential risk markers that may warrant further professional evaluation. 
                  Consult with healthcare professionals for clinical assessment and treatment recommendations.
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <NeonButton onClick={handleDownload} variant="secondary" size="lg">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Report</span>
                </div>
              </NeonButton>
              
              <NeonButton onClick={handlePlayAgain} size="lg">
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5" />
                  <span>New Assessment</span>
                </div>
              </NeonButton>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;