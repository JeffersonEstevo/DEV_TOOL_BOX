// Constantes de conversão mapeadas tendo o "Segundo" como base (1 segundo)
const FATORES_SEGUNDO = {
    segundo: 1,
    minuto: 60,
    hora: 3600,
    dia: 86400,
    semana: 604800,
    ano: 31536000 // 365 dias * 86400 segundos
};

// Mapeamento id_elemento -> chave_fator
const camposTempo = {
    'tempo-segundo': 'segundo',
    'tempo-minuto': 'minuto',
    'tempo-hora': 'hora',
    'tempo-dia': 'dia',
    'tempo-semana': 'semana',
    'tempo-ano': 'ano'
};

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
    // Permite alta precisão decimal para frações de ano/semanas e corta dízimas extensas
    return Number(num.toPrecision(12)).toString();
}

function limparTodosCamposTempo() {
    Object.keys(camposTempo).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

// Configura os escutadores do evento inline input
function inicializarConversorTempo() {
    Object.keys(camposTempo).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => converterTempo(id));
        }
    });
}

// Inicialização imediata
inicializarConversorTempo();