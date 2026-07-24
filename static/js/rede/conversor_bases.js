// Mapeamento dos campos, suas respectivas bases matemáticas e filtros de validação
window.configuracaoBases = window.configuracaoBases || {
    'base-decimal': { base: 10, regex: /[^0-9]/g },
    'base-binario': { base: 2, regex: /[^01]/g },
    'base-octal': { base: 8, regex: /[^0-7]/g },
    'base-hexadecimal': { base: 16, regex: /[^0-9a-fA-F]/g }
};

var configuracaoBases = window.configuracaoBases;

function converterBasesNumericas(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const configOrigem = configuracaoBases[idOrigem];
    
    // Filtra a entrada do usuário removendo caracteres inválidos para aquela base em tempo real
    let valorTexto = inputOrigem.value.replace(configOrigem.regex, '');
    
    // Atualiza o valor do próprio input com o texto filtrado
    inputOrigem.value = valorTexto;

    // Se o campo estiver vazio, limpa todos os outros campos simultaneamente
    if (valorTexto === '') {
        limparTodosCamposBases();
        return;
    }

    try {
        // Converte a string da base de origem para um número inteiro decimal (Base 10)
        let numeroDecimal = parseInt(valorTexto, configOrigem.base);

        if (isNaN(numeroDecimal)) {
            limparTodosCamposBases();
            return;
        }

        // Distribui o valor convertido para todos os outros campos de destino
        Object.keys(configuracaoBases).forEach(idDestino => {
            if (idDestino !== idOrigem) {
                const inputDestino = document.getElementById(idDestino);
                if (inputDestino) {
                    const baseDestino = configuracaoBases[idDestino].base;
                    
                    // Realiza a conversão do inteiro para a base correspondente em string
                    let resultado = numeroDecimal.toString(baseDestino);
                    
                    // Se for hexadecimal, padroniza com letras maiúsculas para ficar mais legível
                    if (baseDestino === 16) {
                        resultado = resultado.toUpperCase();
                    }
                    
                    inputDestino.value = resultado;
                }
            }
        });
    } catch (e) {
        console.error("Erro na conversão de bases: ", e);
    }
}

function limparTodosCamposBases() {
    Object.keys(configuracaoBases).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function inicializarConversorBases() {
    Object.keys(configuracaoBases).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputBases) {
                input.removeEventListener('input', input._handleInputBases);
            }
            input._handleInputBases = () => converterBasesNumericas(id);
            input.addEventListener('input', input._handleInputBases);
        }
    });
}

// Inicializa a escuta dos elementos
inicializarConversorBases();


