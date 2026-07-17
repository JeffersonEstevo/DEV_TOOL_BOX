// Controle de Abas do módulo de CEP (Exibe/Oculta os grupos de botões corretos)
function alternarAbaCEP(idAba) {
    // 1. Alterna as workspaces visíveis
    document.querySelectorAll('.cep-workspace.tab-content').forEach(aba => {
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
    const grupoGerar = document.getElementById('grupo-cep-acoes-gerar');
    const grupoValidar = document.getElementById('grupo-cep-acoes-validar');

    if (idAba === 'aba-cep-gerar') {
        if (grupoGerar) grupoGerar.style.display = 'flex';
        if (grupoValidar) grupoValidar.style.display = 'none';
        dispararGeracaoCEP();
    } else {
        if (grupoGerar) grupoGerar.style.display = 'none';
        if (grupoValidar) grupoValidar.style.display = 'flex';
        focarEResetarValidadorCEP();
    }
}

// Geração de CEP
function dispararGeracaoCEP() {
    const formatar = document.getElementById("cep-formatar")?.checked;
    const output = document.getElementById("cep-resultado");
    if (!output) return;
    output.value = gerarCEPValido(formatar);
}

function gerarCEPValido(comPontuacao = true) {
    const prefixosValidos = ["010", "130", "200", "301", "400", "500", "600", "700", "800", "900"];
    const prefixoAleatorio = prefixosValidos[Math.floor(Math.random() * prefixosValidos.length)];
    
    const randomDigit = () => Math.floor(Math.random() * 10);
    const sufixo = Array.from({ length: 5 }, randomDigit).join('');
    
    const cepLimpo = `${prefixoAleatorio}${sufixo}`;

    if (comPontuacao) {
        return cepLimpo.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    return cepLimpo;
}

// --- SISTEMA DE VALIDAÇÃO DE CEP ---

// Aplica máscara automática ao digitar: 00000-000
function aplicarMascaraCEP(input) {
    let valor = input.value.replace(/\D/g, ""); // Remove tudo o que não for número
    if (valor.length > 8) valor = valor.slice(0, 8);

    // Formata dinamicamente
    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d{1,3})$/, "$1-$2");
    }
    input.value = valor;
}

// Algoritmo de Validação por Faixas Oficiais e Retorno do Estado
function validarCEPMatematico(cep) {
    const cepLimpo = cep.replace(/\D/g, "");
    
    if (cepLimpo.length !== 8) return false;
    if (/^(\d)\1{7}$/.test(cepLimpo)) return false;

    const prefixo = parseInt(cepLimpo.slice(0, 5), 10);

    // Mapeamento exato das faixas de CEP por Estado
    if (prefixo >= 1000 && prefixo <= 19999) return "SP";
    if (prefixo >= 20000 && prefixo <= 28999) return "RJ";
    if (prefixo >= 29000 && prefixo <= 29999) return "ES";
    if (prefixo >= 30000 && prefixo <= 39999) return "MG";
    if (prefixo >= 40000 && prefixo <= 48999) return "BA";
    if (prefixo >= 49000 && prefixo <= 49999) return "SE";
    if (prefixo >= 50000 && prefixo <= 56999) return "PE";
    if (prefixo >= 57000 && prefixo <= 57999) return "AL";
    if (prefixo >= 58000 && prefixo <= 58999) return "PB";
    if (prefixo >= 59000 && prefixo <= 59999) return "RN";
    if (prefixo >= 60000 && prefixo <= 63999) return "CE";
    if (prefixo >= 64000 && prefixo <= 64999) return "PI";
    if (prefixo >= 65000 && prefixo <= 65999) return "MA";
    if (prefixo >= 66000 && prefixo <= 68899) return "PA";
    if (prefixo >= 68900 && prefixo <= 68999) return "AP";
    if (prefixo >= 69000 && prefixo <= 69299) return "AM";
    if (prefixo >= 69300 && prefixo <= 69399) return "RR";
    if (prefixo >= 69400 && prefixo <= 69899) return "AM";
    if (prefixo >= 69900 && prefixo <= 69999) return "AC";
    if (prefixo >= 70000 && prefixo <= 73699) return "DF";
    if (prefixo >= 73700 && prefixo <= 76799) return "GO";
    if (prefixo >= 76800 && prefixo <= 76999) return "RO";
    if (prefixo >= 77000 && prefixo <= 77999) return "TO";
    if (prefixo >= 78000 && prefixo <= 78899) return "MT";
    if (prefixo >= 78900 && prefixo <= 78999) return "RO";
    if (prefixo >= 79000 && prefixo <= 79999) return "MS";
    if (prefixo >= 80000 && prefixo <= 87999) return "PR";
    if (prefixo >= 88000 && prefixo <= 89999) return "SC";
    if (prefixo >= 90000 && prefixo <= 99999) return "RS";

    return false; // Caso não se enquadre em nenhuma faixa real
}

// Atualiza o estado visual da tela de validação com o nome do Estado
function atualizarFeedbackValidacaoCEP() {
    const input = document.getElementById("cep-input-validar");
    const feedback = document.getElementById("cep-validation-feedback");
    if (!input || !feedback) return;

    const valor = input.value.replace(/\D/g, "");

    if (valor.length === 0) {
        feedback.textContent = "Aguardando entrada...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    if (valor.length < 8) {
        feedback.textContent = "CEP incompleto...";
        feedback.className = "validation-feedback neutral";
        input.style.color = "var(--text-main)";
        return;
    }

    const estadoDetectado = validarCEPMatematico(valor);

    if (estadoDetectado) {
        feedback.textContent = `🟢 CEP Válido! Localidade: ${estadoDetectado}`;
        feedback.className = "validation-feedback valid";
        input.style.color = "#28a745";
    } else {
        feedback.textContent = "🔴 CEP Inválido! Faixa inexistente.";
        feedback.className = "validation-feedback invalid";
        input.style.color = "#dc3545";
    }
}

function focarEResetarValidadorCEP() {
    const input = document.getElementById("cep-input-validar");
    if (input) {
        input.value = "";
        input.focus();
    }
    atualizarFeedbackValidacaoCEP();
}

// Configuração de ouvintes de eventos de digitação para o módulo CEP
function inicializarEventosCEP() {
    const inputValidar = document.getElementById("cep-input-validar");
    if (inputValidar) {
        // Remove para evitar duplicar em reinicializações da aba e adiciona o listener de digitação
        inputValidar.removeEventListener("input", lidarComInputCEP);
        inputValidar.addEventListener("input", lidarComInputCEP);
    }
}

function lidarComInputCEP() {
    aplicarMascaraCEP(this);
    atualizarFeedbackValidacaoCEP();
}

// Execuções imediatas disparadas na carga do script pelo contentLoader
inicializarEventosCEP();
dispararGeracaoCEP();