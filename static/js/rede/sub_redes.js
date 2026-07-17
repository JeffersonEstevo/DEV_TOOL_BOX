/*
// Mapeamento e controle das abas no mesmo padrão do seu sistema
function alternarAbaSubrede(idAba) {
    document.querySelectorAll('.subredes-workspace.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) abaAlvo.classList.add('active');

    const btnAlvo = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => 
        btn.getAttribute('onclick').includes(idAba)
    );
    if (btnAlvo) btnAlvo.classList.add('active');
}*/

// Mapeamento e controle das abas de Sub-redes no mesmo padrão dinâmico
function alternarAbaSubrede(idAba) {
    // 1. Remove a classe ativa de todos os conteúdos de sub-redes
    document.querySelectorAll('.subredes-workspace.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });

    // 2. Remove a classe ativa dos botões contidos em .rede-tabs
    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Ativa o container correspondente
    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) abaAlvo.classList.add('active');

    // 4. Ativa o botão dinamicamente com base no atributo onclick
    const btnAlvo = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(idAba)
    );
    if (btnAlvo) btnAlvo.classList.add('active');
}

// --- Funções Auxiliares Matemáticas de Rede ---
function converterCidrParaMascara(cidr) {
    let mascaraNum = cidr === 0 ? 0 : ~((1 << (32 - cidr)) - 1);
    return [
        (mascaraNum >>> 24) & 255,
        (mascaraNum >>> 16) & 255,
        (mascaraNum >>> 8) & 255,
        mascaraNum & 255
    ].join('.');
}

function ipParaInteiro(ip) {
    return ip.split('.').reduce((acc, octeto) => (acc << 8) + parseInt(octeto, 10), 0) >>> 0;
}

function inteiroParaIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

function inteiroParaBinarioStr(int) {
    let bin = (int >>> 0).toString(2).padStart(32, '0');
    return `${bin.slice(0,8)}.${bin.slice(8,16)}.${bin.slice(16,24)}.${bin.slice(24,32)}`;
}

function identificarClasse(ipStr) {
    const primeiroOcteto = parseInt(ipStr.split('.')[0], 10);
    if (primeiroOcteto >= 1 && primeiroOcteto <= 126) return "Classe A (Pública)";
    if (primeiroOcteto === 127) return "Classe A (Loopback / Localhost)";
    if (primeiroOcteto >= 128 && primeiroOcteto <= 191) return "Classe B";
    if (primeiroOcteto >= 192 && primeiroOcteto <= 223) return "Classe C";
    if (primeiroOcteto >= 224 && primeiroOcteto <= 239) return "Classe D (Multicast)";
    return "Classe E (Experimental)";
}

function filtrarEntradaIP(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
}

// --- LÓGICA DA ABA 1: CALCULADORA DE SUB-REDES ---
function popularSelectCIDR() {
    const select = document.getElementById('subrede-cidr');
    if (!select) return;

    select.innerHTML = '';
    for (let i = 32; i >= 1; i--) {
        const opt = document.createElement('option');
        opt.value = i;
        if (i === 24) opt.selected = true;
        opt.textContent = `/${i} (${converterCidrParaMascara(i)})`;
        select.appendChild(opt);
    }
}

