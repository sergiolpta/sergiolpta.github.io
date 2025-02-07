function FAQ() {
  const faqItems = [
    {
      question: "O que é automação residencial?",
      answer: "Automação residencial é um conjunto de tecnologias que permite controlar diversos aspectos da sua casa como iluminação, climatização, segurança e entretenimento de forma integrada e inteligente."
    },
    {
      question: "O que é Zigbee e por que é importante na automação?",
      answer: "Zigbee é um protocolo de comunicação sem fio, específico para automação, que oferece alta confiabilidade, baixo consumo de energia e excelente alcance. É ideal para automação residencial pois permite conectar centenas de dispositivos sem interferência, formando uma rede mesh onde cada dispositivo funciona como repetidor de sinal."
    },
    {
      question: "Como funciona a sonorização de ambientes?",
      answer: "A sonorização de ambientes permite distribuir música em diferentes cômodos da casa, com controle individual de volume e seleção de conteúdo. Utilizamos equipamentos profissionais e um projeto acústico personalizado para garantir a melhor qualidade sonora em cada ambiente, com a possibilidade de integração com serviços de streaming e controle via smartphone."
    },
    {
      question: "Por que preciso de uma rede doméstica robusta?",
      answer: "Uma rede doméstica bem estruturada é a base de qualquer projeto de automação. Instalamos equipamentos profissionais, com roteadores e switches gerenciáveis, separação de redes (IoT, visitantes, principal) e cobertura Wi-Fi otimizada para garantir a estabilidade e segurança de todos os dispositivos conectados."
    },
    {
      question: "Quais são os benefícios da automação?",
      answer: "Os principais benefícios incluem maior conforto, economia de energia, segurança aprimorada, praticidade no dia a dia e valorização do imóvel."
    },
    {
      question: "Como funciona a integração entre os diferentes sistemas?",
      answer: "Utilizamos centrais de automação inteligentes que permitem integrar diferentes protocolos e sistemas (Zigbee, Wi-Fi, IR) em uma única interface. Assim, você pode controlar iluminação, som, climatização, cortinas e segurança de forma centralizada através de um aplicativo ou painéis de controle."
    },
    {
      question: "É possível automatizar uma casa já construída?",
      answer: "Sim! Oferecemos soluções que podem ser implementadas em casas já construídas, com interferência mínima na estrutura existente. Utilizamos tecnologias sem fio e adaptadores inteligentes que não requerem grandes obras."
    },
    {
      question: "Qual o investimento necessário?",
      answer: "O investimento varia de acordo com o projeto e suas necessidades. Trabalhamos com diferentes opções e desenvolvemos soluções personalizadas para cada cliente, podendo fazer a implementação em fases para melhor adequação ao orçamento."
    }
  ];

  return `<section id="faq" class="faq-section">
    <h2 class="faq-title">Perguntas Frequentes</h2>
    <div class="faq-list">
      ${faqItems.map((item, index) => `
        <details class="faq-item">
          <summary class="faq-question">${item.question}</summary>
          <p class="faq-answer">${item.answer}</p>
        </details>
      `).join('')}
    </div>
  </section>`;
} 