/* ==========================================================================
   === 04. CONVERSORES - 08. Distância ===
   ========================================================================== */

window.FATORES_DISTANCIA = window.FATORES_DISTANCIA || {
    km: 1000,
    mi: 1609.344,
    nmi: 1852,
    m: 1,
    ft: 0.3048,
    yd: 0.9144
};
var FATORES_DISTANCIA = window.FATORES_DISTANCIA;

window.camposDistancia = window.camposDistancia || {
    'dist-km': 'km',
    'dist-mi': 'mi',
    'dist-nmi': 'nmi',
    'dist-m': 'm',
    'dist-ft': 'ft',
    'dist-yd': 'yd'
};
var camposDistancia = window.camposDistancia;

function converterDistancia(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const unidadeOrigem = camposDistancia[idOrigem];

    if (isNaN(valor)) {
        limparTodosCamposDistancia();
        return;
    }

    const valorEmMetros = valor * FATORES_DISTANCIA[unidadeOrigem];

    Object.keys(camposDistancia).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const unidadeDestino = camposDistancia[idDestino];
                const valorConvertido = valorEmMetros / FATORES_DISTANCIA[unidadeDestino];
                
                inputDestino.value = formatarResultadoDistancia(valorConvertido);
            }
        }
    });
}

function formatarResultadoDistancia(num) {
    if (num === 0) return 0;
    return Number(num.toFixed(4)).toString();
}

function limparTodosCamposDistancia() {
    Object.keys(camposDistancia).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function inicializarConversorDistancia() {
    Object.keys(camposDistancia).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputDistancia) {
                input.removeEventListener('input', input._handleInputDistancia);
            }
            input._handleInputDistancia = () => converterDistancia(id);
            input.addEventListener('input', input._handleInputDistancia);
        }
    });
}

inicializarConversorDistancia();