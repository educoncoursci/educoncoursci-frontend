// ============================================================
//  sw.js — Service Worker EduConcoursCI
//  Cache statique + stratégie network-first pour l'API
// ============================================================

const CACHE_NOM     = "educoncoursci-v2"; // ⚠️ Incrémente ce numéro (v3, v4…) à
// chaque déploiement qui touche un fichier de CACHE_STATIQUE (surtout
// js/api.js) — c'est ce qui force le Service Worker à jeter l'ancien
// cache et retélécharger les fichiers à jour. Sans ça, un visiteur
// qui a déjà visité le site continue de recevoir indéfiniment les
// anciennes versions mises en cache, même après un Ctrl+F5, car le
// Service Worker sert en "cache-first" (voir le fetch handler
// plus bas) et ne revérifie jamais le serveur tant que le nom du
// cache ne change pas.
const CACHE_STATIQUE = [
"/",
"/index.html",
"/concours.html",
"/preparation.html",
"/boutique.html",
"/css/style.css",
"/css/components.css",
"/css/dashboard.css",
"/css/admin.css",
"/css/responsive.css",
"/js/api.js",
"/js/auth.js",
"/js/main.js",
"/assets/favicon.ico",
];

// ── Installation : cache les assets statiques ────────────────
self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NOM)
.then(cache => cache.addAll(CACHE_STATIQUE))
.then(() => self.skipWaiting())
);
});

// ── Activation : nettoie les anciens caches ──────────────────
self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.filter(k => k !== CACHE_NOM).map(k => caches.delete(k))
)
).then(() => self.clients.claim())
);
});

// ── Fetch : stratégie hybride ────────────────────────────────
self.addEventListener("fetch", event => {
const url = new URL(event.request.url);

// API → network-first (pas de cache)
if (url.pathname.startsWith("/api/")) {
event.respondWith(
fetch(event.request).catch(() =>
new Response(
JSON.stringify({ error: "Hors ligne. Vérifie ta connexion." }),
{ headers: { "Content-Type": "application/json" } }
)
)
);
return;
}

// Assets statiques → cache-first
event.respondWith(
caches.match(event.request).then(cached => {
if (cached) return cached;
return fetch(event.request).then(response => {
// Met en cache les nouvelles ressources statiques
if (response.ok && event.request.method === "GET") {
const clone = response.clone();
caches.open(CACHE_NOM).then(cache => cache.put(event.request, clone));
}
return response;
}).catch(() => {
// Page offline de secours
if (event.request.mode === "navigate") {
return caches.match("/index.html");
}
});
})
);
});

// ── Messages depuis la page ───────────────────────────────────
self.addEventListener("message", event => {
if (event.data?.action === "skipWaiting") self.skipWaiting();
});

// ── Notifications Push (Lot 11) ───────────────────────────────
self.addEventListener("push", event => {
let data = { titre: "EduConcoursCI", message: "Nouvelle notification.", url: "/" };
try {
if (event.data) data = { ...data, ...event.data.json() };
} catch {
// Corps non-JSON — on garde le message par défaut
}

event.waitUntil(
self.registration.showNotification(data.titre, {
body: data.message,
icon: "/assets/favicon.ico",
badge: "/assets/favicon.ico",
data: { url: data.url || "/" },
})
);
});

// ── Clic sur une notification → ouvre/focus la page ciblée ────
self.addEventListener("notificationclick", event => {
event.notification.close();
const url = event.notification.data?.url || "/";
event.waitUntil(
self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientsArr => {
const existant = clientsArr.find(c => c.url.includes(url));
if (existant) return existant.focus();
return self.clients.openWindow(url);
})
);
});