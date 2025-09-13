import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Target } from 'lucide-react';
import NeonButton from '../components/ui/NeonButton';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate('/games');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Vanta Net Background */}
      <div
        ref={(() => {
          const vantaRef = React.useRef(null);
          React.useEffect(() => {
            let vantaEffect: any = null;
            let threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            threeScript.async = true;
            document.body.appendChild(threeScript);

            let vantaScript = document.createElement('script');
            vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
            vantaScript.async = true;
            document.body.appendChild(vantaScript);

            function initVanta() {
              // @ts-ignore
              if (window.VANTA && window.VANTA.NET && vantaRef.current) {
                // @ts-ignore
                vantaEffect = window.VANTA.NET({
                  el: vantaRef.current,
                  mouseControls: true,
                  touchControls: true,
                  gyroControls: false,
                  minHeight: 200.0,
                  minWidth: 200.0,
                  scale: 1.0,
                  scaleMobile: 1.0,
                  color: 0x0f0f23,
                  backgroundColor: 0x0a0a0a,
                  points: 20.0,
                  maxDistance: 25.0,
                  spacing: 20.0
                });
              }
            }
            function checkAndInit() {
              // @ts-ignore
              if (window.THREE && window.VANTA && window.VANTA.NET) {
                initVanta();
              } else {
                setTimeout(checkAndInit, 100);
              }
            }
            threeScript.onload = checkAndInit;
            vantaScript.onload = checkAndInit;
            return () => {
              if (vantaEffect && typeof vantaEffect.destroy === 'function') {
                vantaEffect.destroy();
              }
              if (threeScript) document.body.removeChild(threeScript);
              if (vantaScript) document.body.removeChild(vantaScript);
            };
          }, []);
          return vantaRef;
        })()} 
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold font-poppins neon-text mb-6 float-animation"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            MindMirror AI
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-gray-300 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Play. Learn. Discover Yourself.
          </motion.p>
          
          <motion.p
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Unlock the secrets of your cognitive patterns through AI-powered neurometric games. 
            Experience the future of mind analysis with cutting-edge assessment technology.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-16"
        >
          <NeonButton onClick={handleStartNow} size="lg" className="text-xl px-12 py-6">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6" />
              <span>Start Neural Assessment</span>
              <Zap className="w-6 h-6" />
            </div>
          </NeonButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Brain,
              title: "Cognitive Analysis",
              description: "Advanced neural pattern recognition"
            },
            {
              icon: Target,
              title: "Precision Testing",
              description: "Micro-second reaction measurements"
            },
            {
              icon: Zap,
              title: "Real-time AI",
              description: "Instant behavioral insights"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              className="text-center p-6 bg-dark-card bg-opacity-50 backdrop-blur-md rounded-xl neon-border"
            >
              <feature.icon className="w-12 h-12 text-neon-cyan mx-auto mb-4 neon-glow-cyan" />
              <h3 className="text-xl font-semibold font-poppins text-neon-purple mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;