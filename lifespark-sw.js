// Cache only the app shell. Never present cached deal or membership responses as live.
const CACHE='lifespark-shell-v3';
const SHELL=['/app.html','/lifespark.html','/lifespark.js?v=3','/lifespark.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lifespark-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 const shell=SHELL.some(path=>u.pathname===new URL(path,self.location.origin).pathname);if(!shell)return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(u.pathname,copy)))}return r}).catch(()=>caches.match(u.pathname).then(r=>r||caches.match(SHELL.find(p=>new URL(p,self.location.origin).pathname===u.pathname)))));
});
