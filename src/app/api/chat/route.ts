// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import {chat} from "../../../tools/retrieving"
import OpenAI from "openai";
import "dotenv/config"
  
  const client = new OpenAI({
  });
  
  
  export async function POST(req: NextRequest) {
    try {
      const { messages } = await req.json();
      const relevantChats = await chat(messages[messages.length - 1].content)
      const SYSTEM_PROMPTS=`
        You are an AI assistant who helps resolving user query based on the 
        context available to you from a pdf file with the content and page number.

        only ans based on the available context from file only.

        Context:
        ${
        JSON.stringify(relevantChats)
        }

    `;
  
      const completion = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content:  SYSTEM_PROMPTS},
          ...messages,
        ],
      });
      
      return NextResponse.json({
        reply: completion.choices[0].message?.content ?? "",
      });
    } catch (error) {
      console.error("Chat API error:", error);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }