import { NextRequest, NextResponse } from "next/server";
import  redis  from "@/lib/redis";
import { createServerSideClient } from "@/lib/supabase/supabase-server-side";

export async function POST(req: NextRequest) {
  try {



    if (!redis) {
      return NextResponse.json(
        { success: false, error: "Redis connection failed" },
        { status: 500 }
      );
    }

    // Parse the request body
    const { chatId } = await req.json();

    console.log(chatId, "chatId");
    const supabase = await createServerSideClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("user is not authenticated");
    }
    const userEmail = user.email;
    if (!userEmail || !chatId) {
      return NextResponse.json(
        { success: false, error: "Missing userEmail orchatId" },
        { status: 400 }
      );
    }

    const redisKey = `chat:messages:${userEmail}:${chatId}`;
    const messages = await redis.lrange(redisKey, 0, -1);
    console.log("messages ", messages);
    if (messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "No messages found in Redis" },
        { status: 200 }
      );
    }

    
    // Check if a chat already exists for thischatId and userEmail
    const { data: existingChat, error: chatError } = await supabase
      .from("chats")
      .select("id")
      .eq("email", userEmail)
      .eq("id", chatId)
      .single();

    console.log(chatError);

    if (chatError && chatError.code !== "PGRST116") {
      throw new Error(`Error checking chat existence: ${chatError.message}`);
    }

    if (existingChat) {
      console.log("chatid", chatId);
    } 
    else{
      throw new Error(`Previously not created chat ${chatError.message}`);
    }
    
    // Prepare messages for insertion into the `messages` table
    const formattedMessages = messages.map((msg) => {
      const parsedMessage = JSON.parse(msg); // Parse Redis-stored JSON
      console.log(parsedMessage);

      console.log(parsedMessage.role);
      return {
        chat_id: chatId,
        sender: parsedMessage.role,
        content: parsedMessage.content,
        message_type: "text", // Default to "text" if not provided
        created_at: new Date().toISOString(), // Add current timestamp in ISO format
      };
    });
    console.log("successfully inseted messages ");

    // Insert messages into the Supabase `messages` table
    const { error: insertError } = await supabase
      .from("messages")
      .insert(formattedMessages);

    if (insertError) {
      throw new Error(`Error inserting messages: ${insertError.message}`);
    }

    // Clear messages from Redis after successfully storing them in Supabase
    await redis.del(redisKey);

    return NextResponse.json({
      success: true,
      message: "Messages successfully uploaded to Supabase",
    });
  } catch (error: any) {
    console.error("Error in processing messages:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
