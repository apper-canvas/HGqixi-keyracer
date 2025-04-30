import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, Keyboard } from 'lucide-react';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary"
            >
              <Keyboard size={28} />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              KeyRacer
            </h1>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="border-t border-surface-200 dark:border-surface-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
          <p>© {new Date().getFullYear()} KeyRacer. Improve your typing skills with fun.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;