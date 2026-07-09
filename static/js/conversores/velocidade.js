// Fatores de conversão exatos baseados em Metros por Segundo (1 m/s)
const FATORES_VELOCIDADE = {
    kmh: 1 / 3.6,                  // 1 km/h = 0.277778 m/s
    ms: 1,                         // Unidade base
    mph: 0.44704,                  // 1 mph = 0.44704 m/s
    fps: 0.3048,                   // 1 pé/s = 0.3048 m/s
    nos: 0.5144444444444445,       // 1 nó = 1852 metros por hora
    mach: 340.29                   // Velocidade do som ao nível do mar a 15°C
};

const camposVelocidade = {
    'vel-kmh': 'kmh',
    'vel-ms': 'ms',
    'vel-mph': 'mph',
    'vel-fps': 'fps',
    'vel-nos': 'nos',
    'vel-mach': 'mach'
};

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
            input.addEventListener('input', () => converterVelocidade(id));
        }
    });
}

inicializarConversorVelocidade();