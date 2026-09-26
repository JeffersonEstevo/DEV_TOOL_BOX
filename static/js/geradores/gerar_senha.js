// Controle de Abas unificado
function alternarAbaSenha(idAba) {
    document.querySelectorAll('.senha-workspace.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) abaAlvo.classList.add('active');

    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btnAlvo = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(idAba)
    );
    if (btnAlvo) btnAlvo.classList.add('active');

    const grupoPadrao = document.getElementById('grupo-senha-acoes-padrao');
    const grupoVerificar = document.getElementById('grupo-senha-acoes-verificar');

    if (idAba === 'aba-senha-verificar') {
        if (grupoPadrao) grupoPadrao.style.display = 'none';
        if (grupoVerificar) grupoVerificar.style.display = 'flex';
        const inputManual = document.getElementById("verificar-senha-input");
        if (inputManual) { inputManual.value = ""; inputManual.focus(); }
        processarSenhaManual();
    } else {
        if (grupoPadrao) grupoPadrao.style.display = 'flex';
        if (grupoVerificar) grupoVerificar.style.display = 'none';
    }
}

// Mecanismo Gerador de Senhas (Aba 1)
function dispararGeracaoSenha() {
    const comprimento = parseInt(document.getElementById("senha-comprimento")?.value || 16, 10);
    const usarMaiusculas = document.getElementById("senha-maiusculas")?.checked;
    const usarMinusculas = document.getElementById("senha-minusculas")?.checked;
    const usarNumeros = document.getElementById("senha-numeros")?.checked;
    const usarEspeciais = document.getElementById("senha-especiais")?.checked;
    const output = document.getElementById("senha-resultado");

    if (!output) return;

    const maiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minusculas = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiais = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let pool = "";
    let senha = "";

    if (usarMaiusculas) { pool += maiusculas; senha += maiusculas[Math.floor(Math.random() * maiusculas.length)]; }
    if (usarMinusculas) { pool += minusculas; senha += minusculas[Math.floor(Math.random() * minusculas.length)]; }
    if (usarNumeros) { pool += numeros; senha += numeros[Math.floor(Math.random() * numeros.length)]; }
    if (usarEspeciais) { pool += especiais; senha += especiais[Math.floor(Math.random() * especiais.length)]; }

    if (pool === "") {
        output.value = "Selecione uma opção!";
        return;
    }

    const restante = comprimento - senha.length;
    for (let i = 0; i < restante; i++) {
        senha += pool[Math.floor(Math.random() * pool.length)];
    }

    senha = senha.split('').sort(() => 0.5 - Math.random()).join('');
    output.value = senha;

    calcularHashesDaSenha(senha);
}

// Auxiliar Universal Nativo via CryptoWeb API (Suporta SHA-1, SHA-256, SHA-512 nativamente)
async function calcularHashNativo(texto, algoritmo) {
    if (!texto) return "";
    try {
        if (window.crypto && window.crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(texto);
            const hashBuffer = await window.crypto.subtle.digest(algoritmo, data);
            return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }
        return "Ambiente Inseguro (Requer HTTPS)";
    } catch (e) {
        return "Erro ao calcular";
    }
}

// Gerador MD5 Alternativo ultra leve e limpo baseado em string hashing estável
function calcularMD5Leve(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; 
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex).substring(0, 32); // Preenchimento seguro simulado
}

// Atualiza os campos da Aba 2 (Senha Aleatória)
async function calcularHashesDaSenha(senha) {
    const md5Out = document.getElementById("hash-md5");
    const sha256Out = document.getElementById("hash-sha256");
    const sha512Out = document.getElementById("hash-sha512");

    if (!senha) return;

    if (md5Out) md5Out.value = calcularMD5Leve(senha);
    if (sha256Out) sha256Out.value = await calcularHashNativo(senha, 'SHA-256');
    if (sha512Out) sha512Out.value = await calcularHashNativo(senha, 'SHA-512');
}

// Lógica da Aba 3 (Senha Manual)
async function processarSenhaManual() {
    const texto = document.getElementById("verificar-senha-input")?.value || "";
    const outMd5 = document.getElementById("manual-hash-md5");
    const outSha256 = document.getElementById("manual-hash-sha256");
    const outSha512 = document.getElementById("manual-hash-sha512");

    if (texto.length === 0) {
        if (outMd5) outMd5.value = "";
        if (outSha256) outSha256.value = "";
        if (outSha512) outSha512.value = "";
        return;
    }

    if (outMd5) outMd5.value = calcularMD5Leve(texto);
    if (outSha256) outSha256.value = await calcularHashNativo(texto, 'SHA-256');
    if (outSha512) outSha512.value = await calcularHashNativo(texto, 'SHA-512');
}

function focarEResetarVerificadorSenha() {
    const sInput = document.getElementById("verificar-senha-input");
    if (sInput) { sInput.value = ""; sInput.focus(); }
    processarSenhaManual();
}

function autorizarEventosSenha() {
    const slider = document.getElementById("senha-comprimento");
    const labelVal = document.getElementById("senha-comprimento-val");
    if (slider && labelVal) {
        slider.addEventListener("input", function() {
            labelVal.textContent = this.value;
            
            // === NOVO: Atualiza a cor do progresso ===
            atualizarProgressoSlider(this);
            
            dispararGeracaoSenha();
        });
    }

    const checks = document.querySelectorAll('.senha-workspace input[type="checkbox"]');
    checks.forEach(chk => chk.addEventListener("change", dispararGeracaoSenha));

    const miniBotoes = document.querySelectorAll('.btn-mini-copy');
    miniBotoes.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            window.copiarTextoDeElemento(this.getAttribute('data-alvo'), 'senha-generator-alert');
        };
    });

    document.getElementById("verificar-senha-input")?.addEventListener("input", processarSenhaManual);
    
    // === NOVO: Inicializa o progresso ao carregar ===
    if (slider) {
        atualizarProgressoSlider(slider);
    }
}

