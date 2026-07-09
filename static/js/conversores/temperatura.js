// Lista de IDs mapeados para facilitar o controle de limpeza
const listaCamposTemperatura = ['temp-c', 'temp-f', 'temp-k', 'temp-ra', 'temp-re'];

function converterTemperatura(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);

    // Se o campo for esvaziado, limpa todos os outros
    if (isNaN(valor)) {
        limparTodosCamposTemperatura();
        return;
    }

    // PASSO 1: Converter a unidade de origem estritamente para Celsius
    let celsius;
    switch (idOrigem) {
        case 'temp-c': celsius = valor; break;
        case 'temp-f': celsius = (valor - 32) * 5 / 9; break;
        case 'temp-k': celsius = valor - 273.15; break;
        case 'temp-ra': celsius = (valor - 491.67) * 5 / 9; break;
        case 'temp-re': celsius = valor * 5 / 4; break;
        default: return;
    }

    // PASSO 2: Converter de Celsius para todas as outras escalas dinamicamente
    listaCamposTemperatura.forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                let resultado;
                switch (idDestino) {
                    case 'temp-c': resultado = celsius; break;
                    case 'temp-f': resultado = (celsius * 9 / 5) + 32; break;
                    case 'temp-k': resultado = celsius + 273.15; break;
                    case 'temp-ra': resultado = (celsius + 273.15) * 9 / 5; break;
                    case 'temp-re': resultado = celsius * 4 / 5; break;
                }
                
                // Trata dízimas decimais longas
                inputDestino.value = Number(resultado.toFixed(4)).toString();
            }
        }
    });
}

function limparTodosCamposTemperatura() {
    listaCamposTemperatura.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function inicializarConversorTemperatura() {
    listaCamposTemperatura.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => converterTemperatura(id));
        }
    });
}

// Inicia os escutadores de input
inicializarConversorTemperatura();