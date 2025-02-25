const VERSION = "1.00"
const CACHE = "pwaus"

const ARCHIVOS = [
	"index.html",
 ]

 if (self instanceof ServiceWorkerGlobalScope) {
  // Evento de instalación
  self.addEventListener("install", (evt) => {
    console.log("El service worker se está instalando.")
    evt.waitUntil(llenaElCache())
  })

  // Evento fetch para manejar solicitudes de red
  self.addEventListener("fetch", (evt) => {
    if (evt.request.method === "GET") {
      evt.respondWith(buscaLaRespuestaEnElCache(evt))
    }
  })

  // Evento de activación
  self.addEventListener("activate", () => {
    console.log("El service worker está activo.")
  })

  // Manejo de notificaciones push
  self.addEventListener("push", (event) => {
    const notificacion = event.data
    if (notificacion !== null && self.Notification.permission === 'granted') {
      event.waitUntil(muestraNotificacion(notificacion))
    }
  })

  // Manejo de clics en notificaciones
  self.addEventListener("notificationclick", (event) => {
    event.notification.close()
    event.waitUntil(muestraVentana())
  })
}

async function llenaElCache() {
  console.log("Intentando cargar caché:", CACHE)
  const keys = await caches.keys()
  for (const key of keys) {
    await caches.delete(key)
  }
  const cache = await caches.open(CACHE)
  await cache.addAll(ARCHIVOS)
  console.log("Cache cargado:", CACHE)
  console.log("Versión:", VERSION)
}

async function buscaLaRespuestaEnElCache(evt) {
  const cache = await caches.open(CACHE)
  const request = evt.request
  const response = await cache.match(request, { ignoreSearch: true })
  if (response === undefined) {
    return fetch(request)
  } else {
    return response
  }
}



