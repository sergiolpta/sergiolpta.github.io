/**
 * Script de validação do formulário e máscaras de input
 * Nexus Home LP
 */

// Função para validar o formulário antes do envio
function validateForm() {
    const nome = document.querySelector('input[name="nome"]');
    const email = document.querySelector('input[name="email"]');
    const telefone = document.querySelector('input[name="telefone"]');
    const mensagem = document.querySelector('textarea[name="mensagem"]');
    
    // Validação do nome (pelo menos 3 caracteres, apenas letras e espaços)
    if (!nome.value.match(/^[A-Za-zÀ-ÿ\s]{3,}$/)) {
        alert('Por favor, insira um nome válido (mínimo de 3 caracteres).');
        nome.focus();
        return false;
    }
    
    // Validação do email
    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Por favor, insira um endereço de e-mail válido.');
        email.focus();
        return false;
    }
    
    // Validação do telefone (formato brasileiro)
    if (!telefone.value.match(/^\([0-9]{2}\)\s?[0-9]{4,5}-[0-9]{4}$/)) {
        alert('Por favor, insira um telefone no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.');
        telefone.focus();
        return false;
    }
    
    // Validação da mensagem (mínimo de 10 caracteres)
    if (mensagem.value.length < 10) {
        alert('Por favor, insira uma mensagem com pelo menos 10 caracteres.');
        mensagem.focus();
        return false;
    }
    
    return true;
}

// Aplicar máscara ao campo de telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.querySelector('input[name="telefone"]');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Remove todos os caracteres não numéricos
            value = value.replace(/\D/g, '');
            
            // Aplica a máscara de acordo com o número de dígitos
            if (value.length <= 10) {
                // Formato (XX) XXXX-XXXX para telefones fixos
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else {
                // Formato (XX) XXXXX-XXXX para celulares
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            }
            
            // Atualiza o valor do campo
            e.target.value = value;
        });
        
        // Também aplica a máscara quando o campo perde o foco
        telefoneInput.addEventListener('blur', function(e) {
            let value = e.target.value;
            
            // Se o valor não estiver vazio e não corresponder ao formato esperado
            if (value && !value.match(/^\([0-9]{2}\)\s?[0-9]{4,5}-[0-9]{4}$/)) {
                // Remove todos os caracteres não numéricos
                value = value.replace(/\D/g, '');
                
                // Aplica a máscara de acordo com o número de dígitos
                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                }
                
                // Atualiza o valor do campo
                e.target.value = value;
            }
        });
    }
});
