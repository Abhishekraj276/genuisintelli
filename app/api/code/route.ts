import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import ChatCompletionRequestMessage from 'openai';
import {ChatCompletionMessageParam} from 'openai/resources/index.mjs'



// const openai = new OpenAI({
//     apiKey: OPENAI_API_KEY
// });

const openai= new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});



export async function POST(
    req: Request
){
     try {
        const body =await req.json();
        const {message} =body;

        if(!openai.apiKey){
            return new NextResponse("OpenAI API key not configurd", {status:500});

        }
        if(!message){
            return new NextResponse("Message are required", {status:400});
        }

    const response =await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: message,
      });
      return NextResponse.json(response.choices[0].message)

     } catch (error) {
        console.log("[CONVERSATIN_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
     }
}

