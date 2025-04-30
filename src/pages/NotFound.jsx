import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="w-24 h-24 mb-6 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-accent"
      >
        <AlertTriangle size={40} />
      </motion.div>
      
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Home size={18} />
          Back to Home
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFound;