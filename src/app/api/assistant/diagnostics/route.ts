import {generateText} from 'ai';
import {NextResponse} from 'next/server';
import {requireUser,sameOrigin,failure,AppError} from '@/lib/v2/http';
import {rateLimit} from '@/lib/v2/rate-limit';
export const maxDuration=60;
export async function POST(req:Request){try{if(process.env.VERCEL_ENV!=='preview')throw new AppError('Not found.',404);sameOrigin(req);const u=await requireUser();await rateLimit('model-check:'+u.id,2,86400);const models=['openai/gpt-4.1-mini','openai/gpt-5-nano','google/gemini-2.5-flash','mistral/mistral-small'];const results=await Promise.all(models.map(async model=>{try{const r=await generateText({model,prompt:'Return the single word ready.',maxOutputTokens:30,maxRetries:0,abortSignal:AbortSignal.timeout(18000)});return {model,ok:true,text:r.text};}catch(e){const error=e as {message?:string;statusCode?:number};return {model,ok:false,status:error.statusCode,message:error.message?.slice(0,250)};}}));return NextResponse.json({results});}catch(e){return failure(e);}}
