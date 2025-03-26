#!/bin/bash

# Script para atualizar todas as imagens do site para usar lazy loading
# Executa a partir da raiz do projeto

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Atualizando atributos de imagens em todas as páginas HTML...${NC}"

# Contador de arquivos e imagens atualizadas
file_count=0
image_count=0

# Verificar se o diretório js existe
if [ ! -d "js" ]; then
    echo -e "${YELLOW}Criando diretório js...${NC}"
    mkdir -p js
fi

# Verificar se o script de otimização de imagens existe
if [ ! -f "js/image-optimizer.js" ]; then
    echo -e "${RED}Erro:${NC} O arquivo js/image-optimizer.js não foi encontrado."
    echo -e "Certifique-se de criar este arquivo antes de executar este script."
    exit 1
fi

# Encontrar todos os arquivos HTML no diretório
for file in $(find . -name "*.html" -type f); do
    # Verificar se o arquivo já inclui o script de otimização de imagens
    if ! grep -q "image-optimizer.js" "$file"; then
        # Adicionar o script antes do fechamento do body
        if grep -q "</body>" "$file"; then
            sed -i 's|</body>|    <!-- Script de otimização de imagens -->\n    <script src="js/image-optimizer.js"></script>\n</body>|' "$file"
            echo -e "${GREEN}Script adicionado em:${NC} $file"
            ((file_count++))
        else
            echo -e "${RED}Erro:${NC} Tag </body> não encontrada em $file"
        fi
    else
        echo -e "${YELLOW}Script já existe em:${NC} $file"
    fi
    
    # Atualizar todas as imagens sem atributos de loading
    img_updates=$(grep -c "<img " "$file")
    if [ $img_updates -gt 0 ]; then
        # Adicionar atributo loading="lazy" para todas as imagens, exceto logos
        sed -i 's/<img \([^>]*\)src="images\/logo[^"]*"/<img \1src="images\/logo[^"]*" loading="eager" fetchpriority="high"/g' "$file"
        sed -i 's/<img \([^>]*\)src="[^"]*"/<img \1src="[^"]*" loading="lazy"/g' "$file"
        
        # Evitar duplicação de atributos
        sed -i 's/loading="lazy" loading="eager"/loading="eager"/g' "$file"
        
        echo -e "${GREEN}Imagens atualizadas em:${NC} $file"
        ((image_count++))
    fi
done

echo -e "${GREEN}Atualização concluída! $file_count arquivos e $image_count páginas com imagens foram atualizados.${NC}"
echo -e "${YELLOW}Não se esqueça de verificar se todas as imagens têm os atributos width e height definidos para evitar layout shifts.${NC}"
