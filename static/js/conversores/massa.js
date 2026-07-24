// Objeto com os fatores de conversão tendo o "Quilograma (kg)" como unidade base (1 kg)
window.FATORES_KG = window.FATORES_KG || {
    t: 1000,
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125,
    arroba: 14.6896,
    quilate: 0.0002
};
var FATORES_KG = window.FATORES_KG;

// Mapeamento dos IDs dos inputs para as chaves dos fatores
window.camposMassa = window.camposMassa || {
    'massa-t': 't',
    'massa-kg': 'kg',
    'massa-g': 'g',
    'massa-mg': 'mg',
    'massa-lb': 'lb',
    'massa-oz': 'oz',
    'massa-arroba': 'arroba',
    'massa-quilate': 'quilate'
};
var camposMassa = window.camposMassa;

function converterMassa(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const unidadeOrigem = camposMassa[idOrigem];

    // Se o campo for limpo/apagado, limpa todos os demais campos
    if (isNaN(valor)) {
        limparTodosCamposMassa();
        return;
    }

    // Passa o valor digitado para a base intermediária (Quilogramas)
    const valorEmKg = valor * FATORES_KG[unidadeOrigem];

    // Atualiza o restante das caixas de texto com o valor correspondente
    Object.keys(camposMassa).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const unidadeDestino = camposMassa[idDestino];
                const valorConvertido = valorEmKg / FATORES_KG[unidadeDestino];
                
                inputDestino.value = formatarResultadoMassa(valorConvertido);
            }
        }
    });
}

function formatarResultadoMassa(num) {
    if (num === 0) return 0;
    // Evita problemas de arredondamento de float limitando a 6 casas decimais significativas
    return Number(num.toFixed(6)).toString();
}

function limparTodosCamposMassa() {
    Object.keys(camposMassa).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

// Vincula o evento 'input' em tempo real a todos os campos mapeados
function inicializarConversorMassa() {
    Object.keys(camposMassa).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputMassa) {
                input.removeEventListener('input', input._handleInputMassa);
            }
            input._handleInputMassa = () => converterMassa(id);
            input.addEventListener('input', input._handleInputMassa);
        }
    });
}

// Inicia os listeners
inicializarConversorMassa();