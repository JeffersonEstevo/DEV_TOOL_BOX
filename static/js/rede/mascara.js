/*// Controle de Abas Internas
function alternarAbaRede(abaId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(abaId).classList.add('active');
    
    const btnIdx = abaId === 'aba-ipv4' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[btnIdx].classList.add('active');
}*/

// Controle de Abas Internas (Padrão Dinâmico)
function alternarAbaRede(abaId) {
    // 1. Remove classe ativa dos botões exclusivos do módulo de rede
    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // 2. Remove classe ativa do conteúdo de abas de rede
    document.querySelectorAll('.rede-workspace.tab-content').forEach(content => content.classList.remove('active'));

    // 3. Adiciona classe ativa ao botão que possui o evento associado a este ID
    const btnClicado = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => btn.getAttribute('onclick').includes(abaId));
    if (btnClicado) btnClicado.classList.add('active');
    
    // 4. Mostra o painel de conteúdo correto
    const conteudoAba = document.getElementById(abaId);
    if (conteudoAba) conteudoAba.classList.add('active');
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

// ==========================================
// MÓDULO: VERIFICADOR DE COMUNICAÇÃO ENTRE IPs
// ==========================================

/** Converte string "a.b.c.d" em inteiro 32 bits (ou null se inválido). */
function ipParaInteiro(ip) {
    if (typeof ip !== 'string') return null;
    const partes = ip.trim().split('.');
    if (partes.length !== 4) return null;
    const octetos = partes.map(p => Number(p));
    if (octetos.some(o => !Number.isInteger(o) || o < 0 || o > 255)) return null;
    return ((octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3]) >>> 0;
}

/** Converte inteiro 32 bits em string "a.b.c.d". */
function inteiroParaIp(n) {
    return [
        (n >>> 24) & 255,
        (n >>> 16) & 255,
        (n >>> 8)  & 255,
         n         & 255
    ].join('.');
}

/** Máscara inteira a partir do CIDR. */
function cidrParaMascaraInteiro(cidr) {
    if (cidr === 0) return 0;
    return (~0 << (32 - cidr)) >>> 0;
}

/** Classifica um IP em categorias úteis (RFC 1918 / loopback / link-local etc.). */
function classificarIp(ipInt) {
    const a = (ipInt >>> 24) & 255;
    const b = (ipInt >>> 16) & 255;
    if (a === 10) return 'Privado (RFC 1918 - 10.0.0.0/8)';
    if (a === 172 && b >= 16 && b <= 31) return 'Privado (RFC 1918 - 172.16.0.0/12)';
    if (a === 192 && b === 168) return 'Privado (RFC 1918 - 192.168.0.0/16)';
    if (a === 127) return 'Loopback (localhost)';
    if (a === 169 && b === 254) return 'Link-local (APIPA)';
    if (a === 0) return 'Reservado (0.0.0.0/8)';
    if (a >= 224 && a <= 239) return 'Multicast (Classe D)';
    if (a >= 240) return 'Reservado / Experimental (Classe E)';
    return 'Público (roteável na Internet)';
}

/**
 * Núcleo do cálculo. Recebe IPs e CIDRs já validados.
 * Retorna um objeto com tudo que o render precisa.
 */
