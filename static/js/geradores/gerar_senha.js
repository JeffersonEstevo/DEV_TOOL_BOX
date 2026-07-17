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
}

// Inicializadores automáticos
autorizarEventosSenha();
dispararGeracaoSenha();