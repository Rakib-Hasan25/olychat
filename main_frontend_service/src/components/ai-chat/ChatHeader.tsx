
import React from "react";

import { ArrowLeft} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";



interface ChatHeaderProps {
  title?: string;
  
  handleBackButton?:()=>void
}

export default function ChatHeader({ title = "New Chat",handleBackButton }: ChatHeaderProps) {

  
  
  return (
    <motion.div 
      className="flex items-center justify-between py-4 px-4 md:px-6 border-b border-[#F1F0FB] dark:border-[#403E43]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackButton}
              className="rounded-full text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF] cursor-pointer"
            >
              <ArrowLeft size={20} />
            </Button>
        
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      
      {/* <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF]"
      >
        <Settings size={20} />
      </Button> */}
    </motion.div>
  );
}
