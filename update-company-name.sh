#!/bin/bash

# Script para adicionar o nome da empresa com o símbolo entre as palavras nas páginas de serviços
# Criado em: $(date)

echo "Atualizando o nome da empresa nas páginas de serviços..."

# Lista de páginas de serviços
SERVICE_PAGES=(
  "automacao-residencial.html"
  "automacao-comercial.html"
  "home-theater.html"
  "sonorizacao.html"
  "luminotecnica.html"
)

# Adicionar o nome da empresa com o símbolo em cada página
for file in "${SERVICE_PAGES[@]}"; do
  echo "Processando: $file"
  
  # Substituir a div do logo para incluir o nome da empresa com o símbolo
  sed -i 's|<div class="logo">\n            <a href="index.html">\n                <img src="images/logo.jpg?v=20250326" loading="eager" fetchpriority="high" alt="Nexus Home LP Logo" width="90" height="90" style="display: block; max-width: 100%;">\n            </a>\n        </div>|<div class="logo">\n            <a href="index.html">\n                <img src="images/logo.jpg?v=20250326" loading="eager" fetchpriority="high" alt="Nexus Home LP Logo" width="90" height="90" style="display: block; max-width: 100%;">\n            </a>\n            <span class="company-name">Nexus&#8202;<i class="fas fa-wifi"></i>&#8202;Home LP</span>\n        </div>|g' "$file"
  
  # Verificar se a substituição foi bem-sucedida
  if grep -q "fa-wifi" "$file"; then
    echo "✓ Nome da empresa atualizado em $file"
  else
    echo "⚠️ Falha ao atualizar o nome da empresa em $file"
  fi
done

echo "Processo concluído!"
