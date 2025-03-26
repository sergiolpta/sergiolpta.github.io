/**
 * Sistema de gerenciamento de consentimento de cookies
 * Nexus Home Automação
 */

// Configurações dos cookies
const cookieConfig = {
    analytics: {
        name: 'analytics',
        default: false,
        description: 'Cookies que nos ajudam a entender como você interage com o site, permitindo melhorias contínuas.'
    },
    essential: {
        name: 'essential',
        default: true,
        description: 'Cookies necessários para o funcionamento básico do site. Não podem ser desativados.'
    },
    functional: {
        name: 'functional',
        default: false,
        description: 'Cookies que permitem funcionalidades avançadas, como vídeos incorporados e compartilhamento em redes sociais.'
    }
};

// Função para verificar se o usuário já deu consentimento
function hasConsent() {
    return localStorage.getItem('cookieConsent') !== null;
}

// Função para salvar as preferências de cookies
function savePreferences(preferences) {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Ativa ou desativa o Google Analytics com base nas preferências
    if (preferences.analytics) {
        enableGoogleAnalytics();
    } else {
        disableGoogleAnalytics();
    }
}

// Função para obter as preferências atuais
function getPreferences() {
    const saved = localStorage.getItem('cookieConsent');
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Valores padrão se não houver preferências salvas
    const defaults = {};
    Object.keys(cookieConfig).forEach(key => {
        defaults[key] = cookieConfig[key].default;
    });
    
    return defaults;
}

// Função para mostrar o banner de consentimento
function showCookieBanner() {
    if (hasConsent()) {
        // Se já tiver consentimento, apenas aplica as preferências
        const preferences = getPreferences();
        if (preferences.analytics) {
            enableGoogleAnalytics();
        }
        return;
    }
    
    // Cria o banner se ele ainda não existir
    if (!document.querySelector('.cookie-consent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.innerHTML = `
            <div class="cookie-text">
                <p>Utilizamos cookies para melhorar sua experiência em nosso site. Eles são essenciais para o funcionamento adequado e nos ajudam a entender como você interage com o site.</p>
                <p>Para mais informações, consulte nossa <a href="privacidade.html">Política de Privacidade</a>.</p>
            </div>
            <div class="cookie-buttons">
                <button class="cookie-btn accept">Aceitar todos</button>
                <button class="cookie-btn settings">Personalizar</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Adiciona a classe 'show' após um pequeno delay para permitir a animação
        setTimeout(() => {
            banner.classList.add('show');
        }, 300);
        
        // Adiciona os event listeners para os botões
        banner.querySelector('.cookie-btn.accept').addEventListener('click', () => {
            const allAccepted = {};
            Object.keys(cookieConfig).forEach(key => {
                allAccepted[key] = true;
            });
            savePreferences(allAccepted);
            hideCookieBanner();
        });
        
        banner.querySelector('.cookie-btn.settings').addEventListener('click', () => {
            showCookieSettings();
        });
    }
}

// Função para esconder o banner de consentimento
function hideCookieBanner() {
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 400); // Tempo suficiente para a animação de saída
    }
}

