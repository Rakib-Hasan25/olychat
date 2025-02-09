"use client";
import { ChatCard } from "@/components/chatcard";
import { Button } from "@/components/ui/button";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import { Divide } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ChatItem {
  title: string;
  id: string;
  timestamp: string;
}

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [chatItems,setChatItems]=useState<ChatItem[]>([]);
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const supabase = createSupabaseClientSide();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);
      const { data: allChats, error } = await supabase
        .from("chats")
        .select("*")
        .eq("email", user?.email)
        .order("created_at", { ascending: false });
      console.log(allChats);
      if (error) {
        console.log("something went wrong");
        throw error;
      }

      if (allChats.length > 0) {
        const formattedChats: ChatItem[] = allChats.map((chat: any) => {
          return {
            id: chat.id,
            title: chat.title,
            timestamp: new Date(chat.created_at).toLocaleString(),
          };
        });

        setChatItems(formattedChats);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching recordings:", err);
      // setError(err instanceof Error ? err.message : 'Failed to fetch recordings');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    const supabase = createSupabaseClientSide();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("user is not authenticated");
    }
    const id = uuidv4();
    const { data: newChat, error: newChatError } = await supabase
      .from("chats")
      .insert({
        email: user.email,
        id: id,
        title: "new chat",
      })
      .select()
      .single();

    console.log(newChatError);

    console.log(newChat);

    if (newChatError && newChatError.code !== "PGRST116") {
      throw new Error(`Error checking chat existence: ${newChatError.message}`);
    }
    router.push(`/dashboard/chat/${id}`)
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <>
      <div className="min-h-screen pb-24 bg-zinc-100 h-screen ">
        <div className="container w-full md:w-[50%] justify-center items-center  mx-auto relative  h-[90vh]  p-4 md:p-0 ">
          <div className="max-w-2xl  fixed top-0  justify-center   border  border-zinc-100 ">
            <h1 className="text-3xl  text-gray-950 tracking-wide mt-4 mb-2">
              All Chats
            </h1>
          </div>

          <div className=" max-w-2xl flex flex-col mx-auto mb-8 ">
            <div className="mt-52">
              
                <Button onClick={createNewChat }>NewChat</Button>
            </div>
            <div className="  scrollbar-hide">
              {isLoading ? <div>is loading .....</div> : <div>loaded</div>}
              {chatItems.length > 0 ? (
                chatItems.map((note, index) => (
                  <ChatCard
                    id={note.id}
                    title={note.title}
                    timestamp={note.timestamp}
                  />
                ))
              ) : (
                <div>"no chat history</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
