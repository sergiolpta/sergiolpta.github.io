#!/bin/bash

# Script para adicionar o controle de cache a todas as páginas HTML
# Executa a partir da raiz do projeto

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Iniciando atualização de controle de cache para todas as páginas HTML...${NC}"

# Contador de arquivos atualizados
count=0

# Encontrar todos os arquivos HTML no diretório
for file in $(find . -name "*.html" -type f); do
    # Verificar se o arquivo já contém o script de controle de cache
    if ! grep -q "cache-control.js" "$file"; then
        # Verificar se há tag de fechamento do body
        if grep -q "</body>" "$file"; then
            # Adicionar o script antes do fechamento do body
            sed -i 's|</body>|    <!-- Script de controle de cache -->\n    <script src="js/cache-control.js"></script>\n</body>|' "$file"
            echo -e "${GREEN}Atualizado:${NC} $file"
            ((count++))
        else
            echo -e "${RED}Erro:${NC} Tag </body> não encontrada em $file"
        fi
    else
        echo -e "${YELLOW}Já atualizado:${NC} $file"
    fi
done

echo -e "${GREEN}Atualização concluída! $count arquivos foram atualizados.${NC}"

# Verificar se o diretório js existe
if [ ! -d "js" ]; then
    echo -e "${YELLOW}Criando diretório js...${NC}"
    mkdir -p js
fi

# Verificar se o arquivo cache-control.js existe
if [ ! -f "js/cache-control.js" ]; then
    echo -e "${RED}Aviso:${NC} O arquivo js/cache-control.js não foi encontrado."
    echo -e "Certifique-se de criar este arquivo antes de atualizar o site."
fi

echo -e "${YELLOW}Não se esqueça de atualizar a versão do site no arquivo js/cache-control.js quando fizer alterações significativas.${NC}"
echo -e "A versão atual está definida na variável 'currentVersion' no início do arquivo."
