import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { handleGetStarted } from "@/lib/auth";
import { useState } from 'react';

export const Hero = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative pt-32 mt-28 pb-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-white pointer-events-none z-0"></div>
      
      {/* Animated blobs */}
      <div className="absolute top-40 right-[10%] w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
      <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-pulse-glow animation-delay-300"></div>
      <div className="absolute top-60 left-[15%] w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-20 animate-pulse-glow animation-delay-500"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center gap-16">
          {/* Hero content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Open-Source <span className="text-gradient">AI Platform</span> for Modern Applications
            </h1>
            <p className="text-lg text-gray-600 md:text-xl max-w-2xl mx-auto">
              Create, customize and deploy powerful AI solutions with our open-source platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
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
          
          {/* Demo Video Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-100">
              {!isVideoPlaying ? (
                <>
                  <div 
                    className="absolute inset-0 bg-gray-900/10 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300">
                      <svg 
                        className="w-10 h-10 text-purple-600" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <img 
                    src="https://img.youtube.com/vi/VqmWAdsllZk/maxresdefault.jpg" 
                    alt="Video thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/VqmWAdsllZk?autoplay=1"
                  title="Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-softgreen rounded-lg -z-10 animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-softyellow rounded-lg -z-10 animate-float animation-delay-300"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
