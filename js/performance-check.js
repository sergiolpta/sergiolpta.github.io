/**
 * Script para verificar o desempenho do site
 * Este script coleta métricas de desempenho usando a API Performance do navegador
 */

document.addEventListener('DOMContentLoaded', function() {
    // Criar um contêiner para mostrar os resultados
    const resultContainer = document.createElement('div');
    resultContainer.id = 'performance-results';
    resultContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 5px;
        font-family: monospace;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    `;
    document.body.appendChild(resultContainer);

    // Botão para fechar os resultados
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-weight: bold;
    `;
    closeButton.addEventListener('click', function() {
        resultContainer.style.display = 'none';
    });
    resultContainer.appendChild(closeButton);

    // Título
    const title = document.createElement('h3');
    title.textContent = 'Métricas de Desempenho';
    title.style.margin = '0 0 10px 0';
    resultContainer.appendChild(title);

    // Coletar e mostrar métricas quando a página estiver totalmente carregada
    window.addEventListener('load', function() {
        setTimeout(collectPerformanceMetrics, 1000);
    });

    function collectPerformanceMetrics() {
        // Obter métricas de tempo
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domComplete - perfData.domLoading;
        const networkLatency = perfData.responseEnd - perfData.requestStart;
        const redirectTime = perfData.redirectEnd - perfData.redirectStart;
        const domInteractive = perfData.domInteractive - perfData.navigationStart;
        
        // Obter recursos carregados
        const resources = window.performance.getEntriesByType('resource');
        
        // Contar recursos por tipo
        const resourceCounts = {
            total: resources.length,
            image: 0,
            css: 0,
            javascript: 0,
            font: 0,
            other: 0
        };
        
        // Calcular tamanho total dos recursos
        let totalSize = 0;
        
        resources.forEach(resource => {
            // Adicionar ao tamanho total (transferSize é o tamanho comprimido transferido pela rede)
            if (resource.transferSize) {
                totalSize += resource.transferSize;
            }
            
            // Contar por tipo
            if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
                resourceCounts.image++;
            } else if (resource.name.match(/\.css(\?.*)?$/i)) {
                resourceCounts.css++;
            } else if (resource.name.match(/\.js(\?.*)?$/i)) {
                resourceCounts.javascript++;
            } else if (resource.name.match(/\.(woff|woff2|ttf|otf|eot)(\?.*)?$/i)) {
                resourceCounts.font++;
            } else {
                resourceCounts.other++;
            }
        });
        
        // Converter bytes para formato legível
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        
        // Criar o relatório
        const report = document.createElement('div');
        report.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>Tempo de Carregamento:</strong> ${(pageLoadTime / 1000).toFixed(2)}s
            </div>
            <div style="margin-bottom: 10px;">
                <strong>DOM Pronto:</strong> ${(domReadyTime / 1000).toFixed(2)}s
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Latência de Rede:</strong> ${(networkLatency / 1000).toFixed(2)}s
            </div>
            <div style="margin-bottom: 10px;">
                <strong>DOM Interativo:</strong> ${(domInteractive / 1000).toFixed(2)}s
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Tamanho Total:</strong> ${formatBytes(totalSize)}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Recursos (${resourceCounts.total}):</strong>
                <ul style="margin: 5px 0 0 20px; padding: 0;">
                    <li>Imagens: ${resourceCounts.image}</li>
                    <li>CSS: ${resourceCounts.css}</li>
                    <li>JavaScript: ${resourceCounts.javascript}</li>
                    <li>Fontes: ${resourceCounts.font}</li>
                    <li>Outros: ${resourceCounts.other}</li>
                </ul>
            </div>
            <div style="margin-top: 15px; font-size: 12px;">
                <em>Otimizações implementadas:</em>
                <ul style="margin: 5px 0 0 20px; padding: 0;">
                    <li>Lazy loading de imagens</li>
                    <li>Minificação de CSS/JS</li>
                    <li>Correções de layout</li>
                </ul>
            </div>
        `;
        
        resultContainer.appendChild(report);
    }
});
