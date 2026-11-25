import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import type { Product,Order } from './types';
const g = globalThis as unknown as {derbDb?:DatabaseSync};
export function db() {
 if(g.derbDb) return g.derbDb;
 const dir=path.resolve(/* turbopackIgnore: true */ process.env.DATA_DIR || './data');mkdirSync(dir,{recursive:true});
 const d=new DatabaseSync(path.join(dir,'store.sqlite'));d.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS attempts(ip TEXT PRIMARY KEY,count INTEGER NOT NULL,reset INTEGER NOT NULL);');
 if(!(d.prepare('SELECT id FROM products LIMIT 1').get())) {
 const seed:Product[] = [
 {id:'medina-black',name:'Medina Club',price:349,category:'Graphics',color:'Noir',colors:['Noir','Écru','Bordeaux'],sizes:['S','M','L','XL','XXL'],stock:40,badge:'BESTSELLER',design:'medina',image:'',description:'Une silhouette ample, une identité qui reste. Hoodie unisexe, intérieur molletonné et motif Medina Club.',active:true},
 {id:'roots-ecru',name:'Roots Never Fade',price:379,category:'Graphics',color:'Écru',colors:['Écru','Noir'],sizes:['S','M','L','XL'],stock:30,badge:'NOUVEAU',design:'roots',image:'',description:'Un hommage à nos racines. Coupe oversize, épaules tombantes et illustration inspirée du Maroc.',active:true},
 {id:'casa-bordeaux',name:'Casa After Hours',price:369,category:'Graphics',color:'Bordeaux',colors:['Bordeaux','Noir','Forêt'],sizes:['S','M','L','XL','XXL'],stock:25,badge:'',design:'casa',image:'',description:'Pour les nuits qui deviennent des souvenirs. Hoodie bordeaux, imprimé contrasté et coupe décontractée.',active:true},
 {id:'essential-forest',name:'The Everyday',price:299,category:'Essentials',color:'Forêt',colors:['Forêt','Noir','Écru','Gris'],sizes:['S','M','L','XL','XXL'],stock:50,badge:'ESSENTIAL',design:'essential',image:'',description:'Le hoodie qu’on remet encore. Sans grand discours : une coupe ample, un petit marquage DERB et du confort.',active:true},
 {id:'your-hoodie',name:'Your Hoodie, Your Rules',price:299,category:'Custom',color:'Écru',colors:['Noir','Écru','Bordeaux','Forêt','Gris'],sizes:['S','M','L','XL','XXL'],stock:100,badge:'À PERSONNALISER',design:'blank',image:'',description:'Pars d’une page blanche. Ajoute ton texte ou ton visuel, choisis ta couleur et crée ta pièce.',active:true}
 ];for(const p of seed){if(p.category==='Custom'){p.color='Écru';p.colors=['Écru','Noir','Bordeaux','Forêt','Gris'];}}const stmt=d.prepare('INSERT INTO products VALUES (?,?)');for(const p of seed)stmt.run(p.id,JSON.stringify(p));
 }g.derbDb=d;return d;
}
export function products(all=false):Product[] {return (db().prepare('SELECT data FROM products').all() as {data:string}[]).map(x=>JSON.parse(x.data)).filter(p=>all||p.active);}
export function orders():Order[] {return (db().prepare('SELECT data FROM orders ORDER BY rowid DESC').all() as {data:string}[]).map(x=>JSON.parse(x.data));}
export function saveProduct(p:Product){db().prepare('INSERT OR REPLACE INTO products VALUES (?,?)').run(p.id,JSON.stringify(p));}
