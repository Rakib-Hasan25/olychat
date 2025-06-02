
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100/50 hover:border-purple-200/80 transition-all duration-500 hover:shadow-xl hover:shadow-purple-100/30 hover:-translate-y-1">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Enhanced icon design */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
            <Icon className="w-8 h-8 text-purple-600" />
          </div>
          {/* Decorative dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Enhanced typography */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-900 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
        
        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

export default FeatureCard;