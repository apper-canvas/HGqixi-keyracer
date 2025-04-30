import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Trophy, GraduationCap, Users, ArrowRight } from 'lucide-react';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'race'
  
  return (
    <div className="space-y-8">
      <section className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Master Your Typing Skills
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
            Learn to type with structured lessons or challenge friends to exciting typing races
          </p>
        </motion.div>
        
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 p-1 inline-flex">
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'learn'
                ? 'bg-primary text-white shadow-sm'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <GraduationCap size={18} />
            Learn to Type
          </button>
          <button
            onClick={() => setActiveTab('race')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'race'
                ? 'bg-primary text-white shadow-sm'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <Trophy size={18} />
            Race with Friends
          </button>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MainFeature mode={activeTab} />
        </motion.div>
      </AnimatePresence>

      <section className="grid md:grid-cols-2 gap-8 mt-16">
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-xl font-semibold">Learn to Type</h2>
          </div>
          <p className="text-surface-600 dark:text-surface-300 mb-4">
            Start with the basics and progress through structured lessons designed to improve your typing speed and accuracy.
          </p>
          <ul className="space-y-2 mb-6">
            {['Beginner-friendly lessons', 'Key positioning exercises', 'Gradual progression', 'Track your improvement'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-secondary mt-1"><ArrowRight size={16} /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setActiveTab('learn')}
            className="btn btn-primary w-full"
          >
            Start Learning
          </button>
        </div>
        
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary">
              <Trophy size={24} />
            </div>
            <h2 className="text-xl font-semibold">Race with Friends</h2>
          </div>
          <p className="text-surface-600 dark:text-surface-300 mb-4">
            Challenge your friends or random opponents to exciting typing races and see who can type the fastest.
          </p>
          <ul className="space-y-2 mb-6">
            {['Real-time competitions', 'Race against friends', 'Leaderboards', 'Improve through challenges'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-secondary mt-1"><ArrowRight size={16} /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setActiveTab('race')}
            className="btn btn-secondary w-full"
          >
            Start Racing
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;