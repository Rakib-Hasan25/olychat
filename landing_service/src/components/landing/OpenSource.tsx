
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export const OpenSource = () => {
  const benefits = [
    {
      title: "Community-driven",
      description: "Join our growing community of contributors and help shape the future of AI.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: "Regular updates",
      description: "Get the latest features and improvements as they're developed.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M21 12a9 9 0 0 1-9 9" />
          <path d="M9 3a9 9 0 0 1 9 9" />
          <path d="m13 5 3 3-3 3" />
          <path d="m11 19-3-3 3-3" />
        </svg>
      )
    },
    {
      title: "Hands-on experience",
      description: "Contribute to a real AI project and enhance your skills.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 22a7.1 7.1 0 0 0 5.83-3h.17a3 3 0 1 0 0-6c-.3 0-.59.1-.84.1" />
          <path d="M19.93 15a7.1 7.1 0 0 0-11.69-6.43" />
          <path d="M3.89 17.05c-.56-.21-.56-.78 0-1.03a5.3 5.3 0 0 0 3.1-4.72c0-3 2.53-5.3 5.53-5.3h.22" />
          <path d="M7.95 17.05a5.32 5.32 0 0 1 .6-9.26" />
          <path d="M15.5 8 17 9.5m-10.5.5v-2" />
          <path d="M20 2a4.68 4.68 0 0 0-1.9 2.79 4.68 4.68 0 0 0-2.79-1.9 4.48 4.48 0 0 0 2.79-2.79A4.48 4.48 0 0 0 20 2Z" />
        </svg>
      )
    },
    {
      title: "Transparency",
      description: "No black boxes. See and understand how our AI works.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    }
  ];

  return (
    <section id="opensource" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100 rounded-full -translate-x-1/2 -translate-y-1/2 filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full translate-x-1/2 translate-y-1/2 filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Open Source</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Join our open-source community</h3>
            <p className="text-gray-600 text-lg">
              Our platform is fully open-source, allowing developers to contribute, customize, and learn from the codebase. 
              By participating, you'll gain valuable experience while helping to improve the platform for everyone.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-purple-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-sm text-gray-500">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                onClick={() => window.location.href = 'https://github.com/Rakib-Hasan25/olychat'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Star on GitHub
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="glass-effect rounded-xl p-6 relative z-10 rotate-3d">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-gray-700 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-gray-400 font-mono">terminal</div>
                </div>
                <div className="bg-gray-900 p-4 font-mono text-sm text-gray-300">
                  <div className="flex">
                    <span className="text-green-400">$</span>
                    <span className="ml-2">git clone https://github.com/Rakib-Hasan25/olychat.git</span>
                  </div>
                  <div className="mt-2 text-gray-400">Cloning into 'olychat'...</div>
                  <div className="text-gray-400">remote: Enumerating objects: 584, done.</div>
                  <div className="text-gray-400">remote: Counting objects: 100% (584/584), done.</div>
                  <div className="text-gray-400">remote: Compressing objects: 100% (350/350), done.</div>
                  <div className="text-gray-400">Receiving objects: 100% (584/584), 10.2 MiB | 5.1 MiB/s, done.</div>
                  <div className="mt-2 flex">
                    <span className="text-green-400">$</span>
                    <span className="ml-2">cd olychat</span>
                  </div>
                  <div className="mt-2 flex">
                    <span className="text-green-400">$</span>
                    <span className="ml-2">docker compose up</span>
                  </div>
                 
                  
                  
                  <div className="mt-2 text-gray-400">[+] Running 5/5</div>
                  <div className="text-gray-400"><span className="text-green-400">✔ </span>Container redis<span className="text-green-400 ml-[200px]">Created</span></div>
                  <div className="text-gray-400"><span className="text-green-400">✔ </span>Container searxng<span className="text-green-400 ml-[182px]">Created</span></div>
                  <div className="text-gray-400"><span className="text-green-400">✔ </span>Container search-service<span className="text-green-400 ml-[125px]">Created</span></div>
                  <div className="text-gray-400"><span className="text-green-400">✔ </span>Container main-backend-service<span className="text-green-400 ml-[71px]">Created</span></div>
                  <div className="text-gray-400"><span className="text-green-400">✔ </span>Container main-frontend-service<span className="text-green-400 ml-[68px]">Created</span></div>
                  <div className="mt-2 flex">
                    <span className="text-green-400">$</span>
                    <span className="ml-2">Now we are ready to use the platform</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-codeblue rounded-lg -z-10 rotate-6"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-20 bg-softpink rounded-lg -z-10 -rotate-6"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full filter blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
