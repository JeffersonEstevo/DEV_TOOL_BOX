// Controle de Abas do módulo de UUID
function alternarAbaUUID(idAba) {
    document.querySelectorAll('.uuid-workspace.tab-content').forEach(aba => {
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

    const grupoGerar = document.getElementById('grupo-uuid-acoes-gerar');
    const grupoValidar = document.getElementById('grupo-uuid-acoes-validar');

    if (idAba === 'aba-uuid-gerar') {
        if (grupoGerar) grupoGerar.style.display = 'flex';
        if (grupoValidar) grupoValidar.style.display = 'none';
        dispararGeracaoUUID();
    } else {
        if (grupoGerar) grupoGerar.style.display = 'none';
        if (grupoValidar) grupoValidar.style.display = 'flex';
        focarEResetarValidadorUUID();
        inicializarEventosUUID();
    }
}

// Geração de UUID (Suporta v4 e v7)
function dispararGeracaoUUID() {
    const maiusculo = document.getElementById("uuid-maiusculo")?.checked;
    const versaoElement = document.querySelector('input[name="versao-uuid"]:checked');
    const versao = versaoElement ? versaoElement.value : 'v4';
    const output = document.getElementById("uuid-resultado");

    if (!output) return;

    let uuid = (versao === 'v7') ? gerarUUIDv7() : gerarUUIDv4();
    output.value = maiusculo ? uuid.toUpperCase() : uuid.toLowerCase();
}

function gerarUUIDv4() {
    const cryptoObj = window.crypto || window.msCrypto;
    if (cryptoObj && cryptoObj.randomUUID) {
        return cryptoObj.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function gerarUUIDv7() {
    const arr = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(arr);
    } else {
        for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
    }

    const timestamp = Date.now(); // 48-bit timestamp
    
    arr[0] = (timestamp >> 40) & 0xff;
    arr[1] = (timestamp >> 32) & 0xff;
    arr[2] = (timestamp >> 24) & 0xff;
    arr[3] = (timestamp >> 16) & 0xff;
    arr[4] = (timestamp >> 8) & 0xff;
    arr[5] = timestamp & 0xff;

    arr[6] = (arr[6] & 0x0f) | 0x70; // Versão 7
    arr[8] = (arr[8] & 0x3f) | 0x80; // Variante RFC 4122

    const token = (idx) => arr[idx].toString(16).padStart(2, '0');

    return `${token(0)}${token(1)}${token(2)}${token(3)}-${token(4)}${token(5)}-${token(6)}${token(7)}-${token(8)}${token(9)}-${token(10)}${token(11)}${token(12)}${token(13)}${token(14)}${token(15)}`;
}

// --- VALIDAÇÃO E EXTRAÇÃO DE METADADOS ---

function detectarVersaoUUID(uuid) {
    const uuidLimpo = uuid.trim().toLowerCase();
    // Expressão regular padrão para validar estrutura básica do UUID (8-4-4-4-12 hex)
    const regexValida = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    
    if (!regexValida.test(uuidLimpo)) return null;

    // O caractere na posição 14 indica a versão do UUID
    return uuidLimpo.charAt(14);
}

function atualizarFeedbackValidacaoUUID() {
    const input = document.getElementById("uuid-input-validar");
    const feedback = document.getElementById("uuid-validation-feedback");
    if (!input || !feedback) return;

    const valor = input.value.trim();

    if (valor.length === 0) {
        feedback.textContent = "Aguardando entrada...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    if (valor.length < 36) {
        feedback.textContent = "Estrutura do UUID incompleta (esperado 36 caracteres)...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    const versao = detectarVersaoUUID(valor);

    if (versao) {
        feedback.textContent = `🟢 UUID Válido! Versão Detectada: v${versao}`;
        feedback.className = "validation-feedback valid";
        input.style.color = "#28a745";
    } else {
        feedback.textContent = "🔴 Estrutura de UUID Inválida!";
        feedback.className = "validation-feedback invalid";
        input.style.color = "#dc3545";
    }
}

function focarEResetarValidadorUUID() {
    const input = document.getElementById("uuid-input-validar");
    if (input) {
        input.value = "";
        input.focus();
    }
    atualizarFeedbackValidacaoUUID();
}

function inicializarEventosUUID() {
    const inputValidar = document.getElementById("uuid-input-validar");
    if (inputValidar) {
        inputValidar.removeEventListener("input", atualizarFeedbackValidacaoUUID);
        inputValidar.addEventListener("input", atualizarFeedbackValidacaoUUID);
    }

    const radios = document.querySelectorAll('input[name="versao-uuid"]');
    radios.forEach(radio => {
        radio.removeEventListener("change", dispararGeracaoUUID);
        radio.addEventListener("change", dispararGeracaoUUID);
    });

    const checkMaiusculo = document.getElementById("uuid-maiusculo");
    if (checkMaiusculo) {
        checkMaiusculo.removeEventListener("change", dispararGeracaoUUID);
        checkMaiusculo.addEventListener("change", dispararGeracaoUUID);
    }
}

// Inicializações automáticas via contentLoader
inicializarEventosUUID();
dispararGeracaoUUID();