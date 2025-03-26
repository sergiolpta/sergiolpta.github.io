/**
 * Script para otimização de imagens
 * Este script implementa lazy loading avançado e otimização de imagens
 */

// Configuração principal
const imageOptimizer = {
    // Configurações padrão
    settings: {
        lazyLoadThreshold: 200, // pixels antes da imagem entrar na viewport
        lowQualityPreview: true, // habilita previews de baixa qualidade
        preconnect: true, // habilita preconnect para domínios externos
        logOptimizations: false // log de otimizações no console
    },

    // Inicialização
    init: function() {
        // Adicionar preconnect para domínios externos de imagens
        if (this.settings.preconnect) {
            this.addPreconnect();
        }

        // Configurar lazy loading para todas as imagens
        this.setupLazyLoading();
        
        // Adicionar suporte para WebP quando disponível
        this.detectWebPSupport();
        
        // Registrar métricas de carregamento de imagens
        this.registerPerformanceMetrics();
        
        if (this.settings.logOptimizations) {
            console.log('🖼️ Otimizador de imagens inicializado');
        }
    },
    
    // Adicionar tags preconnect para domínios externos
    addPreconnect: function() {
        const domains = [
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        
        domains.forEach(domain => {
            if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = domain;
                document.head.appendChild(link);
                
                // Adicionar também dns-prefetch como fallback
                const dnsLink = document.createElement('link');
                dnsLink.rel = 'dns-prefetch';
                dnsLink.href = domain;
                document.head.appendChild(dnsLink);
            }
        });
    },
    
    // Configurar lazy loading para todas as imagens
    setupLazyLoading: function() {
        // Verificar se o IntersectionObserver está disponível
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Carregar a imagem se tiver data-src
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            delete img.dataset.src;
                        }
                        
                        // Carregar srcset se disponível
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            delete img.dataset.srcset;
                        }
                        
                        // Remover classe de placeholder
                        img.classList.remove('lazy-image');
                        img.classList.add('lazy-loaded');
                        
                        // Parar de observar a imagem
                        observer.unobserve(img);
                        
                        if (this.settings.logOptimizations) {
                            console.log(`🖼️ Imagem carregada: ${img.src}`);
                        }
                    }
                });
            }, {
                rootMargin: `${this.settings.lazyLoadThreshold}px 0px`,
                threshold: 0.01
            });
            
            // Observar todas as imagens com atributo data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            // Adicionar lazy loading nativo para imagens que não têm data-src
            document.querySelectorAll('img:not([loading])').forEach(img => {
                if (!img.hasAttribute('loading') && !img.classList.contains('no-lazy')) {
                    img.loading = 'lazy';
                }
            });
        } else {
            // Fallback para navegadores que não suportam IntersectionObserver
            this.setupLazyLoadingFallback();
        }
    },
    
    // Fallback para navegadores sem suporte a IntersectionObserver
    setupLazyLoadingFallback: function() {
        // Função para verificar se a imagem está visível
        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= (window.innerHeight + this.settings.lazyLoadThreshold) &&
                rect.left <= window.innerWidth
            );
        };
        
        // Função para carregar imagens visíveis
        const lazyLoad = () => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                if (isInViewport(img)) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        delete img.dataset.srcset;
                    }
                    
                    img.classList.remove('lazy-image');
                    img.classList.add('lazy-loaded');
                }
            });
        };
        
        // Adicionar eventos para verificar imagens
        ['scroll', 'resize', 'orientationchange'].forEach(event => {
            window.addEventListener(event, lazyLoad);
        });
        
        // Carregar imagens visíveis inicialmente
        window.addEventListener('load', lazyLoad);
        lazyLoad();
    },
    
    // Detectar suporte a WebP
    detectWebPSupport: function() {
        const webpTest = new Image();
        webpTest.onload = function() {
            const hasWebP = (webpTest.width > 0) && (webpTest.height > 0);
            document.documentElement.classList.add(hasWebP ? 'webp' : 'no-webp');
            
            if (imageOptimizer.settings.logOptimizations) {
                console.log(`🖼️ Suporte a WebP: ${hasWebP ? 'Sim' : 'Não'}`);
            }
        };
        webpTest.onerror = function() {
            document.documentElement.classList.add('no-webp');
        };
        webpTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    },
    
    // Registrar métricas de desempenho de imagens
    registerPerformanceMetrics: function() {
        if ('PerformanceObserver' in window) {
            // Observar carregamento de recursos
            const imgObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries().filter(entry => 
                    entry.initiatorType === 'img' || 
                    (entry.name && (entry.name.endsWith('.jpg') || 
                                   entry.name.endsWith('.jpeg') || 
                                   entry.name.endsWith('.png') || 
                                   entry.name.endsWith('.webp')))
                );
                
                if (entries.length > 0 && this.settings.logOptimizations) {
                    const totalBytes = entries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
                    console.log(`🖼️ Métricas de imagem: ${entries.length} imagens, ${Math.round(totalBytes / 1024)} KB transferidos`);
                }
                
                // Armazenar métricas para análise posterior
                if (window.localStorage) {
                    try {
                        const metrics = JSON.parse(localStorage.getItem('image-metrics') || '{}');
                        metrics.lastUpdate = new Date().toISOString();
                        metrics.imageCount = (metrics.imageCount || 0) + entries.length;
                        metrics.totalBytes = (metrics.totalBytes || 0) + entries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
                        localStorage.setItem('image-metrics', JSON.stringify(metrics));
                    } catch (e) {
                        console.warn('Erro ao armazenar métricas de imagem:', e);
                    }
                }
            });
            
            imgObserver.observe({entryTypes: ['resource']});
        }
    },
    
    // Converter uma imagem para formato WebP (para uso futuro com API de conversão)
    convertToWebP: function(imgElement, quality = 0.8) {
        // Verificar se o navegador suporta canvas e toBlob
        if (!document.createElement('canvas').toBlob) {
            return;
        }
        
        // Criar canvas para conversão
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth;
        canvas.height = imgElement.naturalHeight;
        
        // Desenhar imagem no canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0);
        
        // Converter para WebP se suportado
        if (document.documentElement.classList.contains('webp')) {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const webpUrl = URL.createObjectURL(blob);
                        imgElement.src = webpUrl;
                        
                        if (this.settings.logOptimizations) {
                            console.log(`🖼️ Imagem convertida para WebP: ${imgElement.src}`);
                        }
                    }
                },
                'image/webp',
                quality
            );
        }
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    imageOptimizer.init();
});

// Exportar para uso global
window.imageOptimizer = imageOptimizer;
