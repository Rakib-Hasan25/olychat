"use client";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageCircle, History, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";






interface ChatItem {
    title: string;
    id: string;
    timestamp: string;
  }
export default function AIChatHome() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [chatItems, setChatItems] = useState<ChatItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const chatListRef = React.useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 5;
    const [isFetching, setIsFetching] = useState(false);

    const fetchChats = async (pageNumber: number) => {
      if (isFetching) return;
      
      try {
        setIsFetching(true);
        setIsLoading(true);
        const supabase = createSupabaseClientSide();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const from = (pageNumber - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data: allChats, error } = await supabase
          .from("chats")
          .select("*")
          .eq("email", user?.email)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) {
          console.log("something went wrong");
          throw error;
        }

        if (allChats && allChats.length > 0) {
          const formattedChats: ChatItem[] = allChats.map((chat: any) => ({
            id: chat.id,
            title: chat.title,
            timestamp: new Date(chat.created_at).toLocaleString(),
          }));

          setChatItems(prev => pageNumber === 1 ? formattedChats : [...prev, ...formattedChats]);
          setHasMore(allChats.length === ITEMS_PER_PAGE);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    const handleScroll = useCallback(() => {
      if (!chatListRef.current || isLoading || !hasMore || isFetching) return;

      const container = chatListRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      if (scrollPercentage > 0.8) {
        setPage(prev => prev + 1);
      }
    }, [isLoading, hasMore, isFetching]);

    useEffect(() => {
      fetchChats(page);
    }, [page]);

    useEffect(() => {
      const currentChatList = chatListRef.current;
      if (currentChatList) {
        currentChatList.addEventListener('scroll', handleScroll);
        return () => currentChatList.removeEventListener('scroll', handleScroll);
      }
    }, [handleScroll]);

    const createNewChat = async () => {
      try {
        const supabase = createSupabaseClientSide();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("user is not authenticated");
        }
        
        const id = uuidv4();
        
        // Insert the chat with a descriptive initial title
        const { data: newChat, error: newChatError } = await supabase
          .from("chats")
          .insert({
            email: user.email,
            id: id,
            title: "New Chat",
          })
          .select()
          .single();

        if (newChatError && newChatError.code !== "PGRST116") {
          throw new Error(`Error creating chat: ${newChatError.message}`);
        }

        router.push(`/dashboard/ai-chat-home/chat-page/${id}`);
      } catch (err) {
        console.error("Error creating new chat:", err);
      }
    };

    const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        try {
            const supabase = createSupabaseClientSide();
            const { error } = await supabase
                .from("chats")
                .delete()
                .eq("id", chatId);

            if (error) throw error;
            
            // Remove the chat from the UI
            setChatItems(prev => prev.filter(chat => chat.id !== chatId));
        } catch (err) {
            console.error("Error deleting chat:", err);
        }
    };

    const handleBackToDashboard = () => {
        router.push('/dashboard');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] via-[#D6BCFA] to-[#F2FCE2] dark:from-[#221F26] dark:via-[#403E43] dark:to-black flex flex-col items-center justify-center px-4">
        <div className="max-w-xl w-full animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBackToDashboard}
                className="rounded-full text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF] cursor-pointer"
              >
                <ArrowLeft size={20} />
              </Button>
              <MessageCircle className="text-[#9b87f5] dark:text-[#E5DEFF]" size={38} />
              <h1 className="text-3xl font-bold text-gradient-primary">Your AI Chats</h1>
            </div>
            <Button onClick={createNewChat} className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-semibold transition-colors flex gap-1 px-4 py-2" size="sm">
              <Plus size={18} /> New Chat
            </Button>
          </div>
          <div className="rounded-2xl shadow-xl glass bg-white/60 dark:bg-[#1A1F2C]/80 border border-white/20 mb-10 p-6 backdrop-blur-lg">
            <h2 className="text-lg font-semibold text-[#7E69AB] dark:text-[#D6BCFA] mb-4 flex items-center gap-2">
              <History size={18} /> Recent Conversations
            </h2>

            <div 
              ref={chatListRef}
              className="h-[60vh] overflow-y-auto scrollbar-hide relative"
              style={{ scrollBehavior: 'smooth' }}
            >
              {chatItems.length === 0 && !isLoading ? (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No chats yet. Start a new conversation!
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {chatItems.map((chat) => (
                    <li
                      key={chat.id}
                      className="flex items-center justify-between group hover:scale-[1.01] transition-transform bg-gradient-to-br from-white via-[#F1F0FB] to-[#D6BCFA]/60 dark:from-[#403E43] dark:via-[#1A1F2C] dark:to-[#221F26] rounded-xl px-5 py-4 cursor-pointer shadow border border-[#F1F0FB] dark:border-[#403E43]"
                      tabIndex={0}
                      role="button"
                    >
                      <Link href={`/dashboard/ai-chat-home/chat-page/${chat.id}`} className="flex-1">    
                        <div>
                          <div className="font-medium text-base text-[#6E59A5] dark:text-[#D6BCFA] group-hover:underline">
                            {chat.title.length > 30 ? `${chat.title.substring(0, 30)}...` : chat.title}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-gray-400">{chat.timestamp}</div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </li>
                  ))}
                  {(isLoading || isFetching) && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Loading more chats...
                    </div>
                  )}
                  {!hasMore && chatItems.length > 0 && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No more chats to load
                    </div>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}



