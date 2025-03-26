const CACHE_NAME = 'sergiolpta-site-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles4.8.css',
    '/js/cache-control.js',
    '/images/logo.jpg',
    '/images/cta-bg.jpg',
    '/images/android-chrome-192x192.png',
    '/images/android-chrome-512x512.png',
    '/images/apple-touch-icon.png',
    '/images/favicon-32x32.png',
    '/images/favicon-16x16.png',
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
                // Usar addAll com tratamento de erro para cada URL
                const cachePromises = urlsToCache.map(url => {
                    // Tentar adicionar cada URL individualmente para que um erro não interrompa todo o processo
                    return cache.add(url).catch(error => {
                        console.warn('Não foi possível adicionar ao cache:', url, error);
                        // Não falhar o processo de instalação por causa de um único recurso
                        return Promise.resolve();
                    });
                });
                return Promise.all(cachePromises);
            })
    );
    // Ativar imediatamente sem esperar que outras abas sejam fechadas
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
                    return Promise.resolve();
                }).filter(Boolean)
            );
        })
    );
    // Tomar controle de clientes não controlados (páginas abertas antes da instalação)
    event.waitUntil(self.clients.claim());
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    // Ignorar requisições para o Google Analytics e outros serviços externos
    if (event.request.url.includes('googletagmanager.com') || 
        event.request.url.includes('google-analytics.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                // Clone da requisição original
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest)
                    .then(response => {
                        // Verificar se a resposta é válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone da resposta para armazenar no cache
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(error => {
                                console.warn('Erro ao armazenar no cache:', error);
                            });
                            
                        return response;
                    })
                    .catch(error => {
                        console.warn('Falha ao buscar recurso:', event.request.url, error);
                        // Tentar retornar uma resposta offline para HTML
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        // Para outros recursos, apenas falhar silenciosamente
                        return new Response('Recurso não disponível offline', {
                            status: 503,
                            statusText: 'Serviço indisponível'
                        });
                    });
            })
    );
});

// Evento de mensagem para comunicação com a página
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});