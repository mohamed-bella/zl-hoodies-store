'use client';
import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
export default function Dialog({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;d?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};},[]);
 return <dialog ref={ref} className={`dialog ${wide?'wide':''}`} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dialog-top"><span>{title}</span><button className="icon-btn" aria-label="Fermer" onClick={onClose}><X/></button></div>{children}</dialog>;
}
