"use client";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import "@/styles/scrollbar-hide.css";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSocket from "@/lib/socketclient";
import Message from "@/components/ai-chat/Message";
import ThinkingMessage from "@/components/ai-chat/ThinkingMessage";
import ChatInput from "@/components/ai-chat/ChatInput";
import ChatHeader from "@/components/ai-chat/ChatHeader";

interface ThinkingStep {
  id: number;
  text: string;
  complete: boolean;
}

interface ThinkingState {
  visible: boolean;
  steps: ThinkingStep[];
}

interface ChatMessageProps {
  content: string;
  role: "ai" | "user";
}

interface Props {
  params: {
    chatid: string;
  };
}

export default function AIChat({ params }: Props) {
  //it is a server side component for that we use NEXT_PUBLIC_MAIN_BACKEND_SERVICE_URL
  const socket = useSocket(process.env.NEXT_PUBLIC_MAIN_BACKEND_SERVICE_URL!);
  const chatId = params.chatid;
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const router = useRouter();
 
  const [isLoading, setIsLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [thinking, setThinking] = useState<ThinkingState>({
    visible: false,
    steps: [],
  });

  const messagesEndRef = useAutoScroll<HTMLDivElement>([messages], { smooth: true });

  const cleanupSocketListeners = useCallback(() => {
    if (socket) {
      socket.off("pdf-extracting");
      socket.off("image-processing");
      socket.off("storing-in-db");
      socket.off("storing-is-complete");
      socket.off("fetching-the-relevent-data");
      socket.off("generating-response");
      socket.off("stream_chunk");
      socket.off("stream_complete");
      socket.off("return-response");
      socket.off("response-complete");
      socket.off("error");
      socket.off("get_context");
      socket.off("analyzing-msg-text")
      socket.off("get_context_file")
      socket.off("stream_generating_file")
      socket.off("fetching-the-relevent-data-file")
    }
  }, [socket]);

  const updateSimulateResponse = useCallback((stepIndex: number) => {
    setThinking(current => ({
      ...current,
      steps: current.steps.map((step, i) => {
        if (i + 1 === stepIndex) {
          return { ...step, complete: true };
        }
        return step;
      })
    }));
  }, []);

  const startSimulateResponse = useCallback((thinkingSteps: any) => {
    setIsLoading(true);
    setThinking({
      visible: true,
      steps: thinkingSteps.map((step: any) => ({ ...step, complete: false }))
    });
  }, []);

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const supabase = createSupabaseClientSide();
      const {
        data: { user },
      } = await supabase.auth.getUser();


      if(!user){
        throw new Error("user is not authenticated");
      }




      const { data: Chat, error: newChatError } = await supabase
      .from("chats")
      .select('*')
        .eq('id', chatId);


        
        
        if (newChatError && newChatError.code !== "PGRST116") {
          throw new Error(`Error creating chat: ${newChatError.message}`);
        }
        
        if(Chat){
          setChatTitle(Chat[0].title);
        }
      const { data: chatHistory, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });




      if (error) {
        console.log("something went wrong", error);
        throw error;
      }

      if (chatHistory && chatHistory.length > 0) {
        const formattedChats: ChatMessageProps[] = chatHistory.map(
          (chat: any) => ({
            role: chat.sender,
            content: chat.content,
          })
        );
        
        setMessages(formattedChats);
      } else {
        // Show welcome messages for new chats
        setMessages([
          {
            role: "ai",
            content: "👋 Welcome! I'm your AI assistant. I can help you with:",
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory()
  }, [])






  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);






  const handleBeforeUnload = async () => {
    await axios.post('/api/redis-operation/redistodatabase', {
      chatId: chatId,
    })
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [])
  useEffect(() => {
    window.history.pushState({ page: 'initial' }, '', window.location.href);
    const handlePopState = () => {
      handleBackButton().catch((err) => console.error("Error handling back button:", err));
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);





  const handleBackButton = async () => {
    try {
      console.log("messages", messages);
      if (messages.length ===1) {
        // Delete empty chat and return without Redis operation
        const supabase = createSupabaseClientSide();
        await supabase
          .from('chats')
          .delete()
          .eq('id', chatId);
      } else {
        // Only call Redis operation if we have messages
        await axios.post('/api/redis-operation/redistodatabase', {
          chatId: chatId,
        });
      }
      router.push("/dashboard/ai-chat-home");
    } catch (error) {
      console.error("Error handling back button:", error);
      // Still try to navigate even if there's an error
      router.push("/dashboard/ai-chat-home");
    }
  };

  

  const updateChatTitle = async (content: string) => {
    try {
      const supabase = createSupabaseClientSide();
      // Extract first 50 characters for the title
      const title = content.split('\n')[0].slice(0, 50).trim();
      setChatTitle(title);
      const { error } = await supabase
        .from('chats')
        .update({ title: title })
        .eq('id', chatId);

      if (error) throw error;
     
    } catch (err) {
      console.error('Error updating chat title:', err);
    }
  };





  const callforairesponse = async (query_text: string, context: string | null, request_type: string, email: string) => {
    try {

      console.log("query text", query_text);

      console.log("context calll for ai response ", context);
      console.log("request type", request_type);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MAIN_BACKEND_SERVICE_URL}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query_text: query_text,
            context: context,
            request_type: request_type,
          }),
        }
      );
      if (!response) throw new Error("Network response was not ok");

      // if (!response.ok) throw new Error("Network response was not ok");
      setThinking({ visible: false, steps: [] });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let currentMessage = "";
      // Process stream chunks

      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        // Update AI message with new chunk
        const chunk = decoder.decode(value);

        console.log(chunk);

        currentMessage += chunk;
        //  currentMessage = sanitizeMarkdown(currentMessage.trim());
        setMessages((prevMessages: any) => {
          const updatedMessages = [...prevMessages];

          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.role === "ai") {
            updatedMessages[updatedMessages.length - 1] = {
              role: "ai",
              content: currentMessage.trim(),
            };

            return [
              ...prevMessages.slice(0, -1),
              { role: "ai", content: currentMessage.trim() },
            ];
          } else {
            updatedMessages.push({
              role: "ai",
              content: currentMessage.trim(),
            });

            return [...prevMessages, { role: "ai", content: currentMessage }];
          }
        });
      }

      console.log("current message", currentMessage);


      setIsLoading(false);
      
      cleanupSocketListeners();
    
    
      socket?.emit("senttoredis", {
        userEmail: email,
        message: { role: "ai", content: currentMessage },
        chatId: params.chatid,
      });
    
    }
    catch (err) {
      console.log("error in streaming response", err)
    }
  }



  const handleSendMessage = async ({ content, fileUrl1, websearch1, askFromPdf1, askfromPreviousContext1 }: any) => {
    if (!content.trim()) return;

    cleanupSocketListeners();

    const supabase = createSupabaseClientSide();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("user is not authenticated");
    }


    

    const userMessage: ChatMessageProps = {
      content,
      role: "user",

    };


    //updating the chat title if it's the first message
    if(chatTitle=="New Chat"){
      console.log("updating the chat title", content);
      updateChatTitle(content);
    }





    //sending the user message to redis
    socket?.emit("senttoredis", {
      userEmail: user.email,
      message: userMessage,
      chatId: chatId,
    });



    //setting the message to the messages array 
    //also initializing all type of socket events

    let isFile = false;
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];




      //if we have any file(pdf or image) url or not 
      if (fileUrl1) {
        //check if it's a pdf
        isFile = fileUrl1.endsWith(".pdf?");
        
        if (isFile) {
          const thinkingSteps = [
            { id: 1, text: "Decision taken : it's a msg with pdf...", complete: false },
            { id: 2, text: "Pdf-Extracting...", complete: false },
            { id: 3, text: "Image processing start...", complete: false },
            { id: 4, text: "Storing Process Start...", complete: false },
            { id: 5, text: "Analyzing your msg text...", complete: false },
            { id: 6, text: "Get the best relevent information...", complete: false },
            { id: 7, text: "Ready for generating...", complete: false },
          ];
          startSimulateResponse(thinkingSteps);
          updateSimulateResponse(1);
        } 
        
        else {
          const thinkingSteps = [
            { id: 1, text: "Decision taken : it's a msg with image...", complete: false },
            { id: 2, text: "Image processing start...", complete: false },
            { id: 3, text: "Analyzing your msg text...", complete: false },
            { id: 4, text: "Ready for generating...", complete: false },
          ];
          startSimulateResponse(thinkingSteps);
          updateSimulateResponse(1);
        }

        socket?.emit("msg-with-upload-file", {
          message: content,
          fileurl: fileUrl1,
          filetype: isFile,
          chatId: chatId,
        });
      }





      //if we are trying to search the web or not 
      else if (websearch1) {
        const thinkingSteps = [
          { id: 1, text: "Decision taken : it's a msg for web search ...", complete: false },
          { id: 2, text: "Analyzing from where we want to search ...", complete: false },
          { id: 3, text: "Searching the web...", complete: false },
          { id: 4, text: "Ready for generating...", complete: false },
        ];
        startSimulateResponse(thinkingSteps);
        updateSimulateResponse(1);
        socket?.emit("websearch-chat", { message: content });
      }






      //if we are trying to ask from previously uploaded file 
      else if (askFromPdf1) {
        const thinkingSteps = [
          { id: 1, text: "Ask from pdf and analyzing your msg text...", complete: false },
          { id: 2, text: "Retriving the relevent data...", complete: false },
          { id: 3, text: "Ready for generating...", complete: false },
        ];
        startSimulateResponse(thinkingSteps);
        updateSimulateResponse(1);
        socket?.emit("chat-with-file", { message: content ,chatId: chatId});
      }





      //if we are trying to ask from previous chat context 
      else if (askfromPreviousContext1) {
        const thinkingSteps = [
          { id: 1, text: "Ask from previous context and analyzing your msg text...", complete: false },
          { id: 2, text: "Ready for generating...", complete: false },
        ];
        startSimulateResponse(thinkingSteps);
        updateSimulateResponse(1);
        
        socket?.emit("previous-context-msg", { message: updatedMessages });
      }


      //if we are trying to ask a normal question 
      else {
        const thinkingSteps = [
          { id: 1, text: "Analyzing your msg text...", complete: false },
          { id: 2, text: "Ready for generating...", complete: false },
        ];
        startSimulateResponse(thinkingSteps);
        updateSimulateResponse(1);
      }
      return updatedMessages;
    });



