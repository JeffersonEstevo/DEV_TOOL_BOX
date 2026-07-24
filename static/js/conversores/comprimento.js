// Objeto com os fatores de conversão tendo o "Metro" como unidade base (1 metro)
window.FATORES_METRO = window.FATORES_METRO || {
    km: 1000,
    m: 1,
    cm: 0.01,
    mm: 0.001,
    milha: 1609.344,
    jarda: 0.9144,
    pe: 0.3048,
    polegada: 0.0254
};
var FATORES_METRO = window.FATORES_METRO;

// IDs mapeados para facilitar o laço de atualização
window.camposComprimento = window.camposComprimento || {
    'comp-km': 'km',
    'comp-m': 'm',
    'comp-cm': 'cm',
    'comp-mm': 'mm',
    'comp-milha': 'milha',
    'comp-jarda': 'jarda',
    'comp-pe': 'pe',
    'comp-polegada': 'polegada'
};
var camposComprimento = window.camposComprimento;

function converterComprimento(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const unidadeOrigem = camposComprimento[idOrigem];

    // Se o campo for esvaziado, limpa todos os outros campos
    if (isNaN(valor)) {
        limparTodosCamposComprimento();
        return;
    }

    // Converte o valor digitado primeiro para a base (Metros)
    const valorEmMetros = valor * FATORES_METRO[unidadeOrigem];

    // Atualiza dinamicamente todas as outras caixas de texto
    Object.keys(camposComprimento).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const unidadeDestino = camposComprimento[idDestino];
                const valorConvertido = valorEmMetros / FATORES_METRO[unidadeDestino];
                
                // Formata o número para evitar dízimas gigantescas (ex: 1.33333333333)
                inputDestino.value = formatarResultadoConversao(valorConvertido);
            }
        }
    });
}

function formatarResultadoConversao(num) {
    if (num === 0) return 0;
    // Se for um número com muitas casas decimais, limita a 6, senão deixa natural
    return Number(num.toFixed(6)).toString();
}

function limparTodosCamposComprimento() {
    Object.keys(camposComprimento).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
}

// Configura os ouvintes de eventos dinâmicos (input)
function inicializarConversorComprimento() {
    Object.keys(camposComprimento).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => converterComprimento(id));
        }
    });
}

// Executa a vinculação inicial
inicializarConversorComprimento();