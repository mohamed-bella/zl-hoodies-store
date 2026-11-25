import { NextRequest,NextResponse } from 'next/server';
import {same,token,sameOrigin,isAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
export async function GET(){return NextResponse.json({authenticated:await isAdmin()});}
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Origine refusée.'},{status:403});
 if(!process.env.ADMIN_PASSWORD)return NextResponse.json({error:'Configure ADMIN_PASSWORD dans .env pour activer la connexion.'},{status:503});
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';const d=db();const now=Date.now();const r=d.prepare('SELECT count,reset FROM attempts WHERE ip=?').get(ip) as {count:number;reset:number}|undefined;
 if(r&&r.reset>now&&r.count>=8)return NextResponse.json({error:'Trop de tentatives. Réessaie dans 15 minutes.'},{status:429});
 const data=await req.json().catch(()=>null);if(!data||typeof data.password!=='string'||data.password.length>500||!same(data.password,process.env.ADMIN_PASSWORD)){
 d.prepare('INSERT OR REPLACE INTO attempts VALUES (?,?,?)').run(ip,r&&r.reset>now?r.count+1:1,r&&r.reset>now?r.reset:now+900000);return NextResponse.json({error:'Mot de passe incorrect.'},{status:401});}
 d.prepare('DELETE FROM attempts WHERE ip=?').run(ip);const res=NextResponse.json({ok:true});res.cookies.set('derb_session',token(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:43200});return res;
}
export async function DELETE(req:NextRequest){if(!sameOrigin(req))return NextResponse.json({error:'Origine refusée.'},{status:403});const res=NextResponse.json({ok:true});res.cookies.delete('derb_session');return res;}
