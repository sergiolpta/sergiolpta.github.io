// Performance e Segurança
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading de imagens
    const lazyImages = document.querySelectorAll('.lazy-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Rate limiting para formulário
    const form = document.getElementById('contact-form');
    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN = 60000; // 1 minuto

    // Sanitização de inputs
    function sanitizeInput(str) {
        return str.replace(/[<>]/g, '').trim();
    }

    // Validação de formulário aprimorada
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const now = Date.now();
        if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
            alert('Por favor, aguarde um minuto antes de enviar outra mensagem.');
            return;
        }

        const formData = new FormData(form);
        const sanitizedData = {};

        for (let [key, value] of formData.entries()) {
            sanitizedData[key] = sanitizeInput(value);
        }

        // Adicionar token CSRF
        const csrfToken = Math.random().toString(36).substring(2);
        localStorage.setItem('csrfToken', csrfToken);

        // Enviar formulário
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(sanitizedData)
        })
        .then(response => {
            if (response.ok) {
                form.reset();
                alert('Mensagem enviada com sucesso!');
                lastSubmitTime = now;
            } else {
                throw new Error('Erro no envio');
            }
        })
        .catch(error => {
            alert('Erro ao enviar mensagem. Por favor, tente novamente.');
            console.error('Erro:', error);
        });
    });

    // Proteção contra XSS em elementos dinâmicos
    const sanitizeHTML = str => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    // Mascarar informações sensíveis
    const emailElements = document.querySelectorAll('.contact-info .email');
    emailElements.forEach(el => {
        const email = el.textContent;
        el.innerHTML = email.replace(/(.{3})(.*)(@.*)/, '$1***$3');
    });
}); 