import React, { useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Bot, Check, Copy, PersonStanding } from "lucide-react";
import remarkGfm from 'remark-gfm';
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import Markdowntohtml from "./markdowntohtml";
import clsx from "clsx";

interface MessageProps {
  message: string;
  isUser: boolean;
}

interface CodeBlockProps {
  children: string;
  className?: string;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = className?.replace('language-', '') || 'plaintext';

  return (
    <div className="group relative">
      <div className="absolute right-2 top-2 flex items-center gap-1">
        <span className="hidden rounded bg-gray-800 px-2 py-1 text-xs text-gray-300 group-hover:block">
          {language}
        </span>
        <button 
          className="hidden rounded p-1.5 text-gray-400 hover:bg-gray-700 group-hover:block"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <pre className="mt-0 overflow-x-auto rounded-lg bg-[#2C2C2C] p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
export default function Message({message, isUser}: MessageProps) {
  return (
    <div 
      className={cn("flex w-full my-4", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn(
        "flex gap-3 max-w-[85%] items-start",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className="flex-shrink-0">
          <Avatar className={cn(
            "h-8 w-8 flex items-center justify-center",
            isUser ? "bg-[#9b87f5]" : "bg-[#1A1F2C] dark:bg-[#E5DEFF]" 
          )}>
            <div className={cn(
              "font-medium text-sm flex items-center justify-center",
              isUser ? "text-white" : "text-[#9b87f5] dark:text-[#1A1F2C]"
            )}>
              {isUser ? <PersonStanding className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
          </Avatar>
        </div>
        
        <div className={cn(
          "flex flex-col flex-grow",
          isUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "px-4 py-3 rounded-2xl",
            "max-w-[600px] min-w-[200px] w-full",
            isUser 
              ? "bg-[#9b87f5] text-white flex " 
              : "bg-[#9b87f5] dark:bg-[#2A2F2C] border border-[#F1F0FB] dark:border-[#403E43]"
          )}>
            
          <div className={clsx( [
          'prose prose-invert max-w-none text-black',
          'prose-p:my-2 prose-p:leading-relaxed',
          'prose-headings:border-b prose-headings:border-gray-700 prose-headings:pb-2',
          'prose-th:bg-[#2C2C2C] prose-th:p-2 prose-th:text-left',
          'prose-td:p-2 prose-td:border prose-td:border-gray-700',
          'prose-table:border prose-table:border-gray-700',
          '[&_table]:mt-0 [&_table]:rounded-lg [&_table]:overflow-hidden',
        ])}>

        <ReactMarkdown
         remarkPlugins={[remarkGfm, remarkMath]}
         rehypePlugins={[rehypeKatex]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ node,  className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className?.includes('language-');
            if (className?.includes('math')) {
              return <code {...props} className={className}>{children}</code>;
            }
            return !isInline && match ? (
              <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>
            ) : (
              <code {...props} className="rounded bg-[#2C2C2C] px-1.5 py-0.5 text-sm">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg ring-1 ring-gray-700">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {message}
      </ReactMarkdown>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
}
