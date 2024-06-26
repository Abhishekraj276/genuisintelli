import { NextResponse } from 'next/server';
import OpenAI from 'openai';
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
        const {prompt, amount = 1, resolution = "512x512"} =body;

        if(!openai.apiKey){
            return new NextResponse("OpenAI API key not configurd", {status:500});

        }
        if(!prompt){
            return new NextResponse("Message are required", {status:400});
        }
        if(!amount){
            return new NextResponse("Message are required", {status:400});
        }
        if(!resolution){
            return new NextResponse("Message are required", {status:400});
        }

    const response =await openai.images.generate({
       prompt,
       n: parseInt(amount,10),
       size: resolution,
      });
      return NextResponse.json(response.data)

     } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
     }
}

