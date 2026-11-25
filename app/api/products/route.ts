import {NextRequest,NextResponse} from 'next/server';
import {products,saveProduct} from '@/lib/db';
import {isAdmin,sameOrigin} from '@/lib/auth';
import {z} from 'zod';
import {COLORS,SIZES} from '@/lib/types';
export async function GET(req:NextRequest){const all=req.nextUrl.searchParams.get('all')==='1';if(all&&!await isAdmin())return NextResponse.json({error:'Connexion requise.'},{status:401});return NextResponse.json(products(all));}
const schema=z.object({id:z.string().regex(/^[a-z0-9-]{1,80}$/),name:z.string().trim().min(2).max(100),price:z.number().int().min(1).max(50000),category:z.enum(['Graphics','Essentials','Custom']),color:z.string(),colors:z.array(z.string()).min(1),sizes:z.array(z.string()).min(1),stock:z.number().int().min(0).max(100000),badge:z.string().max(40),design:z.enum(['medina','roots','casa','essential','blank']),image:z.string().max(1000).refine(s=>!s||/^\/media\/[a-zA-Z0-9.-]+$/.test(s)||/^https:\/\//.test(s)),description:z.string().min(5).max(2000),active:z.boolean()});
export async function POST(req:NextRequest){if(!await isAdmin())return NextResponse.json({error:'Connexion requise.'},{status:401});if(!sameOrigin(req))return NextResponse.json({error:'Origine refusée.'},{status:403});const p=schema.safeParse(await req.json().catch(()=>null));if(!p.success||p.data.colors.some(c=>!COLORS.some(x=>x.name===c))||p.data.sizes.some(s=>!SIZES.includes(s))||!p.data.colors.includes(p.data.color))return NextResponse.json({error:'Vérifie les champs du produit.'},{status:400});saveProduct(p.data);return NextResponse.json(p.data);}
