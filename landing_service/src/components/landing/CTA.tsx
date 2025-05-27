import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { handleGetStarted } from "@/lib/auth";

export const CTA = () => {
  return (
    <section id="getstarted" className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-secondary/40 pointer-events-none"></div>
      
      {/* Animated shapes */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-purple-100 rounded-full filter blur-2xl opacity-50 animate-pulse-glow"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-100 rounded-full filter blur-2xl opacity-50 animate-pulse-glow animation-delay-300"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience the future of AI?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of developers and start building powerful AI solutions today.
            No credit card required to get started.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-8 max-w-xl mx-auto relative z-10"
          >
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold">Get started for free</h3>
              <p className="text-gray-600 text-sm">
                Create an account to access all features and start building right away.
              </p>
              <Button 
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-lg py-6"
              >
                Get Started
              </Button>
              <p className="text-xs text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 mt-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-gray-600">Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-gray-600">Open-source</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-gray-600">Community support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="text-gray-600">Regular updates</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
