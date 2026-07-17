// Controle de Abas do módulo de CNPJ (Exibe/Oculta os grupos de botões corretos)
function alternarAbaCNPJ(idAba) {
    // 1. Alterna as workspaces visíveis
    document.querySelectorAll('.cnpj-workspace.tab-content').forEach(aba => {
        aba.classList.remove('active');
    });
    const abaAlvo = document.getElementById(idAba);
    if (abaAlvo) abaAlvo.classList.add('active');

    // 2. Alterna os estados dos botões da barra de abas superior
    document.querySelectorAll('.rede-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const btnAlvo = Array.from(document.querySelectorAll('.rede-tabs .tab-btn')).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(idAba)
    );
    if (btnAlvo) btnAlvo.classList.add('active');

    // 3. Controle de visibilidade dos grupos de ações na barra inferior
    const grupoGerar = document.getElementById('grupo-cnpj-acoes-gerar');
    const grupoValidar = document.getElementById('grupo-cnpj-acoes-validar');

    if (idAba === 'aba-cnpj-gerar') {
        if (grupoGerar) grupoGerar.style.display = 'flex';
        if (grupoValidar) grupoValidar.style.display = 'none';
        dispararGeracaoCNPJ();
    } else {
        if (grupoGerar) grupoGerar.style.display = 'none';
        if (grupoValidar) grupoValidar.style.display = 'flex';
        focarEResetarValidadorCNPJ();
        inicializarEventosCNPJ();
    }
}

// Geração de CNPJ
function dispararGeracaoCNPJ() {
    const formatar = document.getElementById("cnpj-formatar")?.checked;
    const output = document.getElementById("cnpj-resultado");
    if (!output) return;
    output.value = gerarCNPJValido(formatar);
}

function gerarCNPJValido(comPontuacao = true) {
    const randomDigit = () => Math.floor(Math.random() * 9);
    
    const n = Array.from({ length: 8 }, randomDigit);
    const cnpjBase = [...n, 0, 0, 0, 1];

    const pesosD1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let d1 = cnpjBase.reduce((acc, num, idx) => acc + num * pesosD1[idx], 0);
    d1 = d1 % 11;
    d1 = d1 < 2 ? 0 : 11 - d1;

    const cnpjComD1 = [...cnpjBase, d1];

    const pesosD2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let d2 = cnpjComD1.reduce((acc, num, idx) => acc + num * pesosD2[idx], 0);
    d2 = d2 % 11;
    d2 = d2 < 2 ? 0 : 11 - d2;

    const cnpjLimpo = `${cnpjBase.join('')}${d1}${d2}`;

    if (comPontuacao) {
        return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    }
    return cnpjLimpo;
}

// --- SISTEMA DE VALIDAÇÃO DE CNPJ ---

// Aplica máscara automática ao digitar: 00.000.000/0001-00
function aplicarMascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, "");
    if (valor.length > 14) valor = valor.slice(0, 14);

    // Formata dinamicamente à medida que digita
    if (valor.length > 12) {
        valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, "$1.$2.$3/$4-$5");
    } else if (valor.length > 8) {
        valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, "$1.$2.$3/$4");
    } else if (valor.length > 5) {
        valor = valor.replace(/^(\d{2})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{1,3})$/, "$1.$2");
    }
    input.value = valor;
}

// Algoritmo Matemático de Validação de CNPJ
function validarCNPJMatematico(cnpj) {
    const cnpjLimpo = cnpj.replace(/\D/g, "");

    if (cnpjLimpo.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

    const n = cnpjLimpo.split("").map(Number);

    // Valida 1º dígito verificador
    const pesosD1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let d1 = n.slice(0, 12).reduce((acc, num, idx) => acc + num * pesosD1[idx], 0);
    d1 = d1 % 11;
    d1 = d1 < 2 ? 0 : 11 - d1;
    if (d1 !== n[12]) return false;

    // Valida 2º dígito verificador
    const pesosD2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let d2 = n.slice(0, 13).reduce((acc, num, idx) => acc + num * pesosD2[idx], 0);
    d2 = d2 % 11;
    d2 = d2 < 2 ? 0 : 11 - d2;
    if (d2 !== n[13]) return false;

    return true;
}

// Atualiza o estado visual da tela de validação
function atualizarFeedbackValidacaoCNPJ() {
    const input = document.getElementById("cnpj-input-validar");
    const feedback = document.getElementById("cnpj-validation-feedback");
    if (!input || !feedback) return;

    const valor = input.value.replace(/\D/g, "");

    if (valor.length === 0) {
        feedback.textContent = "Aguardando entrada...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    if (valor.length < 14) {
        feedback.textContent = "CNPJ incompleto...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    const isValid = validarCNPJMatematico(valor);

    if (isValid) {
        feedback.textContent = "🟢 CNPJ Válido!";
        feedback.className = "validation-feedback valid";
        input.style.color = "#28a745";
    } else {
        feedback.textContent = "🔴 CNPJ Inválido!";
        feedback.className = "validation-feedback invalid";
        input.style.color = "#dc3545";
    }
}

function focarEResetarValidadorCNPJ() {
    const input = document.getElementById("cnpj-input-validar");
    if (input) {
        input.value = "";
        input.focus();
    }
    atualizarFeedbackValidacaoCNPJ();
}

// Configuração do ouvinte de entrada de digitação para o CNPJ
function inicializarEventosCNPJ() {
    const inputValidar = document.getElementById("cnpj-input-validar");
    if (inputValidar) {
        inputValidar.removeEventListener("input", lidarComInputCNPJ);
        inputValidar.addEventListener("input", lidarComInputCNPJ);
    }
    
    const checkFormatar = document.getElementById("cnpj-formatar");
    if (checkFormatar) {
        checkFormatar.addEventListener("change", dispararGeracaoCNPJ);
    }
}

function lidarComInputCNPJ() {
    aplicarMascaraCNPJ(this);
    atualizarFeedbackValidacaoCNPJ();
}

// Inicializações automáticas na carga do script pelo contentLoader
inicializarEventosCNPJ();
dispararGeracaoCNPJ();