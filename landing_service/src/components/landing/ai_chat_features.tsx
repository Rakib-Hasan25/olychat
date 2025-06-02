import { FileText, Image, Search, Upload, Clock, Zap, MessageSquare, Bot, Cog } from "lucide-react";
import FeatureCard from "./FeatureCard";




const AI_CHAT_FEATURES = ()=>{
    const chatFeatures = [
        {
          icon: FileText,
          title: "Smart Document Processing",
          description: "Extract and analyze text, images, tables, and charts from PDFs with AI-powered precision and contextual understanding."
        },
        {
          icon: Image,
          title: "Advanced Vision AI",
          description: "Deep image analysis that understands visual content, recognizes objects, and provides intelligent contextual responses."
        },
        {
          icon: Search,
          title: "Intelligent Web Search",
          description: "Context-aware search that automatically selects the best sources and delivers accurate, relevant information instantly."
        },
        {
          icon: Clock,
          title: "Memory & Context",
          description: "Maintains conversation history and context across sessions for personalized, relevant, and coherent interactions."
        },
        {
          icon: Zap,
          title: "Lightning Performance",
          description: "Socket.io-powered real-time communication with Redis caching for sub-second response times at any scale."
        }
      ];
return(
<>
<div className="container mx-auto px-4 py-16">


   <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50 mb-8">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-sm font-semibold tracking-wide">AI Chat Template Features</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Powerful Capabilities
            <span className="block text-purple-600 mt-2">Built for Performance</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-20 leading-relaxed">
            Advanced features for processing, analyzing, and responding to diverse content types 
            with enterprise-grade performance and reliability.
          </p>
        </div>

        {/* Enhanced Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {chatFeatures.map((feature, index) => (
            <div key={index} className={`${
              index === 0 || index === 2 ? 'lg:col-span-1' : 
              index === 1 ? 'md:col-span-2 lg:col-span-2' : 
              'lg:col-span-1'
            }`}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

</div>
   {/* Chat Template Features */}

</>



)



}




export default AI_CHAT_FEATURES;