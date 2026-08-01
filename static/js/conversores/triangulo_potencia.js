function calcularPotencias() {
    const inputP = document.getElementById('pot-ativa');
    const inputQ = document.getElementById('pot-reativa');
    const inputS = document.getElementById('pot-aparente');
    const inputFP = document.getElementById('pot-fp');
    const lblAngulo = document.getElementById('res-angulo');
    const lblSeno = document.getElementById('res-seno');
    const lblCarga = document.getElementById('res-tipo-carga');

    if (!inputP || !inputQ || !inputS || !inputFP) return;

    let p = parseFloat(inputP.value);
    let q = parseFloat(inputQ.value);
    let s = parseFloat(inputS.value);
    let fp = parseFloat(inputFP.value);

    // Lógica inteligente baseada em quais campos o usuário preencheu (P e Q como base principal)
    if (!isNaN(p) && !isNaN(q)) {
        s = Math.sqrt(Math.pow(p, 2) + Math.pow(q, 2));
        fp = s !== 0 ? p / s : 0;
        inputS.value = formatarSaidaPotencia(s);
        inputFP.value = formatarSaidaPotencia(fp, 4);
    } else if (!isNaN(p) && !isNaN(s) && s >= p) {
        q = Math.sqrt(Math.pow(s, 2) - Math.pow(p, 2));
        fp = s !== 0 ? p / s : 0;
        inputQ.value = formatarSaidaPotencia(q);
        inputFP.value = formatarSaidaPotencia(fp, 4);
    } else {
        // Se faltarem dados essenciais, limpa dependentes dinâmicos se necessário
        return;
    }

    // Cálculos Trigonométricos
    let rad = s > 0 ? Math.acos(Math.min(Math.max(fp, 0), 1)) : 0;
    let graus = rad * (180 / Math.PI);
    let seno = Math.sin(rad);

    if (lblAngulo) lblAngulo.textContent = graus.toFixed(2) + '°';
    if (lblSeno) lblSeno.textContent = seno.toFixed(4);
    
    if (lblCarga) {
        if (q > 0) lblCarga.textContent = 'Indutiva (Atrasada)';
        else if (q < 0) lblCarga.textContent = 'Capacitiva (Adiantada)';
        else lblCarga.textContent = 'Puramente Resistiva';
    }
}

function formatarSaidaPotencia(num, casas = 2) {
    if (isNaN(num) || num === 0) return '';
    return Number(num.toFixed(casas)).toString();
}

function limparPotencia() {
    ['pot-ativa', 'pot-reativa', 'pot-aparente', 'pot-fp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('res-angulo').textContent = '0.00°';
    document.getElementById('res-seno').textContent = '0.0000';
    document.getElementById('res-tipo-carga').textContent = 'Aguardando dados...';
}

function inicializarTrianguloPotencia() {
    ['pot-ativa', 'pot-reativa', 'pot-aparente', 'pot-fp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el._handleInputPot) el.removeEventListener('input', el._handleInputPot);
            el._handleInputPot = () => calcularPotencias();
            el.addEventListener('input', el._handleInputPot);
        }
    });
}

inicializarTrianguloPotencia();