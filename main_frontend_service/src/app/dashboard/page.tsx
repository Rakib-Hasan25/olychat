'use client';

import { useEffect, useState } from 'react';
import { User, LogIn, MessageSquare, Bot, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { useRouter } from 'next/navigation';

const features = [
  {
    title: "AI Chat",
    description: "Chat with advanced AI, upload files and images, search the web and interact with your knowledge base.",
    icon: MessageSquare,
    path: "/dashboard/ai-chat-home",  // <<--- changed to point to chat home page (not directly to chat interface)
    color: "from-purple-400 to-purple-600"
  },
  {
    title: "Chatbot",
    description: "Create your own chatbot, embed it on any website, and integrate with social media for custom conversations.",
    icon: Bot,
    path: "/dashboard/chatbot-home",
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "AI Agent",
    description: "Build smart AI agents for any use case – automate, solve problems, or connect your tools. Coming soon.",
    icon: Users,
    path: "/dashboard/ai-agent-home",
    color: "from-pink-400 to-pink-600"
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string | null } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createSupabaseClientSide();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || null
        });
      } else {
        router.push('/auth/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createSupabaseClientSide();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-black dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 shadow-sm bg-white/60 dark:bg-black/60 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <img 
              src="/oly_chat_logo.png" 
              alt="OlyChat Logo" 
              className="h-12 w-auto mt-[1.6px]"
            />
          <span className="font-bold text-2xl">OlyChat</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-lg">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User size={20} />
            )}
            <span className="font-medium">{user.name}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:inline-flex"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={18} />
            Log Out
          </Button>
        </div>
      </header>
      {/* Main dashboard grid */}
      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <h2 className="text-3xl sm:text-4xl font-sans font-bold mb-6 text-gradient-primary bg-gradient-to-r from-purple-500 via-blue-600 to-pink-500 bg-clip-text text-transparent">
          Welcome to your AI workspace!
        </h2>
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
          {features.map(feature => (
            <Link
            key={feature.title}
            href={feature.path}
            >
            <div
              
              
              className={`flex flex-col items-center p-8 rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer 
                bg-gradient-to-br ${feature.color} group transition-all duration-200 transform hover:-translate-y-1 animate-fade-in`}
              tabIndex={0}
              role="button"
              aria-label={feature.title}
            >
              <feature.icon className="text-white mb-4" size={44} />
              <div className="text-white text-2xl font-bold mb-2">{feature.title}</div>
              <div className="text-white/90 text-base text-center mb-3">{feature.description}</div>
              <Button className="mt-auto opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 text-white font-semibold">
                Open
              </Button>
            </div>
            </Link>
          ))}
        </div>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl text-center text-base mb-6">
          This platform is open source — contribute & make AI accessible to everyone. 
          <a href="https://github.com/Rakib-Hasan25/olychat" target="_blank" rel="noopener noreferrer" className="ml-1 text-purple-600 hover:underline font-medium">View on GitHub.</a>
        </p>
      </main>
    </div>
  );
}
