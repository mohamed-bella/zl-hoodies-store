import 'server-only';
import {createHmac,timingSafeEqual,createHash} from 'node:crypto';
import {cookies} from 'next/headers';
import {NextRequest} from 'next/server';
export function same(a:string,b:string){const x=createHash('sha256').update(a).digest(),y=createHash('sha256').update(b).digest();return timingSafeEqual(x,y);}
function sign(s:string){return createHmac('sha256',process.env.ADMIN_PASSWORD || '').update('derb-session:'+s).digest('hex');}
export function token(){const exp=String(Date.now()+1000*60*60*12);return `${exp}.${sign(exp)}`;}
export async function isAdmin(){if(!process.env.ADMIN_PASSWORD)return false;const t=(await cookies()).get('derb_session')?.value||'';const [exp,sig]=t.split('.');return !!exp&&!!sig&&Number(exp)>Date.now()&&same(sig,sign(exp));}
export function sameOrigin(req:NextRequest){const origin=req.headers.get('origin');return !origin || origin===req.nextUrl.origin || origin===`${req.headers.get('x-forwarded-proto')||req.nextUrl.protocol.replace(':','')}://${req.headers.get('host')}`;}
