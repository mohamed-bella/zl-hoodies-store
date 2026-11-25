import {NextRequest,NextResponse} from 'next/server';
import {db,products,orders} from '@/lib/db';
import {isAdmin,sameOrigin} from '@/lib/auth';
import {orderSchema} from '@/lib/order-schema';
import {randomUUID} from 'node:crypto';
import type {CartItem,Order} from '@/lib/types';
export async function GET(){if(!await isAdmin())return NextResponse.json({error:'Connexion requise.'},{status:401});return NextResponse.json(orders());}
export async function POST(req:NextRequest){
 if(!sameOrigin(req))return NextResponse.json({error:'Origine refusée.'},{status:403});
 if(Number(req.headers.get('content-length'))>6000000)return NextResponse.json({error:'Commande trop volumineuse.'},{status:413});
 const parsed=orderSchema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Vérifie tes coordonnées et ton panier. Téléphone : 06/07 ou +212.'},{status:400});
 const d=db();d.exec('BEGIN IMMEDIATE');try{
 const catalog=products();const items:CartItem[]=[];const quantities=new Map<string,number>();
 for(const i of parsed.data.items){const p=catalog.find(x=>x.id===i.productId);if(!p||!p.sizes.includes(i.size)||!p.colors.includes(i.color))throw new Error('Une option du panier n’est plus disponible.');if(i.custom&&p.category!=='Custom')throw new Error('Personnalisation non disponible sur ce modèle.');const q=(quantities.get(p.id)||0)+i.quantity;quantities.set(p.id,q);if(q>p.stock)throw new Error(`Stock insuffisant pour ${p.name}.`);items.push({...i,key:randomUUID(),name:p.name,price:p.price+(i.custom?70:0),design:p.design,image:p.image});}
 const subtotal=items.reduce((s,i)=>s+i.price*i.quantity,0);const order:Order={id:'DRB-'+randomUUID().slice(0,8).toUpperCase(),createdAt:new Date().toISOString(),status:'Nouvelle',customer:parsed.data.customer,items,subtotal,shipping:subtotal>=600?0:35,total:subtotal+(subtotal>=600?0:35)};
 for(const [id,q] of quantities){const p=catalog.find(x=>x.id===id)!;p.stock-=q;d.prepare('UPDATE products SET data=? WHERE id=?').run(JSON.stringify(p),id);}d.prepare('INSERT INTO orders VALUES (?,?)').run(order.id,JSON.stringify(order));d.exec('COMMIT');return NextResponse.json({id:order.id,total:order.total},{status:201});
 }catch(e){d.exec('ROLLBACK');return NextResponse.json({error:e instanceof Error?e.message:'Impossible de créer la commande.'},{status:400});}
}
export async function PATCH(req:NextRequest){if(!await isAdmin())return NextResponse.json({error:'Connexion requise.'},{status:401});if(!sameOrigin(req))return NextResponse.json({error:'Origine refusée.'},{status:403});const data=await req.json().catch(()=>null);if(!data||!['Nouvelle','Confirmée','En préparation','Expédiée','Livrée','Annulée'].includes(data.status))return NextResponse.json({error:'Statut invalide.'},{status:400});const d=db();d.exec('BEGIN IMMEDIATE');try{const order=orders().find(x=>x.id===data.id);if(!order){d.exec('ROLLBACK');return NextResponse.json({error:'Commande introuvable.'},{status:404});}if(order.status==='Annulée'&&data.status!=='Annulée')throw new Error('Une commande annulée ne peut pas être réactivée.');if(order.status!=='Annulée'&&data.status==='Annulée'){for(const item of order.items){const p=products(true).find(x=>x.id===item.productId);if(p){p.stock+=item.quantity;d.prepare('UPDATE products SET data=? WHERE id=?').run(JSON.stringify(p),p.id);}}}order.status=data.status;d.prepare('UPDATE orders SET data=? WHERE id=?').run(JSON.stringify(order),order.id);d.exec('COMMIT');return NextResponse.json(order);}catch(e){d.exec('ROLLBACK');return NextResponse.json({error:e instanceof Error?e.message:'Erreur.'},{status:400});}}
