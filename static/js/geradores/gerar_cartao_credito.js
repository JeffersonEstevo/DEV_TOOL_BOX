// Controle de Abas do módulo de Cartão de Crédito
function alternarAbaCartao(idAba) {
    document.querySelectorAll('.cartao-workspace.tab-content').forEach(aba => {
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

    const grupoGerar = document.getElementById('grupo-cartao-acoes-gerar');
    const grupoValidar = document.getElementById('grupo-cartao-acoes-validar');

    if (idAba === 'aba-cartao-gerar') {
        if (grupoGerar) grupoGerar.style.display = 'flex';
        if (grupoValidar) grupoValidar.style.display = 'none';
        dispararGeracaoCartao();
    } else {
        if (grupoGerar) grupoGerar.style.display = 'none';
        if (grupoValidar) grupoValidar.style.display = 'flex';
        focarEResetarValidadorCartao();
        inicializarEventosCartao();
    }
}

// Geração de Cartão de Crédito
function dispararGeracaoCartao() {
    const formatar = document.getElementById("cartao-formatar")?.checked;
    const bandeiraElement = document.querySelector('input[name="bandeira-cartao"]:checked');
    const bandeira = bandeiraElement ? bandeiraElement.value : 'visa';
    const output = document.getElementById("cartao-resultado");

    if (!output) return;
    output.value = gerarCartaoValido(bandeira, formatar);
}

function gerarCartaoValido(bandeira = 'visa', comEspacos = true) {
    let numeroBase = [];
    let tamanhoTotal = 16;

    if (bandeira === 'visa') {
        numeroBase.push(4);
    } else if (bandeira === 'mastercard') {
        const prefixos = [51, 52, 53, 54, 55];
        const pref = prefixos[Math.floor(Math.random() * prefixos.length)].toString();
        numeroBase.push(...pref.split('').map(Number));
    } else if (bandeira === 'amex') {
        tamanhoTotal = 15;
        const prefixos = [34, 37];
        const pref = prefixos[Math.floor(Math.random() * prefixos.length)].toString();
        numeroBase.push(...pref.split('').map(Number));
    } else if (bandeira === 'elo') {
        const prefixos = [401178, 431274, 438935, 451416, 457631, 504175];
        const pref = prefixos[Math.floor(Math.random() * prefixos.length)].toString();
        numeroBase.push(...pref.split('').map(Number));
    } else if (bandeira === 'hipercard') {
        const prefixos = [606282, 637095, 637568];
        const pref = prefixos[Math.floor(Math.random() * prefixos.length)].toString();
        numeroBase.push(...pref.split('').map(Number));
    }

    const tamanhoFaltante = tamanhoTotal - 1 - numeroBase.length;
    for (let i = 0; i < tamanhoFaltante; i++) {
        numeroBase.push(Math.floor(Math.random() * 10));
    }

    let soma = 0;
    const nInvertido = [...numeroBase].reverse();
    for (let i = 0; i < nInvertido.length; i++) {
        let d = nInvertido[i];
        if (i % 2 === 0) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        soma += d;
    }

    const digitoVerificador = (10 - (soma % 10)) % 10;
    numeroBase.push(digitoVerificador);
    const numeroLimpo = numeroBase.join('');

    if (comEspacos) {
        if (bandeira === 'amex') {
            return numeroLimpo.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
        }
        return numeroLimpo.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    return numeroLimpo;
}

// --- SISTEMA DE VALIDAÇÃO E IDENTIFICAÇÃO ---

function aplicarMascaraCartao(input) {
    let valor = input.value.replace(/\D/g, "");
    const info = detectarBandeiraEExtensao(valor);
    
    if (valor.length > info.tamanhoMax) valor = valor.slice(0, info.tamanhoMax);

    if (info.bandeira === "Amex") {
        if (valor.length > 10) {
            valor = valor.replace(/^(\d{4})(\d{6})(\d{1,5})$/, "$1 $2 $3");
        } else if (valor.length > 4) {
            valor = valor.replace(/^(\d{4})(\d{1,6})$/, "$1 $2");
        }
    } else {
        valor = valor.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    input.value = valor;
}

function detectarBandeiraEExtensao(numeroLimpo) {
    let bandeira = "Desconhecida";
    let tamanhoMax = 16;

    if (/^4/.test(numeroLimpo)) { bandeira = "Visa"; }
    else if (/^(5[1-5]|2[2-7])/.test(numeroLimpo)) { bandeira = "Mastercard"; }
    else if (/^3[47]/.test(numeroLimpo)) { bandeira = "Amex"; tamanhoMax = 15; }
    else if (/^(401178|431274|438935|451416|457631|504175|636368|636297)/.test(numeroLimpo)) { bandeira = "Elo"; }
    else if (/^(606282|637095|637568|60)/.test(numeroLimpo)) { bandeira = "Hipercard"; }
    else if (/^3(?:0[0-5]|[68])/.test(numeroLimpo)) { bandeira = "Diners Club"; tamanhoMax = 14; }

    return { bandeira, tamanhoMax };
}

function validarAlgoritmoLuhn(numeroLimpo) {
    let soma = 0;
    let alternar = false;
    for (let i = numeroLimpo.length - 1; i >= 0; i--) {
        let n = parseInt(numeroLimpo.charAt(i), 10);
        if (alternar) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        soma += n;
        alternar = !alternar;
    }
    return (soma % 10) === 0;
}

function atualizarFeedbackValidacaoCartao() {
    const input = document.getElementById("cartao-input-validar");
    const feedback = document.getElementById("cartao-validation-feedback");
    if (!input || !feedback) return;

    const valor = input.value.replace(/\D/g, "");
    if (valor.length === 0) {
        feedback.textContent = "Aguardando entrada...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    const info = detectarBandeiraEExtensao(valor);

    if (valor.length < 14) {
        feedback.textContent = `Identificando: ${info.bandeira} (Incompleto...)`;
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    const isValid = validarAlgoritmoLuhn(valor);
    if (isValid) {
        feedback.textContent = `🟢 Cartão Válido! Bandeira: ${info.bandeira}`;
        feedback.className = "validation-feedback valid";
        input.style.color = "#28a745";
    } else {
        feedback.textContent = `🔴 Cartão Inválido (Luhn)! Bandeira: ${info.bandeira}`;
        feedback.className = "validation-feedback invalid";
        input.style.color = "#dc3545";
    }
}

function focarEResetarValidadorCartao() {
    const input = document.getElementById("cartao-input-validar");
    if (input) {
        input.value = "";
        input.focus();
    }
    atualizarFeedbackValidacaoCartao();
}

function inicializarEventosCartao() {
    const inputValidar = document.getElementById("cartao-input-validar");
    if (inputValidar) {
        inputValidar.removeEventListener("input", lidarComInputCartao);
        inputValidar.addEventListener("input", lidarComInputCartao);
    }
    
    const radios = document.querySelectorAll('input[name="bandeira-cartao"]');
    radios.forEach(radio => {
        radio.removeEventListener("change", dispararGeracaoCartao);
        radio.addEventListener("change", dispararGeracaoCartao);
    });

    const checkFormatar = document.getElementById("cartao-formatar");
    if (checkFormatar) {
        checkFormatar.removeEventListener("change", dispararGeracaoCartao);
        checkFormatar.addEventListener("change", dispararGeracaoCartao);
    }
}

function lidarComInputCartao() {
    aplicarMascaraCartao(this);
    atualizarFeedbackValidacaoCartao();
}

// Inicializações Automáticas via ContentLoader
inicializarEventosCartao();
dispararGeracaoCartao();