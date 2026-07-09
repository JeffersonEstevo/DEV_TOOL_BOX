// Controle de Abas Internas
function alternarAbaRede(abaId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(abaId).classList.add('active');
    
    const btnIdx = abaId === 'aba-ipv4' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[btnIdx].classList.add('active');
}

// ==========================================
// MÓDULO IPV4: CÁLCULOS DE MÁSCARA E CIDR
// ==========================================

function calcularPorCidr() {
    const cidrInput = document.getElementById('net-cidr');
    const maskInput = document.getElementById('net-mask');
    let cidr = parseInt(cidrInput.value);

    if (isNaN(cidr)) {
        limparResultadosIPv4();
        return;
    }

    if (cidr < 0) { cidr = 0; cidrInput.value = 0; }
    if (cidr > 32) { cidr = 32; cidrInput.value = 32; }

    // Calcula a máscara em formato inteiro de 32 bits
    let maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    
    // Converte o inteiro para a string decimal com pontos (ex: 255.255.255.0)
    const octetos = [
        (maskInt >>> 24) & 255,
        (maskInt >>> 16) & 255,
        (maskInt >>> 8) & 255,
        maskInt & 255
    ];
    maskInput.value = octetos.join('.');

    renderizarResultadosIPv4(cidr, maskInt, octetos);
}

function calcularPorMascara() {
    const maskInput = document.getElementById('net-mask');
    const cidrInput = document.getElementById('net-cidr');
    const maskStr = maskInput.value.trim();

    // Validação básica do formato de máscara IP
    const regexIp = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (!regexIp.test(maskStr)) {
        limparResultadosIPv4(false); // Mantém o texto digitado pelo usuário
        return;
    }

    const octetos = maskStr.split('.').map(Number);
    if (octetos.some(o => o > 255)) return;

    // Monta o inteiro de 32 bits
    let maskInt = ((octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3]) >>> 0;

    // Conta os bits 1 consecutivos para descobrir o CIDR
    let binStr = maskInt.toString(2);
    let cidr = binStr.indexOf('0');
    
    if (cidr === -1) cidr = binStr.length; // Se for tudo 1 (255.255.255.255)
    if (binStr.includes('01')) {
        // Máscara inválida (bits intercalados), cancela cálculo preciso
        return;
    }

    cidrInput.value = cidr;
    renderizarResultadosIPv4(cidr, maskInt, octetos);
}

function renderizarResultadosIPv4(cidr, maskInt, octetos) {
    // Total de IPs: 2^(32 - CIDR)
    const totalIps = Math.pow(2, 32 - cidr);
    // Hosts úteis: Total - 2 (Rede e Broadcast), mínimo 0
    const uteisIps = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalIps - 2;

    // Wildcard (Curinga) é o inverso binário da máscara
    const wildcardOctetos = octetos.map(o => 255 - o);

    // Formata visualmente os binários divididos por octetos
    const binariosFormatados = octetos.map(o => o.toString(2).padStart(8, '0')).join('.');

    document.getElementById('res-total-ips').innerText = totalIps.toLocaleString();
    document.getElementById('res-uteis-ips').innerText = uteisIps.toLocaleString();
    document.getElementById('res-wildcard').innerText = wildcardOctetos.join('.');
    document.getElementById('res-binario').innerText = binariosFormatados;
}

function limparResultadosIPv4(limparInputs = true) {
    if (limparInputs) {
        document.getElementById('net-cidr').value = '';
        document.getElementById('net-mask').value = '';
    }
    document.getElementById('res-total-ips').innerText = '-';
    document.getElementById('res-uteis-ips').innerText = '-';
    document.getElementById('res-wildcard').innerText = '-';
    document.getElementById('res-binario').innerText = '-';
}


// ==========================================
// MÓDULO IPV6: CÁLCULOS DE PREFIXOS
// ==========================================

function calcularIPv6() {
    const prefixInput = document.getElementById('net-ipv6-prefixo');
    let p = parseInt(prefixInput.value);

    if (isNaN(p)) {
        document.getElementById('res-v6-ips').innerText = '-';
        document.getElementById('res-v6-escopo').innerText = '-';
        return;
    }

    if (p < 0) { p = 0; prefixInput.value = 0; }
    if (p > 128) { p = 128; prefixInput.value = 128; }

    // Calcula a quantidade de IPs remanescentes: 2^(128 - p)
    const bitsLivres = 128 - p;
    let resultadoTxt = "";

    // Como o JS perde precisão acima de 2^53, usamos BigInt ou representações exponenciais amigáveis
    if (bitsLivres <= 30) {
        resultadoTxt = Math.pow(2, bitsLivres).toLocaleString();
    } else {
        // Exibição em BigInt nativo do JS
        let ipsBig = BigInt(2) ** BigInt(bitsLivres);
        resultadoTxt = ipsBig.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formata com pontos
    }

    // Identifica cenários comuns na engenharia de redes IPv6
    let escopo = "Sub-particionamento personalizado.";
    if (p === 128) escopo = "Um único Host específico (Equivalente ao /32 do IPv4).";
    else if (p === 64) escopo = "LAN/Sub-rede padrão (Tamanho padrão recomendado para qualquer rede local).";
    else if (p === 56) escopo = "Designação padrão comum para conexões residenciais de provedores (ISPs).";
    else if (p === 48) escopo = "Designação corporativa padrão / Redes corporativas inteiras.";
    else if (p === 32) escopo = "Bloco de alocação inicial para Provedores de Internet de grande porte LIR/RIR.";

    document.getElementById('res-v6-ips').innerText = `${resultadoTxt} IPs`;
    document.getElementById('res-v6-escopo').innerText = escopo;
}


// ==========================================
// INICIALIZAÇÃO E ESCUTAS
// ==========================================
function limparTudoRede() {
    limparResultadosIPv4();
    document.getElementById('net-ipv6-prefixo').value = '64';
    calcularIPv6();
}

function inicializarCalculadoraRede() {
    document.getElementById('net-cidr')?.addEventListener('input', calcularPorCidr);
    document.getElementById('net-mask')?.addEventListener('input', calcularPorMascara);
    document.getElementById('net-ipv6-prefixo')?.addEventListener('input', calcularIPv6);
    
    // Inicia o estado inicial do IPv6
    calcularIPv6();
}

inicializarCalculadoraRede();