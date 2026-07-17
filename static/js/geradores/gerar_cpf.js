// Controle de Abas do módulo de CPF (Exibe/Oculta os grupos de botões corretos)
function alternarAbaCPF(idAba) {
    // 1. Alterna as workspaces visíveis
    document.querySelectorAll('.cpf-workspace.tab-content').forEach(aba => {
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
    const grupoGerar = document.getElementById('grupo-acoes-gerar');
    const grupoValidar = document.getElementById('grupo-acoes-validar');

    if (idAba === 'aba-gerar') {
        if (grupoGerar) grupoGerar.style.display = 'flex';
        if (grupoValidar) grupoValidar.style.display = 'none';
        dispararGeracaoCPF();
    } else {
        if (grupoGerar) grupoGerar.style.display = 'none';
        if (grupoValidar) grupoValidar.style.display = 'flex';
        focarEResetarValidador();
    }
}

// Geração de CPF
function dispararGeracaoCPF() {
    const formatar = document.getElementById("cpf-formatar")?.checked;
    const output = document.getElementById("cpf-resultado");
    if (!output) return;
    output.value = gerarCPFValido(formatar);
}

function gerarCPFValido(comPontuacao = true) {
    const randomDigit = () => Math.floor(Math.random() * 9);
    const n = Array.from({ length: 9 }, randomDigit);

    let d1 = n.reduce((acc, num, idx) => acc + num * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;

    const nComD1 = [...n, d1];
    let d2 = nComD1.reduce((acc, num, idx) => acc + num * (11 - idx), 0);
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;

    const cpfLimpo = `${n.join('')}${d1}${d2}`;
    if (comPontuacao) {
        return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpfLimpo;
}

// --- SISTEMA DE VALIDAÇÃO DE CPF ---

// Aplica máscara automática ao digitar: 000.000.000-00
function aplicarMascaraCPF(input) {
    let valor = input.value.replace(/\D/g, ""); // Remove tudo o que não for número
    if (valor.length > 11) valor = valor.slice(0, 11);

    // Formata dinamicamente
    if (valor.length > 9) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
    } else if (valor.length > 3) {
        valor = valor.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
    }
    input.value = valor;
}

// Algoritmo Matemático de Validação
function validarCPFMatematico(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) return false;

    // Impede CPFs com todos os números repetidos (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    const n = cpfLimpo.split("").map(Number);

    // Valida 1º dígito verificador
    let d1 = n.slice(0, 9).reduce((acc, num, idx) => acc + num * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    if (d1 !== n[9]) return false;

    // Valida 2º dígito verificador
    let d2 = n.slice(0, 10).reduce((acc, num, idx) => acc + num * (11 - idx), 0);
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;
    if (d2 !== n[10]) return false;

    return true;
}

// Atualiza o estado visual da tela de validação
function atualizarFeedbackValidacao() {
    const input = document.getElementById("cpf-input-validar");
    const feedback = document.getElementById("cpf-validation-feedback");
    if (!input || !feedback) return;

    const valor = input.value.replace(/\D/g, "");

    if (valor.length === 0) {
        feedback.textContent = "Aguardando entrada...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    if (valor.length < 11) {
        feedback.textContent = "CPF incompleto...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    const isValid = validarCPFMatematico(valor);

    if (isValid) {
        feedback.textContent = "🟢 CPF Válido!";
        feedback.className = "validation-feedback valid";
        input.style.color = "#28a745";
    } else {
        feedback.textContent = "🔴 CPF Inválido!";
        feedback.className = "validation-feedback invalid";
        input.style.color = "#dc3545";
    }
}

function focarEResetarValidador() {
    const input = document.getElementById("cpf-input-validar");
    if (input) {
        input.value = "";
        input.focus();
    }
    atualizarFeedbackValidacao();
}

// Configuração de ouvintes de eventos para o módulo CPF
function inicializarEventosCPF() {
    const inputValidar = document.getElementById("cpf-input-validar");
    if (inputValidar) {
        // Formatação em tempo de execução
        inputValidar.addEventListener("input", function() {
            aplicarMascaraCPF(this);
            atualizarFeedbackValidacao();
        });
    }
}

// Inicializações
inicializarEventosCPF();
dispararGeracaoCPF();