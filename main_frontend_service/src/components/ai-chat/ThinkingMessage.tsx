
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface ThinkingStep {
  id: number;
  text: string;
  complete: boolean;
}

interface ThinkingMessageProps {
  isVisible: boolean;
  steps: ThinkingStep[];
}

export default function ThinkingMessage({ isVisible, steps }: ThinkingMessageProps) {
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex w-full my-4"
        >
          <div className="flex gap-3 max-w-[85%]">
            <div className="flex-shrink-0 mt-1">
              <Avatar className="h-8 w-8 bg-[#1A1F2C] dark:bg-[#E5DEFF]">
                <div className="font-medium text-sm text-[#9b87f5] dark:text-[#1A1F2C]">
                  A
                </div>
              </Avatar>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#2A2F3C] border border-[#F1F0FB] dark:border-[#403E43]">
                <div className="flex items-center gap-2 mb-2 text-[#9b87f5]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Thinking...</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {steps.map((step) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <div className="min-w-4 pt-1">
                          {step.complete ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 rounded-full bg-green-500"
                            />
                          ) : (
                            <motion.div
                              animate={{ opacity: [0.4, 1, 0.4] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="h-2 w-2 rounded-full bg-[#9b87f5]"
                            />
                          )}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {step.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