//here we are handling the socket events for the file url and websearch and ask from previous context and ask from pdf and normal question



    if (fileUrl1) {

      socket?.on("pdf-extracting", () => {
        updateSimulateResponse(2);
      });

      socket?.on("image_processing", () => {
        updateSimulateResponse(fileUrl1.endsWith(".pdf?") ? 3 : 2);
      });

      socket?.on("storing-in-db", () => {
        updateSimulateResponse(4);
      });
      socket?.on("analyzing-msg-text", () => {
        updateSimulateResponse(3);
      });

      socket?.on("storing-is-complete", () => {
        updateSimulateResponse(5);
      });

      socket?.on("fetching-the-relevent-data", () => {
        updateSimulateResponse(6);
      });



     //we are getting the context of pdf or image
      let context1 = "";
      socket?.on("get_context_file", (context) => {
        console.log("context", context);
        context1 = JSON.stringify(context.context);
        
      });
      

      socket?.on("stream_generating_file", () => {
        if(isFile){
          callforairesponse(content, context1, "pdf-query", user?.email || "");
        }
        else{
          callforairesponse(content, context1, "image-query", user?.email || "");
        }
        context1 = "";

      })
      return 
    

    }
    else if (websearch1) {

        //here we are handling the socket events for the websearch

        //for now we are handling (youtube,image,research_paper,news )



      let aiMessage: ChatMessageProps = { role: "ai", content: "" };
      let output_result = "";
      setMessages((prev) => [...prev, aiMessage]);
      
      socket?.on("return-response", (data) => {



        
        console.log("data", data.result);
        if (data.request_type === 'youtube') {
            output_result = data.result
                .map(
                    (video: any, index: any) =>
                        `**${index + 1}**: ${video.title}
                        ![${video.title}](${video.img_src})
                        [Watch Here](${video.url})`
                )
                .join("\n\n");
        } else if (data.request_type === 'image') {
            output_result = data.result
                .map(
                    (image: any, index: any) =>
                        `**${index + 1}**: ${image.title}
                        ![${image.title}](${image.img_src})
                        [View Image](${image.url})`
                )
                .join("\n\n");
        } else if (data.request_type === 'research_paper') {
            output_result = data.result
                .map(
                    (paper: any, index: any) =>
                        `**${index + 1}**: ${paper.title}
                        [Read Paper](${paper.url})
                        ${paper.pdf_url ? `[Download PDF](${paper.pdf_url})` : ''}`
                )
                .join("\n\n");
        } else if (data.request_type === 'news') {
            output_result = data.result
                .map(
                    (news: any, index: any) =>
                        `**${index + 1}**: ${news.title} [Read More](${news.url})`
                )
                .join("\n\n");
        }
        else{
       
       output_result = data.result;
       
        }
        
        aiMessage.content = output_result;
        socket?.emit("senttoredis", {
          userEmail: user.email,
          message: aiMessage,
          chatId: params.chatid,
        });
        setThinking({ visible: false, steps: [] });
        setMessages((prev) => {
          let updatedMessages = JSON.parse(JSON.stringify(prev));
          const lastMessageIndex = updatedMessages.length;
          updatedMessages[lastMessageIndex - 1].content = output_result;
          return updatedMessages;
        });
        // updateSimulateResponse(3);
       
        
      });

      socket?.on("response-complete", () => {
       
        updateSimulateResponse(4);
        setThinking({ visible: false, steps: [] });
        cleanupSocketListeners();
        setIsLoading(false);
      });

      socket?.on("error", () => {
        setThinking({ visible: false, steps: [] });
        cleanupSocketListeners();
        setIsLoading(false);
      });
    }
    else {
      if (askFromPdf1) {
        socket?.on("fetching-the-relevent-data-file", () => {
          console.log("fetching-the-relevent-data-file");
          updateSimulateResponse(2);
        });
      }

      let context1 = "";
      if (askfromPreviousContext1 || askFromPdf1) {
        socket?.on("get_context",  (context) =>{
          if(context.context.length==0){
            context1 = "";
          }
          else{
            context1 = JSON.stringify(context.context);
          }
          console.log("context1", context1);
         
          if (askfromPreviousContext1 ) {
           callforairesponse(content, context1, "previous-context-query", user?.email || "");
          }
          else{
             
            callforairesponse(content, context1, "ask-previous-store-file", user?.email || "");
          }
        });
      } 
      
      else {
        callforairesponse(content, context1, "basic-query", user?.email || "");
      }
    
    }



  }

