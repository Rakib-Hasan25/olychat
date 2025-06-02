
import { motion } from 'framer-motion';

const featureItems = [
  {
    id: 1,
    title: "AI Chat & Document Intelligence",
    description: "Chat naturally with our AI assistant. Upload documents, images, and use web search to get comprehensive answers backed by your own data.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="m3 18 3-3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v10a2 2 0 0 0 2 2 1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M7 12h7" />
        <path d="M7 8h3" />
        <path d="M7 16h3" />
      </svg>
    ),
    color: "bg-softgreen",
    image: "/ai_chat.svg",
    status: "Implemented"
  },
  {
    id: 2,
    title: "Custom Chatbot Builder",
    description: "Build and customize chatbots for your website, social media, and other platforms. No coding required.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect width="8" height="8" x="8" y="8" rx="2" />
        <path d="M12.5 8v-5" />
        <path d="M8 5.5h8" />
        <path d="m9 16 1.5 1.5" />
        <path d="m13.5 17.5 1.5-1.5" />
        <path d="M16 12h3" />
        <path d="M5 12h3" />
      </svg>
    ),
    color: "bg-softyellow",
    image: "/chat_bot.svg",
    status: "Coming Soon"
  },
  {
    id: 3,
    title: "AI Agent Creation",
    description: "Define tasks and create autonomous AI agents that can accomplish complex goals for different use cases.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    ),
    color: "bg-softpeach",
    image: "/ai_agent.svg",
    status: "Coming Soon"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-secondary/60 to-white pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Features</h2>
            <h3 className="mt-2 text-3xl md:text-4xl font-bold">Three powerful AI solutions in one platform</h3>
            <p className="mt-4 text-lg text-gray-600">
              Our open-source platform combines chat intelligence, custom chatbots, and autonomous agents to deliver a complete AI toolkit.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {featureItems.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover-scale"
            >
              <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center text-purple-600 mb-5`}>
                {feature.icon}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold">{feature.title}</h4>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${feature.status === "Implemented" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {feature.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{feature.description}</p>
              
              <div className="rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                  <img src={feature.image} alt={feature.title} className="w-full h-full  object-cover text-gray-400" />
                {/* <div className="p-8 bg-gray-200 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gray-400">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                </div> */}
              </div>
              
              {/* <div className="mt-6 flex">
                <a href="#" className="text-purple-600 font-medium text-sm hover:text-purple-700 flex items-center gap-1 transition-colors">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </a>
              </div> */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
