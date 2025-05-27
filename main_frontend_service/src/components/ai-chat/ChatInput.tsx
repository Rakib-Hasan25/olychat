'use client'
import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Image as ImageIcon, Search, Clock, ArrowUp, Loader2, FileText, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip";



const MAX_HEIGHT = 200; // Maximum height for textarea
const MAX_FILES = 1; // Restrict to only 1 file

interface SelectedFile {
  id: string;
  file: File;
  previewUrl: string | null;
  uploadedFileUrl: string | null;
  type: 'image' | 'pdf';
  isUploading: boolean;
}

interface ChatInputProps {
  onSendMessage: ({content,fileUrl1,websearch1,askFromPdf1,askfromPreviousContext1}:any) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage,isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [isPdfAskActive, setIsPdfAskActive] = useState(false);
  const [isContextSearchActive, setIsContextSearchActive] = useState(false);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = 
        scrollHeight > MAX_HEIGHT
          ? `${MAX_HEIGHT}px`
          : `${scrollHeight}px`;
    }
  }, [message]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach(f => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
  }, [selectedFiles]);

  
 
  
  
  // Handle sending message


  const handleSend = () => {


    console.log("selected files", selectedFiles[0]);
    if (message.trim() && !isLoading && selectedFiles.every(f => !f.isUploading)) {
      console.log(selectedFiles[0])
      if(selectedFiles.length > 0 && selectedFiles[0].uploadedFileUrl){
        const fileUrl1 = selectedFiles[0].uploadedFileUrl;
        console.log("now we are sending the file url from input ",fileUrl1);
        onSendMessage({ content: message.trim(), fileUrl1:fileUrl1, websearch: false, askFromPdf: false, askfromPreviousContext: false });

      }
      else {
        onSendMessage({ content: message.trim(), fileUrl1:null, websearch1: isWebSearchActive, askFromPdf1: isPdfAskActive, askfromPreviousContext1: isContextSearchActive });
      }
      setMessage("");
      setSelectedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };



//file upload logic here

// step 1: Open file dialog for PDF or image

  const openFileDialog = (accept: string) => {
    // If there's already a file, show toast and don't open dialog
    if (selectedFiles.length >= MAX_FILES) {
      toast({
        title: "File limit reached",
        description: "Please remove the existing file before uploading a new one.",
        variant: "destructive"
      });
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.setAttribute("accept", accept);
      fileInputRef.current.click();
    }
  };


// step 2: Handle file input eq:check take more than the limit , check it takes image or pdf 

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0){
    
      return;
    }
      
    
    // If trying to upload multiple files, show toast
    if (files.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: "You can only upload one file at a time.",
        variant: "destructive"
      });
      return;
    }
    
    // Take only the first file
    const file = files[0];
    
    // Check if file is PDF or image, otherwise reject
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only images and PDF files are allowed.",
        variant: "destructive"
      });
      return;
    }
    
    let type: 'image' | 'pdf' = file.type.startsWith("image") ? "image" : "pdf";
    const previewUrl = type === "image" ? URL.createObjectURL(file) : null;
    
    const newFile = {
      id: `${file.name}-${Date.now()}`,
      file,
      previewUrl,
      type,
      uploadedFileUrl: null,
      isUploading: true
    } as SelectedFile;
    
    setSelectedFiles([newFile]);
  };


  //step 3: uploading the file 

  const uploadFile = async (file: SelectedFile) => {

    const CHUNK_SIZE = 1 * 1024 * 1024; // 5MB chunks
    const file_size = file.file.size;
    const totalChunks = Math.ceil(file_size/ CHUNK_SIZE);
    const filetype = file.type;
    console.log("file size", file_size);
    console.log("total chunks", totalChunks);
    console.log("chunk size", CHUNK_SIZE);
    console.log("filetype", filetype);


    try{

      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        const start = chunkNumber * CHUNK_SIZE;
        console.log("sdfsf");
        const end = Math.min(start + CHUNK_SIZE, file_size);
        const chunk = file.file.slice(start, end);
          
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("filetype", filetype);
        formData.append("fileId", file.id);
        formData.append("chunkNumber", chunkNumber.toString());
        formData.append("totalChunks", totalChunks.toString());
  


        //if it is a server side component for that we use MAIN_BACKEND_SERVICE_URL
        const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_BACKEND_SERVICE_URL!}/api/upload`, {
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
        if (progressValue == 100 && file.uploadedFileUrl == null) {
          // If the file is fully uploaded, set the uploadedFileUrl
          file.uploadedFileUrl = data.data;
          setSelectedFiles(prevFiles =>
            prevFiles.map(f => (f.id === file.id ? { ...f, uploadedFileUrl: data.data } : f))
          );
         
        }  
        file.isUploading = false;
        setSelectedFiles(prevFiles =>
          prevFiles.map(f => (f.id === file.id ? { ...f, isUploading: false } : f))
        );
      }

    }
    catch (error) {
      console.error("Error uploading chunk:", error);
      file.isUploading = false;
      toast({
        title: "Sorry",
        description: "File upload failed. Please try again.",
        variant: "destructive"
      });
      setSelectedFiles(prevFiles =>
        prevFiles.map(f => (f.id === file.id ? { ...f, isUploading: false } : f))
      );
   
    }


  }


  useEffect(() => {
    selectedFiles.forEach((file:SelectedFile, idx) => {
      if (file.isUploading) {
       uploadFile(file)
      }
      return undefined;
    });
  }, [selectedFiles]);



//step 4: Remove file from the list

const handleRemoveFile = async (id: string) => {
 
  try {
    setSelectedFiles(prev => {
      const found = prev.find(f => f.id === id);
      if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
      return prev.filter(f => f.id !== id);
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_BACKEND_SERVICE_URL!}/api/delete-file`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName: id, fileType: selectedFiles.find(f => f.id === id)?.type }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete the file on the server.");
    }

   

  } catch (error) {
    setSelectedFiles(prev => {
      const found = prev.find(f => f.id === id);
      if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
      return prev.filter(f => f.id !== id);
    });
    console.error("Error deleting file:", error);
    toast({
      title: "Error",
      description: "Failed to delete the file from the cloud storage . Please try again.",
      variant: "destructive",
    });
  }
};

  // Animate file previews
  const previewVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 24 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.15 } }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl bg-white dark:bg-[#1A1F2C] shadow-lg border border-[#F1F0FB] dark:border-[#403E43] p-3">
      {/* Attached file preview */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-3 mb-2 px-1 overflow-x-auto">
          {selectedFiles.map(file => (
            <motion.div
              key={file.id}
              variants={previewVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative rounded-xl border border-[#F1F0FB] dark:border-[#403E43] bg-[#F8F6FD] dark:bg-[#232136] overflow-hidden min-w-[60px] min-h-[60px] max-w-[100px] max-h-[100px] flex items-center justify-center"
            >
              {/* Loading skeleton overlay */}
              {file.isUploading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Loader2 className="absolute w-7 h-7 animate-spin text-[#9b87f5]" />
                </div>
              )}

              {/* File preview */}
              {!file.isUploading && (
                <>
                  {file.type === "image" && file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.file.name}
                      className="object-cover w-full h-full max-h-[100px] rounded-xl"
                    />
                  ) : file.type === "pdf" ? (
                    <div className="flex flex-col items-center justify-center w-full h-full py-4 text-[#9b87f5]">
                      <FileText size={32} />
                      <span className="text-xs mt-1 font-medium max-w-[64px] truncate text-center">PDF</span>
                    </div>
                  ) : null}
                </>
              )}
              {/* Remove (X) button */}
              <button
                type="button"
                onClick={() => handleRemoveFile(file.id)}
                className={cn(
                  "absolute z-30 top-1 right-1 bg-white/70 hover:bg-white/90 text-[#6E59A5] rounded-full p-1 cursor-pointer transition",
                  "shadow border border-[#F1F0FB] dark:border-[#403E43]"
                )}
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={cn(
            "resize-none pr-14 max-h-[400px] overflow-y-auto",
            "bg-transparent border-none focus:ring-0 focus:outline-none text-base",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500"
          )}
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2">
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Button 
              onClick={handleSend}
              disabled={
                !message.trim() || isLoading ||
                selectedFiles.some(f => f.isUploading)
              }
              className="rounded-full h-10 w-10 p-0 bg-[#9b87f5] hover:bg-[#7E69AB]"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-1 px-1 justify-between">
        <div className="flex items-center gap-1">
          
          
          <TooltipProvider>

            
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF]"
                onClick={() => openFileDialog('application/pdf')}
                type="button"
                aria-label="Upload PDF"
              >
                <Paperclip size={isMobile ? 16 : 18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload PDF</TooltipContent>
          </Tooltip>
          
          {/* Image upload */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF]"
                onClick={() => openFileDialog('image/*')}
                type="button"
                aria-label="Upload image"
              >
                <ImageIcon size={isMobile ? 16 : 18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload image</TooltipContent>
          </Tooltip>
          
            {/* Web search */}
            <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8 text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF]",
                isWebSearchActive && "bg-[#E5DEFF] text-[#9b87f5]"
              )}
              onClick={() => {
                setIsWebSearchActive(!isWebSearchActive);
                setIsPdfAskActive(false);
                setIsContextSearchActive(false);
              }}
              >
              <Search size={isMobile ? 16 : 18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Web search</TooltipContent>
            </Tooltip>

            {/* Pdf ask */}
            <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8 text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF]",
                isPdfAskActive && "bg-[#E5DEFF] text-[#9b87f5]"
              )}
              onClick={() => {
                setIsWebSearchActive(false);
                setIsPdfAskActive(!isPdfAskActive);
                setIsContextSearchActive(false);
              }}
              >
              <FileText size={isMobile ? 16 : 18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pdf Ask</TooltipContent>
            </Tooltip>

            {/* Previous context */}
            <Tooltip>
            <TooltipTrigger asChild>
              <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8 text-gray-500 hover:text-[#9b87f5] hover:bg-[#E5DEFF]",
                isContextSearchActive && "bg-[#E5DEFF] text-[#9b87f5]"
              )}
              onClick={() => {
                setIsWebSearchActive(false);
                setIsPdfAskActive(false);
                setIsContextSearchActive(!isContextSearchActive);
              }}
              >
              <Clock size={isMobile ? 16 : 18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Context search</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* PDF upload */}
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            accept=""
          />
        </div>
        
        <div className="text-xs text-gray-400">
          {message.length > 0 && `${message.length} characters`}
        </div>
      </div>
    </div>
  );
}