function calcularSubRede() {
    const ipInput = document.getElementById('subrede-ip');
    const cidrSelect = document.getElementById('subrede-cidr');
    const containerResultados = document.getElementById('subredes-resultados');

    if (!ipInput || !cidrSelect || !containerResultados) return;

    filtrarEntradaIP(ipInput);
    const ipStr = ipInput.value;
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipRegex.test(ipStr)) {
        containerResultados.style.display = 'none';
        return;
    }

    try {
        const cidr = parseInt(cidrSelect.value, 10);
        const ipInt = ipParaInteiro(ipStr);
        const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        const redeInt = (ipInt & maskInt) >>> 0;
        const broadcastInt = (redeInt | ~maskInt) >>> 0;
        
        let totalIps = Math.pow(2, 32 - cidr);
        let hostsUteis = cidr >= 31 ? 0 : totalIps - 2;

        let primeiroIpInt = cidr >= 31 ? redeInt : redeInt + 1;
        let ultimoIpInt = cidr >= 31 ? broadcastInt : broadcastInt - 1;

        document.getElementById('res-rede').textContent = `${inteiroParaIp(redeInt)} /${cidr}`;
        document.getElementById('res-mascara').textContent = inteiroParaIp(maskInt);
        document.getElementById('res-primeiro-ip').textContent = inteiroParaIp(primeiroIpInt);
        document.getElementById('res-ultimo-ip').textContent = inteiroParaIp(ultimoIpInt);
        document.getElementById('res-broadcast').textContent = inteiroParaIp(broadcastInt);
        document.getElementById('res-total-ips').textContent = totalIps.toLocaleString('pt-BR');
        document.getElementById('res-hosts-uteis').textContent = hostsUteis > 0 ? hostsUteis.toLocaleString('pt-BR') : 'Nenhum';
        document.getElementById('res-classe').textContent = identificarClasse(ipStr);
        document.getElementById('res-binario').textContent = inteiroParaBinarioStr(ipInt);
        document.getElementById('res-mascara-binario').textContent = inteiroParaBinarioStr(maskInt);

        containerResultados.style.display = 'block';
    } catch (error) {
        console.error("Erro no cálculo de sub-rede: ", error);
    }
}

// --- LÓGICA DA ABA 2: PARTICIONAMENTO & COMUNICAÇÃO ---
function inicializarAbaParticionamento() {
    const parentSelect = document.getElementById('part-cidr-origem');
    if (!parentSelect) return;

    parentSelect.innerHTML = '';
    // Preenche do /8 até o /30 para permitir segmentações viáveis
    for (let i = 8; i <= 30; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        if (i === 24) opt.selected = true;
        opt.textContent = `/${i} (${converterCidrParaMascara(i)})`;
        parentSelect.appendChild(opt);
    }

    atualizarSelectDestino();
}

function atualizarSelectDestino() {
    const parentCidr = parseInt(document.getElementById('part-cidr-origem').value, 10);
    const destSelect = document.getElementById('part-cidr-destino');
    if (!destSelect) return;

    destSelect.innerHTML = '';
    
    // O CIDR destino deve ser maior que o de origem (particionar em pedaços menores)
    // Limita a até 8 bits de diferença para não travar o navegador gerando milhares de subredes (máx 256 subredes)
    const maxCidrLimit = Math.min(32, parentCidr + 8);

    for (let i = parentCidr + 1; i <= maxCidrLimit; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        const quantSubredes = Math.pow(2, i - parentCidr);
        opt.textContent = `/${i} (${quantSubredes} sub-redes de ${Math.pow(2, 32 - i)} IPs)`;
        destSelect.appendChild(opt);
    }

    calcularParticionamento();
}

