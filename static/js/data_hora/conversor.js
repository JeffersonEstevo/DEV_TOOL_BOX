// ==========================================
// CONSTANTES SEGURAS PARA SPA (WINDOW)
// ==========================================
window.EXCEL_EPOCH_DIFF = window.EXCEL_EPOCH_DIFF || 25569;
window.MS_PER_DAY = window.MS_PER_DAY || 86400000;

var EXCEL_EPOCH_DIFF = window.EXCEL_EPOCH_DIFF;
var MS_PER_DAY = window.MS_PER_DAY;

// ==========================================
// CONTROLE DE NAVEGAÇÃO DAS ABAS
// ==========================================
function alternarAbaDataHora(idAba) {
    // Remove classe ativa de todos os botões e conteúdos
    document.querySelectorAll('.data-hora-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.dh-workspace.tab-content').forEach(content => content.classList.remove('active'));

    // Adiciona classe ativa ao botão clicado e à aba correspondente
    const btnClicado = Array.from(document.querySelectorAll('.data-hora-tabs .tab-btn')).find(btn => {
        const attr = btn.getAttribute('onclick');
        return attr && attr.includes(idAba);
    });
    if (btnClicado) btnClicado.classList.add('active');
    
    const conteudoAba = document.getElementById(idAba);
    if (conteudoAba) conteudoAba.classList.add('active');
}

// ==========================================
// LÓGICA DA ABA 1: HORA ⇄ DECIMAL
// ==========================================
function sincronizarHoraDigital() {
    const inputRelogio = document.getElementById('conv-hora-relogio');
    if (!inputRelogio) return;

    let valor = inputRelogio.value.replace(/[^0-9:]/g, ''); // Permite apenas números e dois pontos
    inputRelogio.value = valor;

    // Formata automaticamente adicionando ':' se o usuário digitar 4 números diretos
    if (valor.length === 4 && !valor.includes(':')) {
        valor = valor.slice(0, 2) + ':' + valor.slice(2);
        inputRelogio.value = valor;
    }

    const partes = valor.split(':');
    const inputDecimal = document.getElementById('conv-hora-decimal');

    if (partes.length === 2 && partes[0] !== '' && partes[1] !== '') {
        const horas = parseInt(partes[0], 10);
        const minutos = parseInt(partes[1], 10);

        if (!isNaN(horas) && !isNaN(minutos) && minutos < 60) {
            const decimal = horas + (minutos / 60);
            if (inputDecimal) inputDecimal.value = decimal.toFixed(2);
            return;
        }
    }
    if (inputDecimal) inputDecimal.value = '';
}

function sincronizarHoraDecimal() {
    const inputDecimal = document.getElementById('conv-hora-decimal');
    if (!inputDecimal) return;

    let valorTexto = inputDecimal.value.replace(/[^0-9.]/g, '');
    inputDecimal.value = valorTexto;

    const inputRelogio = document.getElementById('conv-hora-relogio');
    const valorDecimal = parseFloat(valorTexto);

    if (isNaN(valorDecimal) || valorDecimal < 0) {
        if (inputRelogio) inputRelogio.value = '';
        return;
    }

    const horas = Math.floor(valorDecimal);
    const minutos = Math.round((valorDecimal - horas) * 60);

    const horasString = String(horas).padStart(2, '0');
    const minutosString = String(minutos).padStart(2, '0');

    if (inputRelogio) inputRelogio.value = `${horasString}:${minutosString}`;
}

// ==========================================
// LÓGICA DA ABA 2: DATA ⇄ EXCEL / UNIX
// ==========================================
function sincronizarPelaData() {
    const inputData = document.getElementById('conv-data-civil');
    if (!inputData || !inputData.value) return;

    const dataObj = new Date(inputData.value);
    const timestampMs = dataObj.getTime();
    if (isNaN(timestampMs)) return;

    // Unix
    const inputUnix = document.getElementById('conv-decimal-unix');
    if (inputUnix) inputUnix.value = Math.floor(timestampMs / 1000);

    // Excel
    let excelSerial = (timestampMs / MS_PER_DAY) + EXCEL_EPOCH_DIFF;
    excelSerial -= (dataObj.getTimezoneOffset() / 1440);
    if (excelSerial > 59) excelSerial += 1; // Correção ano bissexto fantasma de 1900

    const inputExcel = document.getElementById('conv-decimal-excel');
    if (inputExcel) inputExcel.value = excelSerial.toFixed(5);
}

