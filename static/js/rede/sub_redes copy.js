// Popula o select do CIDR de /1 até /32 ao carregar a página
function popularSelectCIDR() {
    const select = document.getElementById('subrede-cidr');
    if (!select) return;

    select.innerHTML = '';
    for (let i = 32; i >= 1; i--) {
        const opt = document.createElement('option');
        opt.value = i;
        // Define o /24 como padrão inicial
        if (i === 24) opt.selected = true;
        
        // Calcula a máscara correspondente para exibir amigavelmente
        const mask = converterCidrParaMascara(i);
        opt.textContent = `/${i} (${mask})`;
        select.appendChild(opt);
    }
}

// Converte o número CIDR (ex: 24) para string IP (ex: 255.255.255.0)
function converterCidrParaMascara(cidr) {
    let mascaraNum = ~((1 << (32 - cidr)) - 1);
    return [
        (mascaraNum >>> 24) & 255,
        (mascaraNum >>> 16) & 255,
        (mascaraNum >>> 8) & 255,
        mascaraNum & 255
    ].join('.');
}

// Converte string IP para inteiro de 32 bits
function ipParaInteiro(ip) {
    return ip.split('.').reduce((acc, octeto) => (acc << 8) + parseInt(octeto, 10), 0) >>> 0;
}

// Converte inteiro de 32 bits para string IP
function inteiroParaIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

// Converte inteiro de 32 bits para formato binário com pontos
function inteiroParaBinarioStr(int) {
    let bin = (int >>> 0).toString(2).padStart(32, '0');
    return `${bin.slice(0,8)}.${bin.slice(8,16)}.${bin.slice(16,24)}.${bin.slice(24,32)}`;
}

// Identifica a classe original do IP baseado no primeiro octeto
function identificarClasse(ipStr) {
    const primeiroOcteto = parseInt(ipStr.split('.')[0], 10);
    if (primeiroOcteto >= 1 && primeiroOcteto <= 126) return "Classe A (Pública)";
    if (primeiroOcteto === 127) return "Classe A (Loopback / Localhost)";
    if (primeiroOcteto >= 128 && primeiroOcteto <= 191) return "Classe B";
    if (primeiroOcteto >= 192 && primeiroOcteto <= 223) return "Classe C";
    if (primeiroOcteto >= 224 && primeiroOcteto <= 239) return "Classe D (Multicast)";
    return "Classe E (Experimental)";
}

// Filtra a entrada de dados do IP em tempo real (números e pontos)
function filtrarEntradaIP(input) {
    input.value = input.value.replace(/[^0-9.]/g, '');
}

function calcularSubRede() {
    const ipInput = document.getElementById('subrede-ip');
    const cidrSelect = document.getElementById('subrede-cidr');
    const containerResultados = document.getElementById('subredes-resultados');

    if (!ipInput || !cidrSelect || !containerResultados) return;

    filtrarEntradaIP(ipInput);
    const ipStr = ipInput.value;

    // Expressão regular simples para validação visual do IP
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipRegex.test(ipStr)) {
        containerResultados.style.display = 'none';
        return;
    }

    try {
        const cidr = parseInt(cidrSelect.value, 10);
        const ipInt = ipParaInteiro(ipStr);
        
        // Máscara de bits (evita overflow em deslocamentos de 32 bits)
        const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        
        const redeInt = (ipInt & maskInt) >>> 0;
        const broadcastInt = (redeInt | ~maskInt) >>> 0;
        
        let totalIps = Math.pow(2, 32 - cidr);
        let hostsUteis = cidr >= 31 ? 0 : totalIps - 2; // Tratamento para sub-redes ponta a ponta /31 e /32

        let primeiroIpInt = cidr >= 31 ? redeInt : redeInt + 1;
        let ultimoIpInt = cidr >= 31 ? broadcastInt : broadcastInt - 1;

        // Atualização do DOM com os dados de bolso
        document.getElementById('res-rede').textContent = `${inteiroParaIp(redeInt)} /${cidr}`;
        document.getElementById('res-mascara').textContent = inteiroParaIp(maskInt);
        document.getElementById('res-primeiro-ip').textContent = inteiroParaIp(primeiroIpInt);
        document.getElementById('res-ultimo-ip').textContent = inteiroParaIp(ultimoIpInt);
        document.getElementById('res-broadcast').textContent = inteiroParaIp(broadcastInt);
        document.getElementById('res-total-ips').textContent = totalIps.toLocaleString('pt-BR');
        document.getElementById('res-hosts-uteis').textContent = hostsUteis > 0 ? hostsUteis.toLocaleString('pt-BR') : 'Nenhum (Sub-rede Ponto-a-Ponto)';
        document.getElementById('res-classe').textContent = identificarClasse(ipStr);
        document.getElementById('res-binario').textContent = inteiroParaBinarioStr(ipInt);
        document.getElementById('res-mascara-binario').textContent = inteiroParaBinarioStr(maskInt);

        containerResultados.style.display = 'block';
    } catch (error) {
        console.error("Erro no cálculo de sub-rede: ", error);
    }
}

function limparTodosCamposSubredes() {
    const ipInput = document.getElementById('subrede-ip');
    const cidrSelect = document.getElementById('subrede-cidr');
    const containerResultados = document.getElementById('subredes-resultados');

    if (ipInput) ipInput.value = '';
    if (cidrSelect) cidrSelect.value = 24; // Reseta para o padrão
    if (containerResultados) containerResultados.style.display = 'none';
}

function inicializarCalculadoraSubredes() {
    popularSelectCIDR();

    const ipInput = document.getElementById('subrede-ip');
    const cidrSelect = document.getElementById('subrede-cidr');

    if (ipInput) {
        ipInput.addEventListener('input', calcularSubRede);
    }
    if (cidrSelect) {
        cidrSelect.addEventListener('change', calcularSubRede);
    }

    // Executa uma vez na inicialização para preencher os dados de exemplo
    calcularSubRede();
}

// Inicializa a escuta dos elementos
inicializarCalculadoraSubredes();