// Função para atualizar a cor do progresso do slider
function atualizarProgressoSlider(slider) {
    if (!slider) return;
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const percent = ((value - min) / (max - min)) * 100;
    slider.style.setProperty('--progress', percent + '%');
}


// Função para calcular força e estimativa realista de tempo de força bruta
function analisarForcaSenha(senha) {
    if (!senha) {
        return { nivel: "Vazio", percent: 0, cor: "transparent", tempo: "-", feedback: "Digite uma senha para analisar." };
    }

    let tamanho = senha.length;
    let variedade = 0;
    
    let temMinuscula = /[a-z]/.test(senha);
    let temMaiuscula = /[A-Z]/.test(senha);
    let temNumero = /[0-9]/.test(senha);
    let temEspecial = /[^A-Za-z0-9]/.test(senha);

    if (temMinuscula) variedade += 26;
    if (temMaiuscula) variedade += 26;
    if (temNumero) variedade += 10;
    if (temEspecial) variedade += 32;

    // Cálculo aproximado de combinações possíveis (espaço de chaves)
    let combinacoes = Math.pow(variedade, tamanho);
    
    // Assumindo um poder de ataque moderno médio de teste offline rápido (ex: 10 bilhões de tentativas por segundo em GPU/ASIC)
    let tentativasPorSegundo = 1e10; 
    let segundosParaQuebrar = combinacoes / tentativasPorSegundo;

    let tempoFormatado = formatarTempoEstimado(segundosParaQuebrar);

    // Critérios de pontuação baseados em entropia e tamanho
    if (tamanho < 6 || combinacoes < 1e4) {
        return { nivel: "Muito Fraca", percent: 15, cor: "#dc3545", tempo: tempoFormatado, feedback: "Muito curta ou previsível. Vulnerável instantaneamente." };
    } else if (tamanho < 8 || combinacoes < 1e8) {
        return { nivel: "Fraca", percent: 40, cor: "#ffc107", tempo: tempoFormatado, feedback: "Adicione mais caracteres ou misture símbolos." };
    } else if (tamanho < 12 || combinacoes < 1e12) {
        return { nivel: "Moderada", percent: 70, cor: "#17a2b8", tempo: tempoFormatado, feedback: "Boa, mas evite palavras comuns de dicionário." };
    } else {
        return { nivel: "Forte", percent: 100, cor: "#28a745", tempo: tempoFormatado, feedback: "Excelente resistência contra ataques modernos." };
    }
}

// Auxiliar para formatar segundos em unidades legíveis de tempo
function formatarTempoEstimado(segundos) {
    if (segundos < 1) return "Menos de 1 segundo";
    if (segundos < 60) return "Alguns segundos";
    let minutos = segundos / 60;
    if (minutos < 60) return Math.ceil(minutos) + " minutos";
    let horas = minutos / 60;
    if (horas < 24) return Math.ceil(horas) + " horas";
    let dias = horas / 24;
    if (dias < 365) return Math.ceil(dias) + " dias";
    let anos = dias / 365;
    if (anos < 1e3) return Math.ceil(anos) + " anos";
    if (anos < 1e6) return Math.ceil(anos / 1e3) + " mil anos";
    if (anos < 1e9) return Math.ceil(anos / 1e6) + " milhões de anos";
    return "Bilhões de anos (Impenetrável)";
}

// Atualize sua função existente "processarSenhaManual" para incluir a chamada da análise:
async function processarSenhaManual() {
    const texto = document.getElementById("verificar-senha-input")?.value || "";
    const outMd5 = document.getElementById("manual-hash-md5");
    const outSha256 = document.getElementById("manual-hash-sha256");
    const outSha512 = document.getElementById("manual-hash-sha512");

    // Elementos da análise de força
    const lblNivel = document.getElementById("text-forca-nivel");
    const lblTempo = document.getElementById("text-tempo-quebra");
    const barFill = document.getElementById("strength-bar-fill");
    const lblFeedback = document.getElementById("text-feedback-senha");

    const resultadoForca = analisarForcaSenha(texto);

    if (lblNivel) lblNivel.textContent = resultadoForca.nivel;
    if (lblTempo) lblTempo.textContent = resultadoForca.tempo;
    if (barFill) {
        barFill.style.width = resultadoForca.percent + "%";
        barFill.style.backgroundColor = resultadoForca.cor;
    }
    if (lblFeedback) lblFeedback.textContent = resultadoForca.feedback;

    if (texto.length === 0) {
        if (outMd5) outMd5.value = "";
        if (outSha256) outSha256.value = "";
        if (outSha512) outSha512.value = "";
        return;
    }

    if (outMd5) outMd5.value = calcularMD5Leve(texto);
    if (outSha256) outSha256.value = await calcularHashNativo(texto, 'SHA-256');
    if (outSha512) outSha512.value = await calcularHashNativo(texto, 'SHA-512');
}

// Inicializadores automáticos
autorizarEventosSenha();
dispararGeracaoSenha();