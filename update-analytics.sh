#!/bin/bash

# Script para atualizar o código do Google Analytics em todas as páginas HTML
# Executa a partir da raiz do projeto

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Atualizando o código do Google Analytics em todas as páginas HTML...${NC}"

# Contador de arquivos atualizados
count=0

# ID correto do Google Analytics
ANALYTICS_ID="G-8PSLG3GQJW"

# Encontrar todos os arquivos HTML no diretório
for file in $(find . -name "*.html" -type f); do
    # Verificar se o arquivo contém o código do Google Analytics com ID incorreto
    if grep -q "googletagmanager.com/gtag/js?id=G-" "$file" && ! grep -q "googletagmanager.com/gtag/js?id=$ANALYTICS_ID" "$file"; then
        # Substituir o ID incorreto pelo correto
        sed -i "s|googletagmanager.com/gtag/js?id=G-[A-Z0-9]*|googletagmanager.com/gtag/js?id=$ANALYTICS_ID|g" "$file"
        echo -e "${GREEN}ID do Analytics atualizado em:${NC} $file"
        ((count++))
    fi
    
    # Verificar se o arquivo contém o código de inicialização do Google Analytics com ID incorreto
    if grep -q "gtag('config', 'G-" "$file" && ! grep -q "gtag('config', '$ANALYTICS_ID'" "$file"; then
        # Substituir o ID incorreto pelo correto
        sed -i "s|gtag('config', 'G-[A-Z0-9]*')|gtag('config', '$ANALYTICS_ID')|g" "$file"
        echo -e "${GREEN}Config do Analytics atualizado em:${NC} $file"
        ((count++))
    fi
    
    # Verificar se o arquivo não contém o código do Google Analytics
    if ! grep -q "googletagmanager.com/gtag/js" "$file" && ! grep -q "google7c9281bd88b2c5d4.html" <<< "$file"; then
        # Verificar se há tag head no arquivo
        if grep -q "</head>" "$file"; then
            # Adicionar o código do Google Analytics antes do fechamento da tag head
            ANALYTICS_CODE="    <!-- Google Analytics -->\n    <script async src=\"https://www.googletagmanager.com/gtag/js?id=$ANALYTICS_ID\"></script>\n    <script>\n        window.dataLayer = window.dataLayer || [];\n        function gtag(){dataLayer.push(arguments);}\n        gtag('js', new Date());\n        gtag('config', '$ANALYTICS_ID');\n    </script>"
            sed -i "s|</head>|$ANALYTICS_CODE\n</head>|" "$file"
            echo -e "${GREEN}Código do Analytics adicionado em:${NC} $file"
            ((count++))
        else
            echo -e "${RED}Erro:${NC} Tag </head> não encontrada em $file"
        fi
    fi
done

echo -e "${GREEN}Atualização concluída! $count arquivos foram atualizados.${NC}"