function calcularParticionamento() {
    const ipInput = document.getElementById('part-ip');
    const parentCidr = parseInt(document.getElementById('part-cidr-origem').value, 10);
    const destSelect = document.getElementById('part-cidr-destino');
    const containerResultados = document.getElementById('part-resultados');
    const tabelaCorpo = document.getElementById('part-tabela-corpo');

    if (!ipInput || !destSelect || !containerResultados || !tabelaCorpo) return;

    filtrarEntradaIP(ipInput);
    const ipHostStr = ipInput.value;
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipRegex.test(ipHostStr) || !destSelect.value) {
        containerResultados.style.display = 'none';
        return;
    }

    try {
        const destCidr = parseInt(destSelect.value, 10);
        const hostIpInt = ipParaInteiro(ipHostStr);

        // Define os limites da Rede Mãe
        const parentMask = (~0 << (32 - parentCidr)) >>> 0;
        const parentRedeInt = (hostIpInt & parentMask) >>> 0;

        // Informações das divisões
        const subredesQuantidade = Math.pow(2, destCidr - parentCidr);
        const ipsPorSubrede = Math.pow(2, 32 - destCidr);

        tabelaCorpo.innerHTML = '';

        for (let i = 0; i < subredesQuantidade; i++) {
            const subredeInicioInt = (parentRedeInt + (i * ipsPorSubrede)) >>> 0;
            const subredeFimInt = (subredeInicioInt + ipsPorSubrede - 1) >>> 0;

            const redeStr = inteiroParaIp(subredeInicioInt);
            const broadcastStr = inteiroParaIp(subredeFimInt);

            // Determina faixa de IPs Úteis
            let primeiroUtil = destCidr >= 31 ? redeStr : inteiroParaIp(subredeInicioInt + 1);
            let ultimoUtil = destCidr >= 31 ? broadcastStr : inteiroParaIp(subredeFimInt - 1);
            const faixaUteis = destCidr >= 31 ? 'Ponto-a-Ponto' : `${primeiroUtil} - ${ultimoUtil}`;

            // Checa se o IP de host digitado pertence a este pedaço da sub-rede (Acesso L2)
            const pertence = (hostIpInt >= subredeInicioInt && hostIpInt <= subredeFimInt);

            const tr = document.createElement('tr');
            if (pertence) {
                tr.classList.add('linha-local');
                tr.style.backgroundColor = 'rgba(40, 167, 69, 0.12)'; // Verde para mesma rede (L2)
            } else {
                tr.style.opacity = '0.9';
            }

            tr.innerHTML = `
                <td><strong>${redeStr} /${destCidr}</strong></td>
                <td>${faixaUteis}</td>
                <td>${broadcastStr}</td>
                <td style="font-weight: 600;">
                    ${pertence ? 
                        '<span style="color: #28a745;"><i class="bi bi-check-circle-fill"></i> 🟢 Local (Acesso L2)</span>' : 
                        '<span style="color: #dc3545;"><i class="bi bi-exclamen-triangle-fill"></i> 🔴 Remoto (Requer L3)</span>'}
                </td>
            `;
            tabelaCorpo.appendChild(tr);
        }

        containerResultados.style.display = 'block';
    } catch (e) {
        console.error("Erro no particionamento: ", e);
    }
}

// --- LIMPEZA E INICIALIZAÇÃO ---
function limparTodosCamposSubredes() {
    const ip1 = document.getElementById('subrede-ip');
    const ip2 = document.getElementById('part-ip');
    if (ip1) ip1.value = '192.168.0.1';
    if (ip2) ip2.value = '192.168.1.50';
    
    const cidr1 = document.getElementById('subrede-cidr');
    if (cidr1) cidr1.value = 24;

    const cidrOrigem = document.getElementById('part-cidr-origem');
    if (cidrOrigem) {
        cidrOrigem.value = 24;
        atualizarSelectDestino();
    }

    calcularSubRede();
}

function inicializarCalculadoraSubredes() {
    popularSelectCIDR();
    inicializarAbaParticionamento();

    // Eventos Aba 1
    const ipInput = document.getElementById('subrede-ip');
    const cidrSelect = document.getElementById('subrede-cidr');
    if (ipInput) ipInput.addEventListener('input', calcularSubRede);
    if (cidrSelect) cidrSelect.addEventListener('change', calcularSubRede);

    // Eventos Aba 2
    const partIp = document.getElementById('part-ip');
    const partOrigem = document.getElementById('part-cidr-origem');
    const partDestino = document.getElementById('part-cidr-destino');

    if (partIp) partIp.addEventListener('input', calcularParticionamento);
    if (partOrigem) partOrigem.addEventListener('change', atualizarSelectDestino);
    if (partDestino) partDestino.addEventListener('change', calcularParticionamento);

    // Executa cálculos iniciais
    calcularSubRede();
}

inicializarCalculadoraSubredes();