// Função para mostrar as configurações detalhadas de cookies
function showCookieSettings() {
    const currentPreferences = getPreferences();
    
    // Remove o banner atual
    hideCookieBanner();
    
    // Cria o modal de configurações
    const settingsModal = document.createElement('div');
    settingsModal.className = 'cookie-settings-modal';
    
    let cookieOptionsHTML = '';
    Object.keys(cookieConfig).forEach(key => {
        const cookie = cookieConfig[key];
        const isDisabled = key === 'essential' ? 'disabled' : '';
        const isChecked = currentPreferences[key] ? 'checked' : '';
        
        cookieOptionsHTML += `
            <div class="cookie-option">
                <div class="cookie-option-header">
                    <label class="cookie-switch">
                        <input type="checkbox" name="${cookie.name}" ${isChecked} ${isDisabled}>
                        <span class="cookie-slider"></span>
                    </label>
                    <h4>${cookie.name.charAt(0).toUpperCase() + cookie.name.slice(1)}</h4>
                </div>
                <p>${cookie.description}</p>
            </div>
        `;
    });
    
    settingsModal.innerHTML = `
        <div class="cookie-settings-content">
            <h3>Configurações de Cookies</h3>
            <p>Personalize suas preferências de cookies abaixo. Os cookies essenciais não podem ser desativados, pois são necessários para o funcionamento básico do site.</p>
            
            <div class="cookie-options">
                ${cookieOptionsHTML}
            </div>
            
            <div class="cookie-settings-buttons">
                <button class="cookie-btn save">Salvar preferências</button>
                <button class="cookie-btn accept-all">Aceitar todos</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(settingsModal);
    
    // Adiciona os event listeners para os botões
    settingsModal.querySelector('.cookie-btn.save').addEventListener('click', () => {
        const newPreferences = {};
        Object.keys(cookieConfig).forEach(key => {
            if (key === 'essential') {
                newPreferences[key] = true; // Essencial sempre ativo
            } else {
                const checkbox = settingsModal.querySelector(`input[name="${cookieConfig[key].name}"]`);
                newPreferences[key] = checkbox.checked;
            }
        });
        
        savePreferences(newPreferences);
        settingsModal.remove();
    });
    
    settingsModal.querySelector('.cookie-btn.accept-all').addEventListener('click', () => {
        const allAccepted = {};
        Object.keys(cookieConfig).forEach(key => {
            allAccepted[key] = true;
        });
        savePreferences(allAccepted);
        settingsModal.remove();
    });
}

// Função para ativar o Google Analytics
function enableGoogleAnalytics() {
    // Verifica se o Google Analytics já está carregado
    if (window.ga || window.gtag) return;
    
    // Código para carregar o Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', { 'anonymize_ip': true });
    
    // Carrega o script do Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    document.head.appendChild(script);
}

// Função para desativar o Google Analytics
function disableGoogleAnalytics() {
    // Remove os cookies do Google Analytics
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Desativa o rastreamento
    window['ga-disable-G-XXXXXXXXXX'] = true;
}

// Adiciona estilos CSS para o modal de configurações
function addSettingsStyles() {
    if (!document.getElementById('cookie-settings-styles')) {
        const style = document.createElement('style');
        style.id = 'cookie-settings-styles';
        style.textContent = `
            .cookie-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1rem;
            }
            
            .cookie-settings-content {
                background-color: white;
                border-radius: 8px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            
            .cookie-settings-content h3 {
                color: var(--primary-color);
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }
            
            .cookie-options {
                margin: 2rem 0;
            }
            
            .cookie-option {
                margin-bottom: 1.5rem;
                padding-bottom: 1.5rem;
                border-bottom: 1px solid #eee;
            }
            
            .cookie-option:last-child {
                border-bottom: none;
            }
            
            .cookie-option-header {
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .cookie-option-header h4 {
                margin: 0 0 0 1rem;
                font-size: 1.2rem;
                color: var(--text-color);
            }
            
            .cookie-option p {
                color: #666;
                font-size: 0.9rem;
                margin: 0;
            }
            
            .cookie-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .cookie-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .cookie-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
            }
            
            .cookie-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .cookie-slider {
                background-color: var(--accent-color);
            }
            
            input:disabled + .cookie-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            input:checked + .cookie-slider:before {
                transform: translateX(26px);
            }
            
            .cookie-settings-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .cookie-settings-buttons .cookie-btn {
                padding: 0.7rem 1.2rem;
            }
            
            .cookie-btn.save {
                background-color: var(--primary-color);
                color: white;
            }
            
            .cookie-btn.save:hover {
                background-color: var(--primary-hover);
            }
            
            .cookie-btn.accept-all {
                background-color: var(--accent-color);
                color: white;
            }
            
            .cookie-btn.accept-all:hover {
                background-color: var(--accent-hover);
            }
            
            @media (max-width: 768px) {
                .cookie-settings-content {
                    padding: 1.5rem;
                }
                
                .cookie-settings-buttons {
                    flex-direction: column;
                }
                
                .cookie-settings-buttons .cookie-btn {
                    width: 100%;
                    margin-bottom: 0.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializa o sistema de consentimento de cookies
document.addEventListener('DOMContentLoaded', () => {
    addSettingsStyles();
    showCookieBanner();
    
    // Aplica as preferências atuais
    const preferences = getPreferences();
    if (hasConsent() && preferences.analytics) {
        enableGoogleAnalytics();
    }
});

// Expõe funções para uso global
window.cookieConsent = {
    show: showCookieBanner,
    showSettings: showCookieSettings,
    getPreferences: getPreferences,
    hasConsent: hasConsent
};