function sincronizarPeloExcel() {
    const inputExcel = document.getElementById('conv-decimal-excel');
    if (!inputExcel) return;

    let valorTexto = inputExcel.value.replace(/[^0-9.]/g, '');
    inputExcel.value = valorTexto;

    if (valorTexto === '') { limparCamposAba2(); return; }

    let serial = parseFloat(valorTexto);
    if (isNaN(serial)) return;

    if (serial > 60) serial -= 1;

    const timestampMs = (serial - EXCEL_EPOCH_DIFF) * MS_PER_DAY;
    const dataObj = new Date(timestampMs);

    if (!isNaN(dataObj.getTime())) {
        const offsetMs = dataObj.getTimezoneOffset() * 60000;
        const dataLocal = new Date(dataObj.getTime() - offsetMs);
        
        const inputData = document.getElementById('conv-data-civil');
        const inputUnix = document.getElementById('conv-decimal-unix');

        if (inputData) inputData.value = dataLocal.toISOString().slice(0, 16);
        if (inputUnix) inputUnix.value = Math.floor(dataObj.getTime() / 1000);
    }
}

function sincronizarPeloUnix() {
    const inputUnix = document.getElementById('conv-decimal-unix');
    if (!inputUnix) return;

    let valorTexto = inputUnix.value.replace(/[^0-9]/g, '');
    inputUnix.value = valorTexto;

    if (valorTexto === '') { limparCamposAba2(); return; }

    let unixTime = parseInt(valorTexto, 10);
    if (isNaN(unixTime)) return;

    const dataObj = new Date(unixTime * 1000);

    if (!isNaN(dataObj.getTime())) {
        const offsetMs = dataObj.getTimezoneOffset() * 60000;
        const dataLocal = new Date(dataObj.getTime() - offsetMs);

        const inputData = document.getElementById('conv-data-civil');
        const inputExcel = document.getElementById('conv-decimal-excel');

        if (inputData) inputData.value = dataLocal.toISOString().slice(0, 16);

        let excelSerial = (dataObj.getTime() / MS_PER_DAY) + EXCEL_EPOCH_DIFF;
        excelSerial -= (dataObj.getTimezoneOffset() / 1440);
        if (excelSerial > 59) excelSerial += 1;

        if (inputExcel) inputExcel.value = excelSerial.toFixed(5);
    }
}

// ==========================================
// ROTINAS DE LIMPEZA DOS CAMPOS
// ==========================================
function limparCamposAba2() {
    const inputData = document.getElementById('conv-data-civil');
    const inputExcel = document.getElementById('conv-decimal-excel');
    const inputUnix = document.getElementById('conv-decimal-unix');

    if (inputData) inputData.value = '';
    if (inputExcel) inputExcel.value = '';
    if (inputUnix) inputUnix.value = '';
}

function limparTodosCamposConv() {
    const abaHoraDecimal = document.getElementById('aba-hora-decimal');
    
    // Detecta qual aba está visível no momento para realizar a limpeza seletiva
    if (abaHoraDecimal && abaHoraDecimal.classList.contains('active')) {
        const rec = document.getElementById('conv-hora-relogio');
        const dec = document.getElementById('conv-hora-decimal');
        if (rec) rec.value = '';
        if (dec) dec.value = '';
    } else {
        limparCamposAba2();
    }
}

// ==========================================
// INICIALIZADOR SEGURO DE ESCUTAS
// ==========================================
function inicializarConversorMaster() {
    // Helper para adicionar evento com segurança contra duplicação
    const conectarInput = (id, evento, funcao) => {
        const el = document.getElementById(id);
        if (el) {
            if (el._handleDH) el.removeEventListener(evento, el._handleDH);
            el._handleDH = funcao;
            el.addEventListener(evento, el._handleDH);
        }
    };

    // Ouvintes Aba 1
    conectarInput('conv-hora-relogio', 'input', sincronizarHoraDigital);
    conectarInput('conv-hora-decimal', 'input', sincronizarHoraDecimal);

    // Ouvintes Aba 2
    conectarInput('conv-data-civil', 'input', sincronizarPelaData);
    conectarInput('conv-decimal-excel', 'input', sincronizarPeloExcel);
    conectarInput('conv-decimal-unix', 'input', sincronizarPeloUnix);
}

// Exportação global segura
window.alternarAbaDataHora = alternarAbaDataHora;
window.sincronizarHoraDigital = sincronizarHoraDigital;
window.sincronizarHoraDecimal = sincronizarHoraDecimal;
window.sincronizarPelaData = sincronizarPelaData;
window.sincronizarPeloExcel = sincronizarPeloExcel;
window.sincronizarPeloUnix = sincronizarPeloUnix;
window.limparCamposAba2 = limparCamposAba2;
window.limparTodosCamposConv = limparTodosCamposConv;
window.inicializarConversorMaster = inicializarConversorMaster;

// Executa a inicialização
inicializarConversorMaster();