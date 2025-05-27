import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { handleGetStarted } from "@/lib/auth";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm' : 'py-4 bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">O</span>
          </div>
          <h1 className="text-xl font-bold">OlyChat</h1>
        </motion.div>

        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center space-x-6"
        >
          <a href="#features" className="text-sm font-medium hover:text-purple-500 transition-colors">Features</a>
          <a href="#opensource" className="text-sm font-medium hover:text-purple-500 transition-colors">Open Source</a>
          <a href="#getstarted" className="text-sm font-medium hover:text-purple-500 transition-colors">Get Started</a>
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-3"
        >
           <Button 
           onClick={handleGetStarted}
           variant="ghost" size="sm" className="hidden md:flex">Log In</Button>
          <Button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    </header>
  );
};
