import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { handleGetStarted } from "@/lib/auth";

export const Hero = () => {
  return (
    <section className="relative pt-32 mt-28 pb-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-white pointer-events-none z-0"></div>
      
      {/* Animated blobs */}
      <div className="absolute top-40 right-[10%] w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
      <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse-glow animation-delay-300"></div>
      <div className="absolute top-60 left-[15%] w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-20 animate-pulse-glow animation-delay-500"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Hero content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Open-Source <span className="text-gradient">AI Platform</span> for Modern Applications
            </h1>
            <p className="text-lg text-gray-600 md:text-xl max-w-lg">
              Create, customize and deploy powerful AI solutions with our open-source platform.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-lg"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
                onClick={() => window.open('https://github.com/Rakib-Hasan25/olychat', '_blank')}
              >
                View on GitHub
              </Button>
            </div>
            
            {/* <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                ))}
              </div>
              <p className="text-sm text-gray-500">Trusted by <span className="font-medium">1,000+</span> developers</p>
            </div> */}
          </motion.div>
          
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 relative"
          >
            <div className="relative rotate-3d">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="h-8 bg-gray-100 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-gray-50 p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0"></div>
                    <div className="bg-purple-100 px-4 py-3 rounded-2xl rounded-tl-none">
                      <p className="text-sm">How can I assist you today?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-gray-200 px-4 py-3 rounded-2xl rounded-tr-none">
                      <p className="text-sm">I need to create a custom chatbot for my website</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0"></div>
                    <div className="bg-purple-100 px-4 py-3 rounded-2xl rounded-tl-none">
                      <p className="text-sm">I can help with that! Would you like to use our templates or build a custom solution from scratch?</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t flex items-center gap-2">
                  <div className="bg-gray-100 h-10 flex-1 rounded-full px-4"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-softgreen rounded-lg -z-10 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-softyellow rounded-lg -z-10 animate-float animation-delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
