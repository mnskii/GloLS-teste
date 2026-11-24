const CACHE='glols-test-shell-v3';
const base=new URL(self.registration.scope).pathname;
const SHELL=[base+'index.html',base+'transport.js'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(SHELL);await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('glols-test-shell-')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(base))return;
 const nav=e.request.mode==='navigate'&&(u.pathname===base||u.pathname===base+'index.html');
 if(!nav&&(u.search||!SHELL.includes(u.pathname)))return;
 e.respondWith((async()=>{
 const c=await caches.open(CACHE),key=nav?base+'index.html':u.pathname;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);
 try{const r=await fetch(e.request,{signal:controller.signal});if(r.ok&&!u.search)await c.put(key,r.clone());if(r.ok)return r;return await c.match(key)||r;}
 catch(err){return await c.match(key)||Response.error();}
 finally{clearTimeout(timer);}
 })());
});
