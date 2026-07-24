// Fatores de conversão exatos baseados em Metros por Segundo (1 m/s)
window.FATORES_VELOCIDADE = window.FATORES_VELOCIDADE || {
    kmh: 1 / 3.6,
    ms: 1,
    mph: 0.44704,
    fps: 0.3048,
    nos: 0.5144444444444445,
    mach: 340.29
};
var FATORES_VELOCIDADE = window.FATORES_VELOCIDADE;

window.camposVelocidade = window.camposVelocidade || {
    'vel-kmh': 'kmh',
    'vel-ms': 'ms',
    'vel-mph': 'mph',
    'vel-fps': 'fps',
    'vel-nos': 'nos',
    'vel-mach': 'mach'
};
var camposVelocidade = window.camposVelocidade;

function converterVelocidade(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const unidadeOrigem = camposVelocidade[idOrigem];

    if (isNaN(valor)) {
        limparTodosCamposVelocidade();
        return;
    }

    // Converte o valor de entrada para a base (m/s)
    const valorEmMs = valor * FATORES_VELOCIDADE[unidadeOrigem];

    // Atualiza os outros campos baseando-se no valor em m/s
    Object.keys(camposVelocidade).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const unidadeDestino = camposVelocidade[idDestino];
                const valorConvertido = valorEmMs / FATORES_VELOCIDADE[unidadeDestino];
                
                inputDestino.value = formatarResultadoVelocidade(valorConvertido, unidadeDestino);
            }
        }
    });
}

function formatarResultadoVelocidade(num, unidade) {
    if (num === 0) return 0;
    
    // Se a unidade for Mach, exibe mais casas decimais pela sensibilidade do valor, senão limita a 5
    const casas = (unidade === 'mach') ? 5 : 4;
    return Number(num.toFixed(casas)).toString();
}

function limparTodosCamposVelocidade() {
    Object.keys(camposVelocidade).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

function inicializarConversorVelocidade() {
    Object.keys(camposVelocidade).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputVelocidade) {
                input.removeEventListener('input', input._handleInputVelocidade);
            }
            input._handleInputVelocidade = () => converterVelocidade(id);
            input.addEventListener('input', input._handleInputVelocidade);
        }
    });
}

inicializarConversorVelocidade();