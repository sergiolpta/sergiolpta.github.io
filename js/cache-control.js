/**
 * Script para gerenciamento de cache e cookies
 * Permite aos usuários limpar o cache local e forçar o recarregamento da página
 */

// Função para verificar se há uma nova versão do site
function checkForSiteUpdates() {
    // Versão atual do site (atualizar manualmente quando houver mudanças significativas)
    const currentVersion = '1.0.1';
    
    // Verificar a versão armazenada no localStorage
    const storedVersion = localStorage.getItem('siteVersion');
    
    // Se não houver versão armazenada ou for diferente da atual
    if (!storedVersion || storedVersion !== currentVersion) {
        // Atualizar a versão armazenada
        localStorage.setItem('siteVersion', currentVersion);
        
        // Verificar se o usuário já viu esta página antes
        if (storedVersion) {
            // Mostrar notificação de atualização
            showUpdateNotification();
        }
    }
}

// Função para mostrar notificação de atualização
function showUpdateNotification() {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <p><strong>O site foi atualizado!</strong></p>
            <p>Pode ser necessário limpar o cache para ver todas as mudanças.</p>
            <div class="update-actions">
                <button id="clear-cache-btn" class="primary-btn">Limpar Cache</button>
                <button id="dismiss-btn" class="secondary-btn">Dispensar</button>
            </div>
        </div>
    `;
    
    // Adicionar estilos
    const style = document.createElement('style');
    style.textContent = `
        .update-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--white);
            border-left: 4px solid var(--accent-color);
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-radius: 6px;
            z-index: 1000;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .update-content p {
            margin: 0 0 10px;
            line-height: 1.5;
        }
        
        .update-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        
        .primary-btn, .secondary-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .primary-btn {
            background-color: var(--secondary-color);
            color: white;
        }
        
        .primary-btn:hover {
            background-color: var(--primary-color);
        }
        
        .secondary-btn {
            background-color: #f0f0f0;
            color: #333;
        }
        
        .secondary-btn:hover {
            background-color: #e0e0e0;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Adicionar eventos aos botões
    document.getElementById('clear-cache-btn').addEventListener('click', function() {
        clearSiteCache();
        notification.remove();
    });
    
    document.getElementById('dismiss-btn').addEventListener('click', function() {
        notification.remove();
    });
}

// Função para limpar o cache do site
function clearSiteCache() {
    // Limpar localStorage (exceto a versão do site)
    const siteVersion = localStorage.getItem('siteVersion');
    localStorage.clear();
    localStorage.setItem('siteVersion', siteVersion);
    
    // Limpar sessionStorage
    sessionStorage.clear();
    
    // Limpar cookies relacionados ao site
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    
    // Limpar o cache do Service Worker
    if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
            cacheNames.forEach(function(cacheName) {
                if (cacheName.startsWith('sergiolpta-site-')) {
                    caches.delete(cacheName).then(function() {
                        console.log('Cache ' + cacheName + ' deletado com sucesso');
                    });
                }
            });
        });
    }
    
    // Desregistrar o Service Worker atual
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister().then(() => {
                    console.log('Service Worker desregistrado');
                });
            }
            // Recarregar a página após um pequeno atraso para garantir que o Service Worker seja desregistrado
            setTimeout(() => {
                // Recarregar a página com parâmetro para forçar recarregamento completo
                window.location.href = window.location.href.split('?')[0] + '?cache=' + Date.now();
            }, 500);
        });
    } else {
        // Recarregar a página com parâmetro para forçar recarregamento completo
        window.location.href = window.location.href.split('?')[0] + '?cache=' + Date.now();
    }
}

// Adicionar botão de limpeza de cache no rodapé para administradores
function addCacheControlButton() {
    // Verificar se já existe o botão
    if (document.getElementById('admin-cache-control')) {
        return;
    }
    
    // Criar o botão de controle de cache
    const cacheButton = document.createElement('div');
    cacheButton.id = 'admin-cache-control';
    cacheButton.innerHTML = `
        <button id="admin-clear-cache" title="Limpar Cache (Apenas para administradores)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"></path>
            </svg>
        </button>
    `;
    
    // Adicionar estilos
    const style = document.createElement('style');
    style.textContent = `
        #admin-cache-control {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
        }
        
        #admin-clear-cache {
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        #admin-clear-cache:hover {
            background-color: var(--primary-color);
        }
        
        #admin-clear-cache svg {
            width: 20px;
            height: 20px;
        }
        
        /* Esconder em telas pequenas */
        @media (max-width: 768px) {
            #admin-cache-control {
                bottom: 10px;
                left: 10px;
            }
            
            #admin-clear-cache {
                width: 36px;
                height: 36px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(cacheButton);
    
    // Adicionar evento ao botão
    document.getElementById('admin-clear-cache').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Confirmar antes de limpar o cache
        if (confirm('Tem certeza que deseja limpar o cache do site? Isso forçará o recarregamento de todos os recursos.')) {
            clearSiteCache();
        }
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar atualizações
    checkForSiteUpdates();
    
    // Adicionar botão de controle de cache para administradores
    // Você pode adicionar uma verificação de administrador aqui se necessário
    addCacheControlButton();
    
    // Verificar se a página foi recarregada com parâmetro de cache
    if (window.location.search.includes('cache=')) {
        // Mostrar mensagem de confirmação
        const message = document.createElement('div');
        message.className = 'cache-cleared-message';
        message.innerHTML = `
            <div class="message-content">
                <p>Cache limpo com sucesso!</p>
            </div>
        `;
        
        // Adicionar estilos
        const style = document.createElement('style');
        style.textContent = `
            .cache-cleared-message {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--accent-color);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: fadeOut 3s forwards;
            }
            
            @keyframes fadeOut {
                0% { opacity: 1; }
                70% { opacity: 1; }
                100% { opacity: 0; visibility: hidden; }
            }
            
            .message-content p {
                margin: 0;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(message);
        
        // Remover a mensagem após 3 segundos
        setTimeout(function() {
            message.remove();
        }, 3000);
        
        // Limpar o parâmetro da URL sem recarregar a página
        const url = new URL(window.location.href);
        url.searchParams.delete('cache');
        window.history.replaceState({}, document.title, url);
    }
});
