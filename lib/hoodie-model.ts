import * as T from 'three';
// A reusable garment mesh: cross-sectioned cotton body, tapered sleeves, an open
// hood, ribbed edges, pocket and drawcords. Print surfaces follow the body mesh.
export function surface(x:number,y:number,back=false){
 const w=.69+.065*Math.sin((y+.8)*2);
 return (back?-1:1)*(.29*Math.sqrt(Math.max(.05,1-(x/w)**2))+.009*Math.sin(x*29+y*9)+.006*Math.sin(y*36+x*8));
}
function grid(n:number,m:number,point:(u:number,v:number)=>T.Vector3){const p=[],uv=[],ix=[];for(let j=0;j<=m;j++)for(let i=0;i<=n;i++){const v=point(i/n,j/m);p.push(v.x,v.y,v.z);uv.push(i/n,j/m);}for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+n+1;ix.push(a,b,a+1,b,b+1,a+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;}
export function garment(){
 const group=new T.Group();group.name='ZL_Oversized_Hoodie';
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!;const im=ctx.createImageData(128,128);for(let i=0;i<im.data.length;i+=4){const v=175+Math.random()*65;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}ctx.putImageData(im,0,0);const weave=new T.CanvasTexture(canvas);weave.wrapS=weave.wrapT=T.RepeatWrapping;weave.repeat.set(12,16);
 const cotton=new T.MeshStandardMaterial({color:'#eeeae0',roughness:.94,bumpMap:weave,bumpScale:.008,side:T.DoubleSide});
 const rib=cotton.clone();rib.color.set('#dcd7cc');
 const add=(geometry:T.BufferGeometry,material=cotton)=>{const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;};
 add(grid(80,48,(u,v)=>{const y=-.9+v*1.65,a=u*Math.PI*2,w=.69+.065*Math.sin((y+.8)*2);const fold=.009*Math.sin(a*16+y*9)+.006*Math.sin(y*36+a*8);return new T.Vector3(Math.sin(a)*(w+fold),y,Math.cos(a)*(.29+fold));}));
 for(const sign of [-1,1]){
 const sleeve=add(grid(48,30,(u,v)=>{const a=u*Math.PI*2,r=.30-v*.12;return new T.Vector3(sign*(.58+v*.72+Math.cos(a)*r*.65),.52-v*1.22+Math.cos(a)*r*.6,Math.sin(a)*r*.89+.008*Math.sin(v*40+a*9));}));sleeve.name=sign<0?'Sleeve_L':'Sleeve_R';
 const cuff=add(new T.CylinderGeometry(.17,.16,.17,40,6),rib);cuff.position.set(sign*1.32,-.73,0);cuff.rotation.z=sign*.52;
 }
 const hem=add(new T.CylinderGeometry(.68,.67,.14,72,5),rib);hem.scale.z=.43;hem.position.y=-.91;
 // Open face of the hood points forwards (+z), with a recessed dark interior.
 const hood=add(grid(60,32,(u,v)=>{const a=-Math.PI*.64+u*Math.PI*1.28,yy=.57+v*.96,r=.49*Math.sqrt(Math.max(.025,1-((v-.32)/.84)**2));return new T.Vector3(Math.sin(a)*r,yy,-.10-Math.cos(a)*r*.79);}));hood.name='Hood';
 const rimPoints=[];for(let i=0;i<=64;i++){const a=i/64*Math.PI;rimPoints.push(new T.Vector3(Math.cos(a)*.39,.66+Math.sin(a)*.77,.17+Math.sin(a)*.015));}add(new T.TubeGeometry(new T.CatmullRomCurve3(rimPoints),64,.024,8,false),rib);
 const pocket=add(grid(26,16,(u,v)=>{const y=-.71+v*.37,w=.45-v*.13,x=(u-.5)*2*w;return new T.Vector3(x,y,surface(x,y)+.018+Math.sin(u*Math.PI)*.025);}));pocket.name='Kangaroo_pocket';
 for(const sign of [-1,1]){const pts=[new T.Vector3(sign*.18,.65,.29),new T.Vector3(sign*.20,.40,.34),new T.Vector3(sign*.19,.12,.34)];add(new T.TubeGeometry(new T.CatmullRomCurve3(pts),20,.009,6,false),rib);}
 return {group,cotton,rib,weave};
}
export function printGeometry(x=0,y=.18,scale=1,back=false){return grid(32,32,(u,v)=>{const xx=(back?-1:1)*(x+(u-.5)*.78*scale),yy=y+(v-.5)*.70*scale;return new T.Vector3(xx,yy,surface(xx,yy,back)+(back?-.022:.022));});}