// socket?.on("stream_chunk", (data) => {
//   newvalue += data.content;
//   setMessages((prev) => {
//     // console.log('Chunk:', JSON.stringify(data.content))
//     let updatedMessages = JSON.parse(JSON.stringify(prev));
//     const lastMessageIndex = updatedMessages.length;
//     updatedMessages[lastMessageIndex - 1].content += data.content;
//     return updatedMessages;
//   });
//   updateSimulateResponse(2);
// });

//     socket?.on("stream_complete", () => {

//       aiMessage.content = newvalue;
//       console.log('Final AI Message:', aiMessage);


//     });
//   }
// };



return (
  <div className="flex flex-col h-screen bg-[#F9F8FC] dark:bg-[#121212]">
    <ChatHeader title={chatTitle ? chatTitle : "AI Chat"} handleBackButton={handleBackButton}  />
    <div className="flex-1 overflow-hidden relative">
      <div className="absolute inset-0 overflow-y-auto px-4 md:px-6 py-4 scrollbar-hide" ref={messagesEndRef}>
        {messages.length === 0 ? (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="max-w-md space-y-4">
              <h2 className="text-2xl font-semibold text-[#6E59A5] dark:text-[#D6BCFA]">
                Welcome to AI Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ask me anything, upload files or images, search the web, or access your previous contexts.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-1 pb-4">
            {messages.map((message, index) =>
              message.content && (
                <Message
                  key={index}
                  message={message.content}
                  isUser={message.role === "ai" ? false : true}
                />
              ))}
            <ThinkingMessage isVisible={thinking.visible} steps={thinking.steps} />
          </div>
        )}
      </div>
    </div>
    <div className="p-4 md:p-6 bg-[#F9F8FC] dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800">
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  </div>
);
}
















