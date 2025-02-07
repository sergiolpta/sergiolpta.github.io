const FAQ = () => {
  const faqItems = [
    {
      question: "O que é o ChatGPT?",
      answer: "ChatGPT é um modelo de linguagem desenvolvido pela OpenAI que utiliza inteligência artificial para manter conversas naturais e responder perguntas em diversos tópicos."
    },
    {
      question: "Como posso começar a usar?",
      answer: "Basta digitar sua pergunta ou comando na caixa de texto e pressionar Enter. O ChatGPT irá processar sua mensagem e responder de forma apropriada."
    },
    {
      question: "É gratuito?",
      answer: "Oferecemos uma versão gratuita com recursos básicos e uma versão premium com funcionalidades adicionais e prioridade no acesso."
    },
    {
      question: "Posso usar para fins comerciais?",
      answer: "Sim, você pode usar o ChatGPT para fins comerciais. Consulte nossos termos de uso para mais detalhes sobre as condições específicas."
    }
  ]

  return (
    `<section class="faq-section">
      <h2 class="faq-title">Perguntas Frequentes</h2>
      <div class="faq-list">
        ${faqItems.map((item, index) => `
          <details class="faq-item">
            <summary class="faq-question">${item.question}</summary>
            <p class="faq-answer">${item.answer}</p>
          </details>
        `).join('')}
      </div>
    </section>`
  )
}

export default FAQ 