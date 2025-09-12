import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Download, RotateCcw, Brain, Sparkles } from 'lucide-react';
import NeonButton from '../components/ui/NeonButton';
import ScoreCard from '../components/ui/ScoreCard';

const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<number[]>([75, 82, 68, 91, 77]); // Default scores
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    const storedScores = sessionStorage.getItem('gameScores');
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
    
    // Show insights after a delay
    setTimeout(() => setShowInsights(true), 2000);
  }, []);

  const cognitive_metrics = [
    { name: 'Attention', score: scores[0], color: 'purple' },
    { name: 'Motor Control', score: scores[1], color: 'blue' },
    { name: 'Cognitive Load', score: scores[2], color: 'pink' },
    { name: 'Stress Level', score: 100 - scores[3], color: 'cyan' }, // Inverted for stress
    { name: 'Stability', score: scores[4], color: 'green' },
  ];

  const radarData = cognitive_metrics.map(metric => ({
    metric: metric.name,
    score: metric.score,
    fullMark: 100,
  }));

  const radialData = cognitive_metrics.map((metric, index) => ({
    name: metric.name,
    value: metric.score,
    fill: index === 0 ? '#a855f7' : index === 1 ? '#3b82f6' : index === 2 ? '#ec4899' : index === 3 ? '#22d3ee' : '#22c55e'
  }));

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const handlePlayAgain = () => {
    sessionStorage.removeItem('gameScores');
    navigate('/games');
  };

  const handleDownload = () => {
    // Simulate download
    alert('Report download feature would be implemented here');
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Brain className="w-20 h-20 text-neon-purple mx-auto mb-6 neon-glow float-animation" />
          <h1 className="text-5xl md:text-6xl font-bold font-poppins neon-text mb-4">
            Your Mind Report
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Neural patterns analyzed • Cognitive profile generated
          </p>
          <div className="text-4xl font-bold text-neon-cyan">
            Overall Score: {overallScore}/100
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-2xl p-8 neon-border"
          >
            <h2 className="text-2xl font-bold font-poppins text-neon-purple mb-6 text-center">
              Cognitive Profile
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="metric" className="text-gray-300" />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  className="text-gray-500"
                  tick={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radial Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-2xl p-8 neon-border"
          >
            <h2 className="text-2xl font-bold font-poppins text-neon-cyan mb-6 text-center">
              Performance Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                innerRadius="20%"
                outerRadius="80%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: 'white' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend
                  iconSize={12}
                  width={120}
                  height={140}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={{ color: '#d1d5db' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Score Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12"
        >
          {cognitive_metrics.map((metric, index) => (
            <ScoreCard
              key={metric.name}
              title={metric.name}
              score={metric.score}
              color={metric.color}
              delay={0.9 + index * 0.1}
            />
          ))}
        </motion.div>

        {/* AI Insights */}
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-2xl p-8 neon-border mb-8"
          >
            <div className="flex items-center mb-6">
              <Sparkles className="w-8 h-8 text-neon-pink mr-3 neon-glow-pink" />
              <h2 className="text-3xl font-bold font-poppins text-neon-pink">
                AI Neural Insights
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div className="space-y-4">
                <div className="p-4 bg-dark-bg bg-opacity-50 rounded-lg">
                  <h3 className="font-semibold text-neon-cyan mb-2">Cognitive Strengths</h3>
                  <p className="text-sm leading-relaxed">
                    Your working memory demonstrates exceptional capacity, indicating strong 
                    analytical thinking and information processing abilities. Executive function 
                    scores suggest excellent planning and task-switching capabilities.
                  </p>
                </div>
                
                <div className="p-4 bg-dark-bg bg-opacity-50 rounded-lg">
                  <h3 className="font-semibold text-neon-purple mb-2">Neural Efficiency</h3>
                  <p className="text-sm leading-relaxed">
                    Reaction times indicate highly optimized neural pathways with minimal 
                    cognitive load during decision-making processes. Your brain efficiently 
                    allocates resources across multiple cognitive domains.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-dark-bg bg-opacity-50 rounded-lg">
                  <h3 className="font-semibold text-neon-blue mb-2">Growth Opportunities</h3>
                  <p className="text-sm leading-relaxed">
                    Focus on sustained attention training to enhance concentration span. 
                    Regular cognitive exercises targeting visual-spatial processing could 
                    further optimize your neural performance profile.
                  </p>
                </div>
                
                <div className="p-4 bg-dark-bg bg-opacity-50 rounded-lg">
                  <h3 className="font-semibold text-neon-cyan mb-2">Optimization Tips</h3>
                  <p className="text-sm leading-relaxed">
                    Your cognitive pattern suggests peak performance during structured 
                    tasks. Consider time-blocking techniques and minimize multitasking 
                    to leverage your natural cognitive architecture.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
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
              <span>Analyze Again</span>
            </div>
          </NeonButton>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPage;