import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Users,
  User
} from 'lucide-react';

// Sample typing lessons
const typingLessons = [
  {
    id: 1,
    title: "Home Row Keys",
    description: "Learn the foundation of touch typing with the home row keys (ASDF JKL;)",
    content: "asdf fdsa jkl; ;lkj asdf jkl; fjdk slaj dksl a;sldkfj asdfjkl;",
    level: "Beginner"
  },
  {
    id: 2,
    title: "Top Row Practice",
    description: "Practice typing with the top row keys (QWERTY UIOP)",
    content: "qwerty uiop qwer tyui op poiu ytrewq qwerty uiop",
    level: "Beginner"
  },
  {
    id: 3,
    title: "Bottom Row Practice",
    description: "Practice typing with the bottom row keys (ZXCV BNM)",
    content: "zxcv bnm zxcv bnm xcvb nm, zxcv bnm zxcvbnm",
    level: "Beginner"
  }
];

// Sample race texts
const raceTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
  "Coding is the process of creating instructions for computers using programming languages. Coding is used to program the websites, apps, and other technologies we interact with every day.",
  "The best way to predict the future is to invent it. The future belongs to those who believe in the beauty of their dreams."
];

const MainFeature = ({ mode }) => {
  const [selectedLesson, setSelectedLesson] = useState(typingLessons[0]);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isCompleted, setIsCompleted] = useState(false);
  const [raceMode, setRaceMode] = useState('solo'); // 'solo' or 'friends'
  const [countdown, setCountdown] = useState(null);
  const [racers, setRacers] = useState([
    { id: 1, name: 'You', progress: 0, wpm: 0 },
    { id: 2, name: 'AI Racer', progress: 0, wpm: 0 }
  ]);
  
  const inputRef = useRef(null);
  
  // Initialize text based on mode
  useEffect(() => {
    resetExercise();
  }, [mode, selectedLesson]);
  
  // Handle AI racer in race mode
  useEffect(() => {
    let interval;
    
    if (mode === 'race' && startTime && !endTime && raceMode === 'solo') {
      interval = setInterval(() => {
        setRacers(prev => {
          const aiRacer = prev.find(r => r.id === 2);
          const aiSpeed = Math.random() * 2 + 3; // Random speed between 3-5% per second
          const newProgress = Math.min(100, aiRacer.progress + aiSpeed);
          const newWpm = Math.floor(30 + Math.random() * 20); // Random WPM between 30-50
          
          return prev.map(racer => 
            racer.id === 2 
              ? { ...racer, progress: newProgress, wpm: newWpm }
              : racer
          );
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [mode, startTime, endTime, raceMode]);
  
  // Calculate WPM and accuracy
  useEffect(() => {
    if (startTime && !endTime) {
      const calculateStats = () => {
        try {
          // Calculate time elapsed in minutes with a minimum to prevent division by zero
          const timeElapsedMs = new Date().getTime() - startTime;
          const timeElapsed = Math.max(timeElapsedMs / 1000 / 60, 0.01); // Minimum 0.01 minutes (0.6 seconds)
          
          // Calculate WPM only if there's actual user input
          let currentWpm = 0;
          if (userInput.length > 0) {
            // Count correctly typed words
            const words = userInput.trim().split(' ');
            // Filter out empty words and count only completed words
            const completedWords = words.filter(word => word.length > 0).length;
            
            // Standard formula: (words) / minutes
            currentWpm = Math.round(completedWords / timeElapsed);
          }
          
          // Calculate accuracy by comparing each character
          let correctChars = 0;
          let totalChars = 0;
          
          for (let i = 0; i < userInput.length; i++) {
            if (i < currentText.length) {
              totalChars++;
              if (userInput[i] === currentText[i]) {
                correctChars++;
              }
            }
          }
          
          const currentAccuracy = totalChars > 0 
            ? Math.round((correctChars / totalChars) * 100) 
            : 100;
          
          setWpm(currentWpm);
          setAccuracy(currentAccuracy);
        } catch (error) {
          console.error("Error calculating stats:", error);
          // Set fallback values if calculation fails
          setWpm(0);
          setAccuracy(100);
        }
      };
      
      // Update user progress in race mode
      const updateRaceProgress = () => {
        const progressPercentage = (userInput.length / currentText.length) * 100;
        setRacers(prev => 
            prev.map(racer => 
              racer.id === 1 
                ? { ...racer, progress: progressPercentage, wpm: currentWpm }
                : racer
            )
          );
        }
      
      const interval = setInterval(() => {
        calculateStats();
        
        // Update race progress if in race mode
        if (mode === 'race') {
          updateRaceProgress();
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTime, endTime, userInput, currentText, mode]);
  
  // Handle countdown
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStartTime(new Date().getTime());
      setCountdown(null);
      // Ensure input is focused as soon as countdown ends
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [countdown]);

  // Ensure input ref gets focus when it should
  useEffect(() => {
    if (countdown === 0 && inputRef.current) {
      // Use setTimeout to ensure focus happens after render
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [countdown]);
  
  const startExercise = () => {
    setCountdown(3);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    
    // Reset racers progress
    if (mode === 'race') {
      setRacers(prev => 
        prev.map(racer => ({ ...racer, progress: 0, wpm: 0 }))
      );
    }
  };
  
  const resetExercise = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsCompleted(false);
    
    if (mode === 'learn') {
      setCurrentText(selectedLesson.content);
    } else {
      setCurrentText(raceTexts[Math.floor(Math.random() * raceTexts.length)]);
    }
    
    // Reset racers progress
    if (mode === 'race') {
      setRacers(prev => 
        prev.map(racer => ({ ...racer, progress: 0, wpm: 0 }))
      );
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Start timer on first input
    if (!startTime && value.length === 1) {
      setStartTime(new Date().getTime());
    }
    
    // Get current word information based on what has been typed so far
    const words = currentText.split(' ');
    const typedWords = userInput.split(' ');
    const currentWordIndex = typedWords.length - 1;
    let currentWord = '';
    
    if (currentWordIndex >= 0 && currentWordIndex < words.length) {
      // If we're within valid word index range
      currentWord = words[currentWordIndex];
    }
    
    // Ensure value doesn't exceed the current word's length
    // Check if word is completed
    if (value.includes(' ') || 
        (value.length === currentWord.length && value === currentWord)) {
      
      // Update the main userInput with the completed word
      const newUserInput = userInput.substring(0, currentWordStart) + value.trim() + ' ';
      setUserInput(newUserInput);
      
      // Clear the visible input for the next word
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = '';
          // Focus to ensure the user can continue typing
          inputRef.current.focus();
        }
      }, 10);
      
      // Check if entire text is completed
      if (newUserInput.trim() === currentText.trim()) {
        setEndTime(new Date().getTime());
        setIsCompleted(true);
        
        // Complete the user's race
        if (mode === 'race') {
          setRacers(prev => 
            prev.map(racer => 
              racer.id === 1 
                ? { ...racer, progress: 100 }
                : racer
            )
          );
        }
      }
      
      return;
    }
    
    // Just update the visible input field for the current word
    // This doesn't update the main userInput until the word is completed
    e.target.value = value;
  };
  
  // Get the current word boundaries based on typing progress
  const getCurrentWordBoundaries = () => {
    const typedText = userInput.trim();
    
    // If user hasn't typed anything yet or the user input ends with a space
    if (typedText.length === 0 || userInput.endsWith(' ')) {
      // Find the start of the next word to type
      const wordStartPos = userInput.length;
      const nextSpacePos = currentText.indexOf(' ', wordStartPos);
      
      return {
        currentWordStart: wordStartPos,
        currentWordEnd: nextSpacePos === -1 ? currentText.length : nextSpacePos
      };
    }
    
    // If user is in the middle of a word, find the boundaries of that word
    const lastSpaceInUserInput = userInput.lastIndexOf(' ');
    const currentWordStart = lastSpaceInUserInput === -1 ? 0 : lastSpaceInUserInput + 1;
    const nextSpaceInText = currentText.indexOf(' ', currentWordStart);
    const currentWordEnd = nextSpaceInText === -1 ? currentText.length : nextSpaceInText;
    
    return { currentWordStart, currentWordEnd };
  };
  
  // Get the current word to display in the input field
  const getCurrentWordForInput = () => {
    const { currentWordStart, currentWordEnd } = getCurrentWordBoundaries();
    return currentText.substring(currentWordStart, currentWordEnd);
  };
  
  // Get the visible part of user input (for the current word only)
  const getVisibleUserInput = () => {
    const { currentWordStart } = getCurrentWordBoundaries();
    const lastSpaceInUserInput = userInput.lastIndexOf(' ');
    
    if (lastSpaceInUserInput === -1) {
      return userInput;
    }
    
    return userInput.substring(lastSpaceInUserInput + 1);
  };
  
  // Render the full paragraph text with appropriate highlighting
  const renderFullText = () => {
    if (!currentText) return null;
    
    // Break the text into words
    const words = currentText.split(' ');
    
    // Determine which word is currently being typed
    // Count spaces in user input to determine how many words have been completed
    let currentWordIndex = 0;
    
    // If user input has content
    if (userInput.length > 0) {
      // Split by spaces and find how many complete words we have
      const typedWords = userInput.split(' ');
      // If the last character is a space, we're at the next word; otherwise we're still on the current word
      currentWordIndex = userInput.endsWith(' ') ? typedWords.length : typedWords.length - 1;
    }
    
    // Current word index is the number of spaces (completed words)
    // If no words completed yet, index is 0
    const currentWordIndex = spaceCount;
    
    return (
      <div className="mb-4 p-6 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 leading-relaxed font-mono">
        <div className="typing-text text-lg">
          {words.map((word, index) => (
            <span 
              key={index} 
              className="relative"
            >
              <span 
                className={
                  index < currentWordIndex 
                    ? "text-secondary dark:text-secondary-light" // completed words
                    : index === currentWordIndex 
                      ? "relative bg-primary/20 dark:bg-primary/30 font-semibold" // current word
                      : "text-surface-600 dark:text-surface-400" // upcoming words
                }
              >
                {/* For the current word, check character by character */}
                {index === currentWordIndex 
                  ? word.split('').map((char, charIndex) => {
                      const isTyped = userInput.split(' ')[currentWordIndex]?.[charIndex] !== undefined;
                      return <span key={charIndex} className={isTyped ? '' : 'text-surface-400 dark:text-surface-500'}>{char}</span>;
                    })
                  : word}
              </span>
              {index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  const renderLearnMode = () => {
    return (
      <div>
        <div className="mb-6 flex flex-wrap gap-3">
          {typingLessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedLesson.id === lesson.id
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-primary dark:hover:border-primary'
              }`}
            >
              {lesson.title}
            </button>
          ))}
        </div>
        
        <div className="mb-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <h3 className="font-medium text-lg mb-1">{selectedLesson.title}</h3>
          <p className="text-surface-600 dark:text-surface-300 text-sm">{selectedLesson.description}</p>
          <div className="mt-2 inline-block px-3 py-1 bg-primary/20 dark:bg-primary/30 rounded-full text-xs font-medium">
            {selectedLesson.level}
          </div>
        </div>
        
        {renderFullText()}
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 p-4 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400 mb-1">
              <Clock size={16} />
              <span className="text-sm">Speed</span>
            </div>
            <div className="text-2xl font-bold">{wpm} <span className="text-sm font-normal">WPM</span></div>
          </div>
          
          <div className="flex-1 p-4 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-2 text-surface-500 dark:text-surface-400 mb-1">
              <CheckCircle size={16} />
              <span className="text-sm">Accuracy</span>
            </div>
            <div className="text-2xl font-bold">{accuracy}%</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {isCompleted ? (
            <button 
              onClick={resetExercise}
              className="btn btn-primary flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          ) : startTime ? (
            <button 
              onClick={resetExercise}
              className="btn btn-outline flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Reset
            </button>
          ) : (
            <button 
              onClick={startExercise}
              className="btn btn-primary flex items-center gap-2"
            >
              <Play size={18} />
              Start Lesson
            </button>
          )}
        </div>
      </div>
    );
  };
  
  const renderRaceMode = () => {
    return (
      <div>
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setRaceMode('solo')}
            className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              raceMode === 'solo'
                ? 'bg-secondary text-white'
                : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-secondary dark:hover:border-secondary'
            }`}
          >
            <User size={18} />
            Solo Race
          </button>
          
          <button
            onClick={() => setRaceMode('friends')}
            className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              raceMode === 'friends'
                ? 'bg-secondary text-white'
                : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-secondary dark:hover:border-secondary'
            }`}
          >
            <Users size={18} />
            Race with Friends
          </button>
        </div>
        
        {raceMode === 'friends' ? (
          <div className="mb-6 p-6 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 text-center">
            <h3 className="text-xl font-medium mb-4">Coming Soon!</h3>
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              Multiplayer racing with friends will be available in the next update.
            </p>
            <button
              onClick={() => setRaceMode('solo')}
              className="btn btn-secondary"
            >
              Try Solo Race Instead
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4">
              <h3 className="font-medium mb-4">Race Progress</h3>
              
              {racers.map(racer => (
                <div key={racer.id} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{racer.name}</span>
                    <span className="text-sm text-surface-500 dark:text-surface-400">{racer.wpm} WPM</span>
                  </div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${racer.progress}%` }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                      className={`h-full rounded-full ${racer.id === 1 ? 'bg-primary' : 'bg-secondary'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {renderFullText()}
            
            <div className="flex gap-3">
              {isCompleted ? (
                <button 
                  onClick={resetExercise}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Race Again
                </button>
              ) : startTime ? (
                <button 
                  onClick={resetExercise}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Reset Race
                </button>
              ) : (
                <button 
                  onClick={startExercise}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Play size={18} />
                  Start Race
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-surface-100 dark:bg-surface-800/50 rounded-2xl p-6 shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700">
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            <div className="text-8xl font-bold text-white">{countdown}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {mode === 'learn' ? renderLearnMode() : renderRaceMode()}
      
      <div className="mt-6">
        <input
          ref={inputRef}
          type="text"
          onChange={handleInputChange}
          disabled={isCompleted || countdown !== null}
          className="input-field font-mono text-lg"
          placeholder={startTime ? `Type: "${getCurrentWordForInput()}"` : "Press Start to begin typing..."}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
      
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2 text-green-600 dark:text-green-400">
            <Award size={24} />
            <h3 className="text-xl font-medium">Completed!</h3>
          </div>
          <p className="text-surface-600 dark:text-surface-300 mb-3">
            You finished with a speed of <strong>{wpm} WPM</strong> and <strong>{accuracy}%</strong> accuracy.
          </p>
          <div className="flex justify-center">
            <button
              onClick={resetExercise}
              className="btn btn-outline flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MainFeature;