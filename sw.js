// Retire old cache-first releases so visitors receive current Pages files.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('radiant-spark-')).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
// No fetch interception: browser requests use the network normally.
