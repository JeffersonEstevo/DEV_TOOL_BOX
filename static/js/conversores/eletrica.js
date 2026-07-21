/*
// Controle de Alternância de Abas
function alternarAbaEletrica(abaId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(abaId).classList.add('active');
    
    // Identifica o botão clicado através do evento ou mapeamento
    const btnIdx = abaId === 'aba-calculadora' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[btnIdx].classList.add('active');
}*/

// Controle de Alternância de Abas (Padrão Dinâmico)
function alternarAbaEletrica(abaId) {
    // Remove a classe ativa de todos os botões pertencentes às abas elétricas
    document.querySelectorAll('.eletrica-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Remove a classe ativa de todas as áreas de conteúdo elétrico
    document.querySelectorAll('.eletrica-workspace.tab-content').forEach(content => content.classList.remove('active'));

    // Adiciona classe ativa dinamicamente ao botão que contém o evento de clique para esta aba
    const btnClicado = Array.from(document.querySelectorAll('.eletrica-tabs .tab-btn')).find(btn => btn.getAttribute('onclick').includes(abaId));
    if (btnClicado) btnClicado.classList.add('active');
    
    // Mostra o conteúdo correspondente
    const conteudoAba = document.getElementById(abaId);
    if (conteudoAba) conteudoAba.classList.add('active');
}

// ==========================================
// PARTE 1: LEI DE OHM & TRIÂNGULO DE POTÊNCIAS
// ==========================================
const camposOhm = ['ele-tensao', 'ele-corrente', 'ele-resistencia', 'ele-potencia'];
const idParaChaveOhm = { 'ele-tensao': 'V', 'ele-corrente': 'I', 'ele-resistencia': 'R', 'ele-potencia': 'P' };

// Guarda os ids dos campos na ordem em que foram editados manualmente (mais recente primeiro)
let ordemEdicaoOhm = [];

function registrarEdicaoOhm(id) {
    ordemEdicaoOhm = ordemEdicaoOhm.filter(x => x !== id);
    ordemEdicaoOhm.unshift(id);
}

function calcularEletricaAvancada() {
    const vInput = document.getElementById('ele-tensao');
    const iInput = document.getElementById('ele-corrente');
    const rInput = document.getElementById('ele-resistencia');
    const pInput = document.getElementById('ele-potencia');
    const fpInput = document.getElementById('ele-fp');

    if (!vInput || !iInput || !rInput || !pInput) return;

    const inputs = { V: vInput, I: iInput, R: rInput, P: pInput };

    let valores = {
        V: parseFloat(vInput.value),
        I: parseFloat(iInput.value),
        R: parseFloat(rInput.value),
        P: parseFloat(pInput.value)
    };

    let FP = parseFloat(fpInput.value);
    if (isNaN(FP)) FP = 1.0; // Se não definido, assume carga resistiva (1.0)
    if (FP < 0) FP = 0; if (FP > 1) FP = 1;

    // Lista as chaves com valor válido, priorizando a ordem de edição manual mais recente
    const chavesValidasPorEdicao = ordemEdicaoOhm
        .map(id => idParaChaveOhm[id])
        .filter(chave => chave && !isNaN(valores[chave]));

    // Inclui quaisquer campos válidos que ainda não constam na lista (ex.: preenchidos automaticamente antes)
    Object.keys(valores).forEach(chave => {
        if (!isNaN(valores[chave]) && !chavesValidasPorEdicao.includes(chave)) {
            chavesValidasPorEdicao.push(chave);
        }
    });

    // Resolve a Lei de Ohm usando sempre os 2 campos mais recentemente editados
    if (chavesValidasPorEdicao.length >= 2) {
        const [chaveA, chaveB] = chavesValidasPorEdicao.slice(0, 2);
        const parAtivo = new Set([chaveA, chaveB]);
        const tem = (a, b) => parAtivo.has(a) && parAtivo.has(b);

        let { V, I, R, P } = valores;

        if (tem('V', 'I')) { R = V / I; P = V * I; }
        else if (tem('V', 'R')) { I = V / R; P = (V * V) / R; }
        else if (tem('V', 'P')) { I = P / V; R = (V * V) / P; }
        else if (tem('I', 'R')) { V = I * R; P = (I * I) * R; }
        else if (tem('I', 'P')) { V = P / I; R = P / (I * I); }
        else if (tem('R', 'P')) { V = Math.sqrt(P * R); I = Math.sqrt(P / R); }

        valores = { V, I, R, P };

        // Sobrescreve apenas os campos que NÃO fazem parte do par mais recentemente editado
        Object.keys(inputs).forEach(chave => {
            if (!parAtivo.has(chave)) {
                inputs[chave].value = formatarNum(valores[chave]);
            }
        });
    }

    const P = valores.P;

    // Se tivermos a Potência Ativa (P) calculada ou digitada, resolvemos o Triângulo de Potências
    if (!isNaN(P) && P > 0) {
        const S = P / FP; // Potência Aparente (VA)
        const Q = Math.sqrt(Math.max(0, (S * S) - (P * P))); // Potência Reativa (VAr)
        
        // Potência Nominal Sugerida aplica uma margem de segurança técnica padrão de 25% (Fator 1.25)
        const nominalSugerida = S * 1.25;

        document.getElementById('ele-aparente').value = formatarNum(S);
        document.getElementById('ele-reativa').value = formatarNum(Q);
        document.getElementById('ele-nominal').value = `${formatarNum(nominalSugerida)} VA (+25%)`;
    } else {
        document.getElementById('ele-aparente').value = '';
        document.getElementById('ele-reativa').value = '';
        document.getElementById('ele-nominal').value = '';
    }
}

// ==========================================
// PARTE 2: CONVERSOR DE PREFIXOS MÉTRICOS
// ==========================================
const fatoresPrefixos = {
    mega: 1e6, quilo: 1e3, base: 1, mili: 1e-3, micro: 1e-6, nano: 1e-9
};
const camposPrefixos = {
    'pref-mega': 'mega', 'pref-quilo': 'quilo', 'pref-base': 'base',
    'pref-mili': 'mili', 'pref-micro': 'micro', 'pref-nano': 'nano'
};

function converterPrefixos(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const valor = parseFloat(inputOrigem.value);
    const chaveOrigem = camposPrefixos[idOrigem];

    if (isNaN(valor)) {
        limparAbaPrefixos();
        return;
    }

    // Converte para a unidade Base
    const valorNaBase = valor * fatoresPrefixos[chaveOrigem];

    // Atualiza as outras caixas
    Object.keys(camposPrefixos).forEach(idDestino => {
        if (idDestino !== idOrigem) {
            const inputDestino = document.getElementById(idDestino);
            if (inputDestino) {
                const chaveDestino = camposPrefixos[idDestino];
                const convertido = valorNaBase / fatoresPrefixos[chaveDestino];
                
                // Formatação inteligente científica para números extremamente baixos
                inputDestino.value = (convertido < 1e-4 && convertido > 0) ? convertido.toExponential(4) : formatarNum(convertido);
            }
        }
    });
}

function atualizarLabelsPrefixos() {
    const g = document.getElementById('prefixo-grandeza').value; // V, A, W ou Ω
    const nomes = {
        'V': ['Megavolts (MV)', 'Quilovolts (kV)', 'Volts (V)', 'Milivolts (mV)', 'Microvolts (µV)', 'Nanovolts (nV)'],
        'A': ['Megamperes (MA)', 'Quilamperes (kA)', 'Amperes (A)', 'Miliamperes (mA)', 'Microamperes (µA)', 'Namamperes (nA)'],
        'W': ['Megawatts (MW)', 'Quilowatts (kW)', 'Watts (W)', 'Miliwatts (mW)', 'Microwatts (µW)', 'Nanowatts (nW)'],
        'Ω': ['Megohms (MΩ)', 'Quilohms (kΩ)', 'Ohms (Ω)', 'Miliohms (mΩ)', 'Microohms (µΩ)', 'Nanoohms (nΩ)']
    };
    
    document.getElementById('lbl-mega').innerText = nomes[g][0];
    document.getElementById('lbl-quilo').innerText = nomes[g][1];
    document.getElementById('lbl-unidade').innerText = `Unidade Base (${nomes[g][2]})`;
    document.getElementById('lbl-mili').innerText = nomes[g][3];
    document.getElementById('lbl-micro').innerText = nomes[g][4];
    document.getElementById('lbl-nano').innerText = nomes[g][5];
    
    limparAbaPrefixos();
}

// Auxiliares de Limpeza e Formatação
function formatarNum(n) {
    if (isNaN(n) || !isFinite(n)) return '';
    return Number(n.toFixed(4)).toString();
}

function limparAbaPrefixos() {
    Object.keys(camposPrefixos).forEach(id => { const i = document.getElementById(id); if(i) i.value = ''; });
}

function limparTudoEletrica() {
    camposOhm.forEach(id => { const i = document.getElementById(id); if(i) i.value = ''; });
    document.getElementById('ele-fp').value = '';
    document.getElementById('ele-aparente').value = '';
    document.getElementById('ele-reativa').value = '';
    document.getElementById('ele-nominal').value = '';
    ordemEdicaoOhm = [];
    limparAbaPrefixos();
}

// Inicialização dos Ouvintes
function inicializarEletrica() {
    camposOhm.forEach(id => document.getElementById(id)?.addEventListener('input', () => {
        registrarEdicaoOhm(id);
        calcularEletricaAvancada();
    }));
    document.getElementById('ele-fp')?.addEventListener('input', calcularEletricaAvancada);
    Object.keys(camposPrefixos).forEach(id => document.getElementById(id)?.addEventListener('input', () => converterPrefixos(id)));
}

inicializarEletrica();