function avaliarComunicacao(ipAStr, cidrA, ipBStr, cidrB) {
    const ipA = ipParaInteiro(ipAStr);
    const ipB = ipParaInteiro(ipBStr);
    if (ipA === null) return { erro: 'IP de origem (A) inválido.' };
    if (ipB === null) return { erro: 'IP de destino (B) inválido.' };
    if (!Number.isInteger(cidrA) || cidrA < 0 || cidrA > 32) return { erro: 'CIDR de A inválido (0–32).' };
    if (!Number.isInteger(cidrB) || cidrB < 0 || cidrB > 32) return { erro: 'CIDR de B inválido (0–32).' };

    const maskA = cidrParaMascaraInteiro(cidrA);
    const maskB = cidrParaMascaraInteiro(cidrB);

    const redeA = (ipA & maskA) >>> 0;
    const redeB = (ipB & maskB) >>> 0;

    // Broadcast = rede | (~mask)
    const bcastA = (redeA | (~maskA >>> 0)) >>> 0;
    const bcastB = (redeB | (~maskB >>> 0)) >>> 0;

    // Hosts úteis (mesma regra da calculadora principal)
    const totalA = Math.pow(2, 32 - cidrA);
    const totalB = Math.pow(2, 32 - cidrB);
    const uteisA = cidrA >= 31 ? (cidrA === 32 ? 1 : 2) : totalA - 2;
    const uteisB = cidrB >= 31 ? (cidrB === 32 ? 1 : 2) : totalB - 2;

    const mesmaRede = redeA === redeB;

    // Detecta sobreposição parcial (redes diferentes mas uma contém a outra)
    let sobreposicao = false;
    if (!mesmaRede) {
        const menorMask = Math.min(maskA, maskB) >>> 0; // menos restritiva
        const maiorMask = Math.max(maskA, maskB) >>> 0; // mais restritiva
        const menorRede = ((ipA & menorMask) >>> 0) === ((ipB & menorMask) >>> 0)
            ? (ipA & menorMask) >>> 0 : null;
        if (menorRede !== null) {
            const redeMaior = (ipA & maiorMask) >>> 0;
            const redeMaiorB = (ipB & maiorMask) >>> 0;
            sobreposicao = (redeMaior === redeMaiorB) || (redeA === redeB);
        }
    }

    return {
        ipA, ipB, cidrA, cidrB, maskA, maskB,
        redeA, redeB, bcastA, bcastB,
        uteisA, uteisB, mesmaRede, sobreposicao,
        classA: classificarIp(ipA),
        classB: classificarIp(ipB)
    };
}

/** Renderiza o resultado no DOM. */
function renderizarComunicacao(res) {
    const $ver   = document.getElementById('com-veredito');
    const $exp   = document.getElementById('com-explicacao');
    const $rA    = document.getElementById('com-rede-a');
    const $rB    = document.getElementById('com-rede-b');
    const $bA    = document.getElementById('com-bcast-a');
    const $bB    = document.getElementById('com-bcast-b');
    const $hA    = document.getElementById('com-host-a');
    const $hB    = document.getElementById('com-host-b');
    const $class = document.getElementById('com-classificacao');
    const $and   = document.getElementById('com-and-bin');

    // Reset de classes de cor
    $ver.classList.remove('ok', 'fail', 'warn');

    if (res.erro) {
        $ver.textContent = '⚠️ Entrada inválida';
        $ver.classList.add('warn');
        $exp.textContent = res.erro;
        [ $rA, $rB, $bA, $bB, $hA, $hB, $class, $and ].forEach(el => el.textContent = '-');
        return;
    }

    if (res.mesmaRede) {
        $ver.textContent = '✅ Os IPs COMUNICAM diretamente';
        $ver.classList.add('ok');
        $exp.textContent =
            `Ambos pertencem à mesma sub-rede (${inteiroParaIp(res.redeA)}/${res.cidrA}). ` +
            `Tráfego flui na camada 2 (switch), sem necessidade de gateway.`;
    } else if (res.sobreposicao) {
        $ver.textContent = '⚠️ Comunicação PARCIAL / depende do roteamento';
        $ver.classList.add('warn');
        $exp.textContent =
            `As sub-redes se sobrepõem, mas os endereços estão em blocos diferentes. ` +
            `Sem um gateway configurado corretamente, a comunicação pode falhar.`;
    } else {
        $ver.textContent = '❌ Os IPs NÃO comunicam diretamente';
        $ver.classList.add('fail');
        $exp.textContent =
            `A=${inteiroParaIp(res.redeA)}/${res.cidrA} e B=${inteiroParaIp(res.redeB)}/${res.cidrB} ` +
            `são sub-redes distintas. É necessário um roteador (gateway) entre elas.`;
    }

    $rA.textContent = `${inteiroParaIp(res.redeA)}/${res.cidrA}`;
    $rB.textContent = `${inteiroParaIp(res.redeB)}/${res.cidrB}`;
    $bA.textContent = inteiroParaIp(res.bcastA);
    $bB.textContent = inteiroParaIp(res.bcastB);
    $hA.textContent = `${res.uteisA.toLocaleString()} hosts`;
    $hB.textContent = `${res.uteisB.toLocaleString()} hosts`;
    $class.textContent = `A: ${res.classA}  •  B: ${res.classB}`;

    // Demonstração didática do AND bit a bit
    const bin = n => n.toString(2).padStart(32, '0').match(/.{8}/g).join('.');
    $and.textContent =
        `A: ${bin(res.ipA)}  AND  ${bin(res.maskA)}  =  ${bin(res.redeA)}\n` +
        `B: ${bin(res.ipB)}  AND  ${bin(res.maskB)}  =  ${bin(res.redeB)}`;
}

