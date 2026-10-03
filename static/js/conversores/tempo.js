// Constantes de conversão mapeadas tendo o "Segundo" como base (1 segundo = 1)
window.FATORES_SEGUNDO = window.FATORES_SEGUNDO || {
    nanosegundo: 1e-9,
    microsegundo: 1e-6,
    milissegundo: 1e-3,
    segundo: 1,
    minuto: 60,
    hora: 3600,
    dia: 86400,
    semana: 604800,
    mes: 2592000,   // 30 dias (30 * 86400)
    ano: 31536000,  // 365 dias (365 * 86400)
    seculo: 3153600000 // 100 anos (31536000 * 100)
};
var FATORES_SEGUNDO = window.FATORES_SEGUNDO;

// Mapeamento id_elemento -> chave_fator
window.camposTempo = window.camposTempo || {
    'tempo-nanosegundo': 'nanosegundo',
    'tempo-microsegundo': 'microsegundo',
    'tempo-milissegundo': 'milissegundo',
    'tempo-segundo': 'segundo',
    'tempo-minuto': 'minuto',
    'tempo-hora': 'hora',
    'tempo-dia': 'dia',
    'tempo-semana': 'semana',
    'tempo-mes': 'mes',
    'tempo-ano': 'ano',
    'tempo-seculo': 'seculo'
};
var camposTempo = window.camposTempo;

function converterTempo(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const unidadeOrigem = camposTempo[idOrigem];

    // Limpa todas as entradas caso o campo atual seja apagado
    if (isNaN(valor)) {
        limparTodosCamposTempo();
        return;
    }

    // Transforma o número inserido em segundos totais
    const valorEmSegundos = valor * FATORES_SEGUNDO[unidadeOrigem];

    // Calcula e distribui os equivalentes nas demais caixas
    Object.keys(camposTempo).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const unidadeDestino = camposTempo[idDestino];
                const valorConvertido = valorEmSegundos / FATORES_SEGUNDO[unidadeDestino];
                
                inputDestino.value = formatarResultadoTempo(valorConvertido);
            }
        }
    });
}

function formatarResultadoTempo(num) {
    if (num === 0) return 0;
    
    // Aplicação da regra de notação científica igual ao conversor digital
    if (Math.abs(num) < 0.00001 || Math.abs(num) >= 1e12) {
        return num.toExponential(4);
    }
    
    return Number(num.toFixed(6)).toString();
}

function limparTodosCamposTempo() {
    Object.keys(camposTempo).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

// Configura os escutadores do evento input
function inicializarConversorTempo() {
    Object.keys(camposTempo).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputTempo) {
                input.removeEventListener('input', input._handleInputTempo);
            }
            input._handleInputTempo = () => converterTempo(id);
            input.addEventListener('input', input._handleInputTempo);
        }
    });

    // Configura o botão de limpar, caso exista na view
    const btnLimpar = document.getElementById('btn-limpar-tempo');
    if (btnLimpar) {
        if (btnLimpar._handleLimparTempo) {
            btnLimpar.removeEventListener('click', btnLimpar._handleLimparTempo);
        }
        btnLimpar._handleLimparTempo = () => limparTodosCamposTempo();
        btnLimpar.addEventListener('click', btnLimpar._handleLimparTempo);
    }
}

// Inicialização imediata
inicializarConversorTempo();