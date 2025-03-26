#!/bin/bash

# Script para adicionar ícones na barra de endereços a todas as páginas HTML do site
# Executa a partir da raiz do projeto

# Cores para saída
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Adicionando ícones para a barra de endereços a todas as páginas HTML...${NC}"

# Contador de arquivos atualizados
file_count=0

# Encontrar todos os arquivos HTML no diretório
for file in $(find . -name "*.html" -type f); do
    # Ignorar o arquivo do Google Verification
    if [[ "$file" == *"google"*".html" ]]; then
        echo -e "${YELLOW}Ignorando arquivo de verificação:${NC} $file"
        continue
    fi
    
    # Verificar se o arquivo já tem meta tags para ícones na barra de endereços
    if ! grep -q "msapplication-TileColor" "$file" && grep -q "</head>" "$file"; then
        # Criar o bloco de meta tags para ícones na barra de endereços
        icon_block='    <!-- Ícones para barra de endereços -->\n'
        icon_block+='    <meta name="msapplication-TileColor" content="#ffffff">\n'
        icon_block+='    <meta name="msapplication-TileImage" content="images/android-chrome-192x192.png">\n'
        icon_block+='    <meta name="msapplication-config" content="browserconfig.xml">\n'
        
        # Adicionar o bloco antes do fechamento da tag head
        sed -i "s|</head>|$icon_block</head>|" "$file"
        echo -e "${GREEN}Ícones para barra de endereços adicionados em:${NC} $file"
        ((file_count++))
    else
        echo -e "${YELLOW}Ícones para barra de endereços já existem ou tag </head> não encontrada em:${NC} $file"
    fi
done

# Criar o arquivo browserconfig.xml se não existir
if [ ! -f "browserconfig.xml" ]; then
    echo -e "${YELLOW}Criando arquivo browserconfig.xml...${NC}"
    cat > browserconfig.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="images/android-chrome-192x192.png"/>
            <square150x150logo src="images/android-chrome-192x192.png"/>
            <square310x310logo src="images/android-chrome-512x512.png"/>
            <TileColor>#ffffff</TileColor>
        </tile>
    </msapplication>
</browserconfig>
EOF
    echo -e "${GREEN}Arquivo browserconfig.xml criado com sucesso!${NC}"
fi

echo -e "${GREEN}Atualização concluída! $file_count arquivos foram atualizados.${NC}"
