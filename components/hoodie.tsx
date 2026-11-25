'use client';
import type {Customization} from '@/lib/types';
const photos:Record<string,string>={medina:'signature',roots:'roots',casa:'after-hours',essential:'tawakal',blank:'blank'};
export default function Hoodie({color='Noir',design='medina',custom,className=''}:{color?:string;design?:string;custom?:Customization;className?:string;back?:boolean}){
return <div className={'hoodie photo-hoodie '+className}><img src={'/images/'+(custom?'custom-blank':photos[design]||'signature')+'.webp'} alt={'Hoodie '+color} loading="lazy"/>{custom&&<div className="print-preview" style={{color:custom.ink,fontFamily:custom.font==='serif'?'Georgia,serif':custom.font==='mono'?'monospace':'Arial,sans-serif'}}>{custom.artwork&&<img src={custom.artwork} alt="Ton visuel"/>}<strong>{custom.text}</strong></div>}</div>;
}
