export function safeNext(value:unknown){
 const path=typeof value==='string'?value:'/app';
 if(!/^\/(?!\/)/.test(path)||path.includes('\\')||/[\u0000-\u001f\u007f]/.test(path))return '/app';
 try{const url=new URL(path,'https://shopablock.invalid');return url.origin==='https://shopablock.invalid'?path:'/app';}catch{return '/app';}
}
