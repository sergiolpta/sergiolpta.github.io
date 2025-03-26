#!/bin/bash

# Script para atualizar a referência do Font Awesome em todas as páginas HTML
# Executa a partir da raiz do projeto

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Atualizando referências do Font Awesome em todas as páginas HTML...${NC}"

# Contador de arquivos atualizados
count=0

# Nova URL do Font Awesome (versão estável mais recente)
NEW_URL="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"

# Encontrar todos os arquivos HTML no diretório
for file in $(find . -name "*.html" -type f); do
    # Atualizar referências da versão 6.0.0-beta3
    if grep -q "font-awesome/6.0.0-beta3/css/all.min.css" "$file"; then
        sed -i "s|https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css|$NEW_URL|g" "$file"
        echo -e "${GREEN}Atualizado (beta3 -> 6.4.2):${NC} $file"
        ((count++))
    # Atualizar referências da versão 6.0.0
    elif grep -q "font-awesome/6.0.0/css/all.min.css" "$file"; then
        sed -i "s|https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css|$NEW_URL|g" "$file"
        echo -e "${GREEN}Atualizado (6.0.0 -> 6.4.2):${NC} $file"
        ((count++))
    else
        echo -e "${YELLOW}Sem referência ao Font Awesome:${NC} $file"
    fi
done

echo -e "${GREEN}Atualização concluída! $count arquivos foram atualizados.${NC}"