/** Lê os campos e dispara o cálculo. */
function calcularComunicacao() {
    const modo   = document.getElementById('com-modo').value;
    const ipA    = document.getElementById('com-ip-a').value;
    const ipB    = document.getElementById('com-ip-b').value;
    const maskA  = parseInt(document.getElementById('com-mask-a').value, 10);
    const maskBField = document.getElementById('com-mask-b');
    // No modo "mesma-mascara", B usa a máscara de A
    const maskB = (modo === 'mesma-mascara') ? maskA : parseInt(maskBField.value, 10);

    renderizarComunicacao(avaliarComunicacao(ipA, maskA, ipB, maskB));
}

/** Inverte os valores de A e B (IPs e, se aplicável, máscaras). */
function inverterIpsComunicacao() {
    const ipA = document.getElementById('com-ip-a');
    const ipB = document.getElementById('com-ip-b');
    const mA  = document.getElementById('com-mask-a');
    const mB  = document.getElementById('com-mask-b');
    [ipA.value, ipB.value] = [ipB.value, ipA.value];
    [mA.value,  mB.value ] = [mB.value,  mA.value ];
    calcularComunicacao();
}

/** Habilita/desabilita o campo de máscara de B conforme o modo. */
function atualizarModoComunicacao() {
    const modo = document.getElementById('com-modo').value;
    const wrapperB = document.getElementById('com-mask-b').closest('.rede-field');
    if (modo === 'mesma-mascara') {
        wrapperB.classList.add('com-mask-b-hidden');
        // Espelha o valor de A em B para manter consistência visual
        document.getElementById('com-mask-b').value = document.getElementById('com-mask-a').value;
    } else {
        wrapperB.classList.remove('com-mask-b-hidden');
    }
    calcularComunicacao();
}

/** Limpa o módulo. */
function limparComunicacao() {
    ['com-ip-a', 'com-ip-b'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('com-mask-a').value = '24';
    document.getElementById('com-mask-b').value = '24';
    document.getElementById('com-modo').value = 'mesma-mascara';
    atualizarModoComunicacao();
    calcularComunicacao();
}

/** Registra os listeners. */
function inicializarComunicacao() {
    const bind = (id, ev, fn) => document.getElementById(id)?.addEventListener(ev, fn);

    bind('com-ip-a',    'input', calcularComunicacao);
    bind('com-ip-b',    'input', calcularComunicacao);
    bind('com-mask-a',  'input', calcularComunicacao);
    bind('com-mask-b',  'input', calcularComunicacao);
    bind('com-modo',    'change', atualizarModoComunicacao);
    bind('btn-inverter-ips', 'click', inverterIpsComunicacao);
    bind('btn-limpar-com',   'click', limparComunicacao);

    atualizarModoComunicacao(); // estado inicial
}

// Chamada no bootstrap da calculadora de rede
inicializarComunicacao();

inicializarCalculadoraRede();