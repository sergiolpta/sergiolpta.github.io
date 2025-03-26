/**
 * Script de minificação para CSS e JavaScript
 * Este script fornece funções para minificar CSS e JavaScript diretamente no navegador
 */

// Função para minificar CSS
function minifyCSS(css) {
    if (!css) return '';
    
    // Remove comentários
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove espaços em branco
    css = css.replace(/\s+/g, ' ');
    
    // Remove espaços antes e depois de chaves, dois pontos, ponto e vírgula
    css = css.replace(/\s*{\s*/g, '{');
    css = css.replace(/\s*}\s*/g, '}');
    css = css.replace(/\s*:\s*/g, ':');
    css = css.replace(/\s*;\s*/g, ';');
    css = css.replace(/\s*,\s*/g, ',');
    
    // Remove ponto e vírgula antes de fechar chaves
    css = css.replace(/;\}/g, '}');
    
    return css.trim();
}

// Função para minificar JavaScript
function minifyJS(js) {
    if (!js) return '';
    
    // Remove comentários de linha única
    js = js.replace(/\/\/.*$/gm, '');
    
    // Remove comentários de múltiplas linhas
    js = js.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove espaços em branco no início e fim de cada linha
    js = js.replace(/^\s+|\s+$/gm, '');
    
    // Reduz múltiplos espaços para um único espaço
    js = js.replace(/\s+/g, ' ');
    
    // Remove espaços antes e depois de operadores
    js = js.replace(/\s*([=\+\-\*\/\(\)\{\}\[\]:;,<>])\s*/g, '$1');
    
    // Restaura espaço após palavras-chave
    js = js.replace(/(var|let|const|function|if|else|for|while|return|switch|case|break|continue|try|catch|finally)\(/g, '$1 (');
    
    return js.trim();
}

// Função para carregar um arquivo via AJAX
function loadFile(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText);
        }
    };
    xhr.send();
}

// Função para criar versões minificadas dos arquivos
function createMinifiedFiles() {
    // Lista de arquivos CSS para minificar
    const cssFiles = [
        '/styles4.8.css',
        '/styles-servicos.css'
    ];
    
    // Lista de arquivos JS para minificar
    const jsFiles = [
        '/script.js',
        '/js/cookies.js',
        '/main.js',
        '/utils.js'
    ];
    
    // Minificar arquivos CSS
    cssFiles.forEach(file => {
        loadFile(file, function(content) {
            const minified = minifyCSS(content);
            
            // Criar link para download
            createDownloadLink(
                file.split('/').pop().replace('.css', '.min.css'),
                minified,
                'text/css'
            );
        });
    });
    
    // Minificar arquivos JS
    jsFiles.forEach(file => {
        loadFile(file, function(content) {
            const minified = minifyJS(content);
            
            // Criar link para download
            createDownloadLink(
                file.split('/').pop().replace('.js', '.min.js'),
                minified,
                'application/javascript'
            );
        });
    });
}

// Função para criar link de download
function createDownloadLink(filename, content, type) {
    const container = document.getElementById('download-links');
    if (!container) return;
    
    const link = document.createElement('a');
    const blob = new Blob([content], { type: type });
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.textContent = `Download ${filename}`;
    link.className = 'download-link';
    
    const listItem = document.createElement('li');
    listItem.appendChild(link);
    container.appendChild(listItem);
}

// Iniciar o processo quando a página carregar
window.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de minificação
    if (document.getElementById('minify-tool')) {
        createMinifiedFiles();
    }
});
