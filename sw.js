const CACHE='glols-test-shell-v2';
const base=new URL(self.registration.scope).pathname;
const SHELL=[base,base+'index.html',base+'transport.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('glols-test-shell-')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==self.location.origin||u.search||!SHELL.includes(u.pathname))return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),3500);
  try{const r=await fetch(e.request,{signal:controller.signal});if(r.ok)await cache.put(e.request,r.clone());return r;}
  catch(err){return await cache.match(e.request)||Response.error();}
  finally{clearTimeout(timer);}
 })());
});
