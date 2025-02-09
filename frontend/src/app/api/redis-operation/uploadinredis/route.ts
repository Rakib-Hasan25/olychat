import { NextRequest, NextResponse } from "next/server";
import redis from '@/lib/redis'; 

export async function POST(req: NextRequest, res: NextResponse) {
  
    try {
        // Parse the incoming JSON request
        const { userEmail, chatId, message } = await req.json();
    
        if (!userEmail || !chatId|| !message) {
          return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }
        


        
        // Construct the Redis key using userEmail and topicId
        const redisKey = `chat:messages:${userEmail}:${chatId}`;
    
        // Push the message into the Redis list
        await redis.rpush(redisKey, JSON.stringify(message));
    
        // Respond with success
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("Error in pushing message to Redis:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
      }
  
}