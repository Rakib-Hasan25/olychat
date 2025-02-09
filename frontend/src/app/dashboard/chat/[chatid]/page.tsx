"use client";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import axios from "axios";
// import io from "socket.io-client";
// const socket = typeof window !== "undefined"
//     ? io("http://localhost:5000", { transports: ["websocket"] })
//     : null;
import { useState, useRef, useEffect } from "react";
import { FileUp, Image, Search, FileText, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import useSocket from "@/lib/socketclient";


interface ChatMessageProps {
  content: string;
  role: string;
}

const ChatMessage = ({ content, role }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-message-appear",
        role == "ai" ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] text-white break-words",
          role == "ai"
            ? "bg-lovablemessage rounded-tl-none"
            : "bg-lovablemessage rounded-tr-none"
        )}
      >
        <ReactMarkdown className="text-white">{content}</ReactMarkdown>
      </div>
    </div>
  );
};

type Props = {
  params: any;
};

export default function Chat({ params }: Props) {

  const socket = useSocket(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL!);
  // const socket = useSocket("http://chatllm:5000")
  const router = useRouter();
  console.log(typeof params.chatid);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([{ content: "Hello! How can I help you today?", role: "ai" }]);
  const [inputText, setInputText] = useState("");
  const [fileurl, setFileurl] = useState(null);
  const [websearch, setWebsearch] = useState(false);
  const [askFromPdf, setAskFromPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currntSituation, setCurrentSituation] = useState("");

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filewithmessage = async () => {
    console.log(fileurl);
    if (!inputText.trim()) return;
    const supabase = createSupabaseClientSide();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("user is not authenticated");
    }
    const userMessage = { role: "user", content: inputText };

    socket?.emit("senttoredis", {
      userEmail: user.email,
      message: userMessage,
      chatId:params.chatid,
    });
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      socket?.emit("msg-with-upload-file", {
        message: updatedMessages,
        fileurl: fileurl,
      });
      return [...prev, userMessage];
    });

    console.log("we emit msg");
    socket?.on("pdf-extracting", () => {
      console.log("now image is processing ");
      setCurrentSituation("pdf-extracting");
    });
    socket?.on("image-processing", () => {
      console.log("now image is processing ");
      setCurrentSituation("image processing with ai");
    });

    socket?.on("storing-in-db", () => {
      console.log("storing process is on  ");
      setCurrentSituation("storing-in-db process start");
    });
    socket?.on("storing-is-complete", () => {
      console.log("storing process is complete ");
      setCurrentSituation("storing process is complete");
    });
    socket?.on("generating-response", () => {
      console.log("storing process is complete ");
      setCurrentSituation("generating process is started");
    });

    let aiMessage = { role: "ai", content: "" };
    setMessages((prev) => [...prev, aiMessage]);

    let newvalue = "";
    console.log("emit message");
    socket?.on("stream_chunk1", (data) => {
      console.log(data.content);
      newvalue += data.content;
      setMessages((prev) => {
        let updatedMessages = JSON.parse(JSON.stringify(prev));
        const lastMessageIndex = updatedMessages.length;
        console.log(data.content);

        updatedMessages[lastMessageIndex - 1].content += data.content;
        return updatedMessages;
      });
    });
    socket?.on("stream_complete1", () => {
      aiMessage.content = newvalue;
      console.log(aiMessage);
      socket?.emit("senttoredis", {
        userEmail: user.email,
        message: aiMessage,
        chatId: params.chatid,
      });

      socket.off("stream_chunk1");
      socket.off("storing-in-db");
      socket.off("storing-is-complete");
      socket.off("pdf-extracting");
      socket.off("generating-response");
      socket.off("senttoredis");
      socket.off("stream_complete1");
    });
    setFileurl(null);
    setInputText("");
  };

  const sendSocketMessage = async () => {
    if (!inputText.trim()) return;
    const supabase = createSupabaseClientSide();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("user is not authenticated");
    }

    const userMessage = { role: "user", content: inputText };

    socket?.emit("senttoredis", {
      userEmail: user.email,
      message: userMessage,
      chatId: params.chatid,
    });

    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      if (askFromPdf) {
        socket?.emit("chat-with-file", { message: updatedMessages });
      } else {
        socket?.emit("incoming-text-msg", { message: updatedMessages });
      }
      return [...prev, userMessage];
    });

    let aiMessage = { role: "ai", content: "" };
    setMessages((prev) => [...prev, aiMessage]);

    let newvalue = "";
    console.log("emit message");
    socket?.on("stream_chunk", (data) => {
      console.log(data.content);
      newvalue += data.content;
      setMessages((prev) => {
        //   const updatedMessages = [...prev];
        let updatedMessages = JSON.parse(JSON.stringify(prev));
        const lastMessageIndex = updatedMessages.length;
        console.log(data.content);

        updatedMessages[lastMessageIndex - 1].content += data.content;
        return updatedMessages;
      });
    });

    //  sentairesponse(user)

    socket?.on("stream_complete", () => {
      aiMessage.content = newvalue;
      console.log(aiMessage);

      socket?.emit("senttoredis", {
        userEmail: user.email,
        message: aiMessage,
        chatId: params.chatid,
      });

      socket.off("stream_chunk");
      socket.off("senttoredis");
      socket.off("stream_complete");
    });

    setInputText("");
  };

  const handlwebsearch = async () => {
    if (!inputText.trim()) return;
    const supabase = createSupabaseClientSide();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("user is not authenticated");
    }
    const userMessage = { role: "user", content: inputText };
    socket?.emit("senttoredis", {
      userEmail: user.email,
      message: userMessage,
      chatId: params.chatid,
    });

    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      socket?.emit("websearch-chat", { message: updatedMessages });
      return [...prev, userMessage];
    });

    let aiMessage = { role: "ai", content: "" };
    setMessages((prev) => [...prev, aiMessage]);
    let newvalue = "";
    socket?.on("return-video", (data) => {
      console.log(data.videos);
      let videoText = data.videos
        .map(
          (video: any, index: any) =>
            `📹 **${index}: ${video.title}**\n🔗 [Watch Here](${video.url})`
        )
        .join("\n\n");
      newvalue = videoText;
      setMessages((prev) => {
        let updatedMessages = JSON.parse(JSON.stringify(prev));
        const lastMessageIndex = updatedMessages.length;
        console.log(data.content);

        updatedMessages[lastMessageIndex - 1].content += videoText;
        return updatedMessages;
      });
    });

    socket?.on("stream-complete3", () => {
      aiMessage.content = newvalue;
      socket?.emit("senttoredis", {
        userEmail: user.email,
        message: aiMessage,
        chatId: params.chatid,
      });

      socket.off("return-video");
      socket.off("senttoredis");
      socket.off("stream-complete3");
    });
    setInputText("");
  };

  const handleFileChange = async (e: any) => {
    if (!e.target.files[0]) {
      return;
    }

    const new_file = e.target.files[0];
    if (!new_file) {
      alert("No file selected!");
      return;
    }

    console.log("here ");
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    setLoading(true);
    if (!allowedTypes.includes(new_file.type)) {
      alert("Invalid file type! Please upload a PDF, PNG, or JPG file.");
      return;
    }
    console.log("i am here");
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    const totalChunks = Math.ceil(new_file.size / CHUNK_SIZE);
    const fileId = Date.now().toString(); // Unique ID for the file
    const filetype = new_file.type;
    console.log(filetype);
    for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
      const start = chunkNumber * CHUNK_SIZE;
      console.log("sdfsf");
      const end = Math.min(start + CHUNK_SIZE, new_file.size);
      const chunk = new_file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("filetype", filetype);
      formData.append("fileId", fileId);
      formData.append("chunkNumber", chunkNumber.toString());
      formData.append("totalChunks", totalChunks.toString());

      try {
        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const progressValue = Math.round(
          ((chunkNumber + 1) / totalChunks) * 100
        );
        console.log(progressValue);
        if (progressValue == 100) {
          setFileurl(data.data);
        }
      } catch (error) {
        console.error("Error uploading chunk:", error);
        setLoading(true);
        break;
      }
    }
    setLoading(false);
    console.log("Upload complete!");
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };
 
   const fetchChatHistory = async () => {
        try {
          setLoading(true)
          const supabase = createSupabaseClientSide()
          const {
            data: { user },
          } = await supabase.auth.getUser()
          console.log(user)
          const { data: chatHistory, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id',params.chatid)
            .order('created_at', { ascending: false })
          console.log(chatHistory)
          if (error) {
            console.log("something went wrong",error)
            throw error
          }
    
          if (chatHistory.length > 0) {
            const formattedChats:ChatMessageProps[] = chatHistory.map(
              (chat: any) => {
                return {
                  role: chat.sender,
                  content: chat.content,
                }
              }
            )
    
            setMessages(formattedChats)
            setLoading(false)
          }
        } catch (err) {
          setLoading(false)
          console.error('Error fetching recordings:', err)
          // setError(err instanceof Error ? err.message : 'Failed to fetch recordings');
        } finally {
          setLoading(false)
        }
      }
      useEffect(() => {
        fetchChatHistory()
      }, []) 



  const handleBeforeUnload = async() => {
    console.log(params.chatid)
  await axios.post('/api/redis-operation/redistodatabase',{
    chatId:params.chatid,
  })
};


useEffect(()=>{
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
},[])
  


const handleBackButton = async() => {
  console.log('Back button handler called!');
  // Your back button logic here
  await handleBeforeUnload()
  router.push("/dashboard/chathistory")
  // If you want to prevent going back:
  // window.history.pushState({ page: 'initial' }, '', window.location.href);
};

useEffect(() => {
  // First, push initial state when component mounts
  window.history.pushState({ page: 'initial' }, '', window.location.href);
 

  const handlePopState = () => {
    handleBackButton().catch((err) => console.error("Error handling back button:", err));
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="h-screen flex justify-center  bg-black">
      <div className="flex flex-col w-[50%]  h-[90%] mt-10 rounded-2xl border-2 bg-chatbg">
        <h1 className="font-bold px-5 pt-2 text-3xl">Chat screen</h1>
        <h1>{currntSituation}</h1>
        <div className="flex-1 overflow-y-auto mt-2 p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <ChatMessage key={index} content={msg.content} role={msg.role} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-700 p-4 rounded-2xl bg-chatbg">
          <div className="flex flex-col gap-2 max-w-5xl mx-auto relative">
            <h1 className="">
              {loading ? "loading" : fileurl ? "fileupload" : ""}
            </h1>
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask AI..."
                className="flex-1 bg-chatbg text-white rounded-lg px-4 py-2 focus:outline-none  resize-none min-h-[40px]"
                rows={1}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex  gap-2">
                <input
                  className="hidden"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleButtonClick}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FileUp className="w-5 h-5 text-gray-300" />
                </button>
                {/* <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <Image className="w-5 h-5 text-gray-300" />
                </button> */}
                <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <Search
                    onClick={() => {
                      console.log("hiii");
                      setWebsearch(!websearch);
                    }}
                    className={`w-5 h-5  ${
                      websearch ? "text-blue-600" : "text-gray-300"
                    }`}
                  />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <FileText
                    onClick={() => {
                      console.log("hiii");
                      setAskFromPdf(!askFromPdf);
                    }}
                    className={`w-5 h-5  ${
                      askFromPdf ? "text-blue-600" : "text-gray-300"
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={
                  fileurl
                    ? filewithmessage
                    : websearch
                    ? handlwebsearch
                    : sendSocketMessage
                }
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Send className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
