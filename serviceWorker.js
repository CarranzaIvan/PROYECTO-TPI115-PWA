const staticMinerva = "minerva-connect-site-v1"
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/Recursos/pantallaInicio512"

]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticMinerva).then(cache => {
      cache.addAll(assets)
    })
  )
})
  
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
})