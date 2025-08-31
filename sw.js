const CACHE_NAME = 'sergiolpta-site-v2.2';
const urlsToCache = [
    '/',
    '/styles4.8.css',
    '/js/cache-control.js',
    '/site.webmanifest',
    '/favicon.ico',
    '/images/logo.jpg',
    '/images/cta-bg.jpg',
    '/images/android-chrome-192x192.png',
    '/images/android-chrome-512x512.png',
    '/images/apple-touch-icon.png',
    '/images/favicon-32x32.png',
    '/images/favicon-16x16.png',
    '/images/favicon.ico',
    '/images/zigbee-meta.jpg',
    '/images/home.png',
    '/images/tendencias.jpg',
    '/images/multi.jpg',
    '/images/acessibilidade.jpg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                const cachePromises = urlsToCache.map(url => {
                    return cache.add(url).catch(error => {
                        console.warn('Não foi possível adicionar ao cache:', url, error);
                        return Promise.resolve();
                    });
                });
                return Promise.all(cachePromises);
            })
    );
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Limpando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(self.clients.claim());
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    if (event.request.url.includes('googletagmanager.com') || 
        event.request.url.includes('google-analytics.com')) {
        return;
    }

    const isImage = event.request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response && !isImage) {
                return response;
            }

            if (isImage) {
                return fetch(event.request)
                    .then(networkResponse => {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(() => {
                        if (response) {
                            return response;
                        }
                        return response;
                    });
            }

            const fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(error => {
                    console.warn('Falha ao buscar recurso:', event.request.url, error);
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/');
                    }
                    return new Response('Recurso não disponível offline', {
                        status: 503,
                        statusText: 'Serviço indisponível'
                    });
                });
        })
    );
});

// Comunicação com a página
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
