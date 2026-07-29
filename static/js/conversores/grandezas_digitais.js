// Fatores de conversão exatos baseados em Bytes (1 Byte = 8 bits)
window.FATORES_DIGITAL = window.FATORES_DIGITAL || {
    bit: 1 / 8,
    byte: 1,
    kb: 1024,
    mb: 1024 ** 2,
    gb: 1024 ** 3,
    tb: 1024 ** 4,
    pb: 1024 ** 5,
    eb: 1024 ** 6
};
var FATORES_DIGITAL = window.FATORES_DIGITAL;

window.camposDigital = window.camposDigital || {
    'dig-bit': 'bit',
    'dig-byte': 'byte',
    'dig-kb': 'kb',
    'dig-mb': 'mb',
    'dig-gb': 'gb',
    'dig-tb': 'tb',
    'dig-pb': 'pb',
    'dig-eb': 'eb'
};
var camposDigital = window.camposDigital;

function converterDigital(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const unidadeOrigem = camposDigital[idOrigem];

    if (isNaN(valor)) {
        limparTodosCamposDigital();
        return;
    }

    const valorEmBytes = valor * FATORES_DIGITAL[unidadeOrigem];

    Object.keys(camposDigital).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const unidadeDestino = camposDigital[idDestino];
                const valorConvertido = valorEmBytes / FATORES_DIGITAL[unidadeDestino];
                
                inputDestino.value = formatarResultadoDigital(valorConvertido);
            }
        }
    });
}

function formatarResultadoDigital(num) {
    if (num === 0) return 0;
    
    if (num < 0.00001 || num >= 1e12) {
        return num.toExponential(4);
    }
    
    return Number(num.toFixed(6)).toString();
}

function limparTodosCamposDigital() {
    Object.keys(camposDigital).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function inicializarConversorDigital() {
    Object.keys(camposDigital).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputDigital) {
                input.removeEventListener('input', input._handleInputDigital);
            }
            input._handleInputDigital = () => converterDigital(id);
            input.addEventListener('input', input._handleInputDigital);
        }
    });
}

inicializarConversorDigital();