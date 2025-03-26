#!/bin/bash

# Script para adicionar favicons a todas as páginas HTML do site
# Executa a partir da raiz do projeto

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Adicionando favicons a todas as páginas HTML...${NC}"

# Contador de arquivos atualizados
file_count=0

# Encontrar todos os arquivos HTML no diretório
for file in $(find . -name "*.html" -type f); do
    # Ignorar o arquivo do Google Verification
    if [[ "$file" == *"google"*".html" ]]; then
        echo -e "${YELLOW}Ignorando arquivo de verificação:${NC} $file"
        continue
    fi
    
    # Verificar se o arquivo já tem favicon
    if ! grep -q "favicon" "$file"; then
        # Adicionar os links de favicon dentro da tag head
        if grep -q "</head>" "$file"; then
            # Criar o bloco de favicons
            favicon_block='    <!-- Favicons -->\n'
            favicon_block+='    <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png">\n'
            favicon_block+='    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png">\n'
            favicon_block+='    <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png">\n'
            favicon_block+='    <link rel="manifest" href="site.webmanifest">\n'
            favicon_block+='    <link rel="shortcut icon" href="images/favicon.ico">\n'
            favicon_block+='    <meta name="theme-color" content="#ffffff">\n'
            
            # Adicionar o bloco antes do fechamento da tag head
            sed -i "s|</head>|$favicon_block</head>|" "$file"
            echo -e "${GREEN}Favicons adicionados em:${NC} $file"
            ((file_count++))
        else
            echo -e "${RED}Erro:${NC} Tag </head> não encontrada em $file"
        fi
    else
        echo -e "${YELLOW}Favicon já existe em:${NC} $file"
    fi
done

# Criar o arquivo site.webmanifest se não existir
if [ ! -f "site.webmanifest" ]; then
    echo -e "${YELLOW}Criando arquivo site.webmanifest...${NC}"
    cat > site.webmanifest << EOF
{
    "name": "Sergio LPTA",
    "short_name": "SLPTA",
    "icons": [
        {
            "src": "images/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "images/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}
EOF
    echo -e "${GREEN}Arquivo site.webmanifest criado com sucesso!${NC}"
fi

echo -e "${GREEN}Atualização concluída! $file_count arquivos foram atualizados.${NC}"
