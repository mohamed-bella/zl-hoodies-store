export const COLORS = [{name:'Noir',hex:'#292a28'},{name:'Écru',hex:'#e8e3d5'},{name:'Bordeaux',hex:'#722333'},{name:'Forêt',hex:'#354b3d'},{name:'Gris',hex:'#9b9b94'}];
export const SIZES = ['S','M','L','XL','XXL'];
export type Product = { id:string; name:string; price:number; category:string; color:string; colors:string[]; sizes:string[]; stock:number; badge:string; design:string; image:string; description:string; active:boolean };
export type Customization = {text:string; ink:string; side:'front'|'back'; artwork:string; font:string; scale?:number; offsetX?:number; offsetY?:number; rotation?:number};
export type CartItem = {key:string; productId:string; name:string; price:number; size:string; color:string; quantity:number; design:string; image:string; custom?:Customization};
export type Order = {id:string; createdAt:string; status:string; customer:{name:string;phone:string;city:string;address:string;note:string};items:CartItem[];subtotal:number;shipping:number;total:number};
export const money = (n:number) => `${n.toLocaleString('fr-MA')} DH`;
