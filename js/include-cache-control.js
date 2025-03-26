/**
 * Script para incluir o controle de cache em todas as páginas
 * Este script deve ser incluído em todas as páginas HTML do site
 */

// Função para incluir o script de controle de cache
function includeCacheControl() {
    // Verificar se o script já está incluído
    if (document.querySelector('script[src="js/cache-control.js"]')) {
        return;
    }
    
    // Criar o elemento script
    const script = document.createElement('script');
    script.src = 'js/cache-control.js';
    
    // Adicionar ao final do body
    document.body.appendChild(script);
}

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', includeCacheControl);

// Adicionar meta tags para controle de cache
function addCacheControlMetaTags() {
    // Verificar se as meta tags já existem
    if (document.querySelector('meta[http-equiv="Cache-Control"]')) {
        return;
    }
    
    // Criar meta tags para controle de cache
    const metaTags = [
        { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { httpEquiv: 'Pragma', content: 'no-cache' },
        { httpEquiv: 'Expires', content: '0' }
    ];
    
    // Adicionar meta tags ao head
    metaTags.forEach(meta => {
        const metaTag = document.createElement('meta');
        metaTag.httpEquiv = meta.httpEquiv;
        metaTag.content = meta.content;
        document.head.appendChild(metaTag);
    });
}

// Executar imediatamente
addCacheControlMetaTags();
