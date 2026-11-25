import {readFile} from 'node:fs/promises';
import path from 'node:path';
export async function GET(_req:Request,{params}:{params:Promise<{filename:string}>}){
 const {filename}=await params;
 if(!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(filename))return new Response('Not found',{status:404});
 try{const root=path.resolve(/* turbopackIgnore: true */process.env.DATA_DIR||'./data');const data=await readFile(path.join(root,'uploads',filename));return new Response(data,{headers:{'Content-Type':filename.endsWith('.png')?'image/png':filename.endsWith('.webp')?'image/webp':'image/jpeg','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});}catch{return new Response('Not found',{status:404});}
}
