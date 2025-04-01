#!/bin/bash

# Script para atualizar automaticamente as versões de arquivos CSS e imagens
# Isso força os navegadores a carregarem a versão mais recente dos arquivos

# Definir variáveis
CURRENT_DATE=$(date +%Y%m%d)
CSS_VERSION="1.7"  # Incrementar manualmente a cada atualização significativa

# Atualizar versão do CSS em index.html
sed -i "s/styles4.8.css?v=[0-9.]\+/styles4.8.css?v=$CSS_VERSION/g" index.html

# Atualizar versão das imagens principais
find . -name "*.html" -type f -exec sed -i "s/\(logo\.jpg\|hero\.jpg\|banner\.jpg\)\?v=[0-9]\+/\1?v=$CURRENT_DATE/g" {} \;

# Atualizar versão das imagens de parceiros
find . -name "*.html" -type f -exec sed -i "s/\(parceiros\/[^\"]*\.jpg\)\?v=[0-9]\+/\1?v=$CURRENT_DATE/g" {} \;

echo "Versões de cache atualizadas:"
echo "- CSS: v$CSS_VERSION"
echo "- Imagens: v$CURRENT_DATE"
echo "Lembre-se de fazer commit e push das alterações para o GitHub."
