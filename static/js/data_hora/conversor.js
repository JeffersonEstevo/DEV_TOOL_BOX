// ==========================================
// CONTROLE DE NAVEGAÇÃO DAS ABAS
// ==========================================
function alternarAbaDataHora(idAba) {
    // Remove classe ativa de todos os botões e conteúdos
    document.querySelectorAll('.data-hora-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.dh-workspace.tab-content').forEach(content => content.classList.remove('active'));

    // Adiciona classe ativa ao botão clicado e à aba correspondente
    const btnClicado = Array.from(document.querySelectorAll('.data-hora-tabs .tab-btn')).find(btn => btn.getAttribute('onclick').includes(idAba));
    if (btnClicado) btnClicado.classList.add('active');
    
    const conteudoAba = document.getElementById(idAba);
    if (conteudoAba) conteudoAba.classList.add('active');
}

// ==========================================
// LÓGICA DA ABA 1: HORA ⇄ DECIMAL
// ==========================================
function sincronizarHoraDigital() {
    const inputRelogio = document.getElementById('conv-hora-relogio');
    let valor = inputRelogio.value.replace(/[^0-9:]/g, ''); // Permite apenas números e dois pontos
    inputRelogio.value = valor;

    // Formata automaticamente adicionando ':' se o usuário digitar 4 números diretos
    if (valor.length === 4 && !valor.includes(':')) {
        valor = valor.slice(0, 2) + ':' + valor.slice(2);
        inputRelogio.value = valor;
    }

    const partes = valor.split(':');
    if (partes.length === 2 && partes[0] !== '' && partes[1] !== '') {
        const horas = parseInt(partes[0], 10);
        const minutos = parseInt(partes[1], 10);

        if (!isNaN(horas) && !isNaN(minutos) && minutos < 60) {
            const decimal = horas + (minutos / 60);
            document.getElementById('conv-hora-decimal').value = decimal.toFixed(2);
            return;
        }
    }
    document.getElementById('conv-hora-decimal').value = '';
}

function sincronizarHoraDecimal() {
    const inputDecimal = document.getElementById('conv-hora-decimal');
    let valorTexto = inputDecimal.value.replace(/[^0-9.]/g, '');
    inputDecimal.value = valorTexto;

    const valorDecimal = parseFloat(valorTexto);
    if (isNaN(valorDecimal) || valorDecimal < 0) {
        document.getElementById('conv-hora-relogio').value = '';
        return;
    }

    const horas = Math.floor(valorDecimal);
    const minutos = Math.round((valorDecimal - horas) * 60);

    const horasString = String(horas).padStart(2, '0');
    const minutosString = String(minutos).padStart(2, '0');

    document.getElementById('conv-hora-relogio').value = `${horasString}:${minutosString}`;
}

// ==========================================
// LÓGICA DA ABA 2: DATA ⇄ EXCEL / UNIX
// ==========================================
const EXCEL_EPOCH_DIFF = 25569;
const MS_PER_DAY = 86400000;

function sincronizarPelaData() {
    const inputData = document.getElementById('conv-data-civil');
    if (!inputData.value) return;

    const dataObj = new Date(inputData.value);
    const timestampMs = dataObj.getTime();
    if (isNaN(timestampMs)) return;

    // Unix
    document.getElementById('conv-decimal-unix').value = Math.floor(timestampMs / 1000);

    // Excel
    let excelSerial = (timestampMs / MS_PER_DAY) + EXCEL_EPOCH_DIFF;
    excelSerial -= (dataObj.getTimezoneOffset() / 1440);
    if (excelSerial > 59) excelSerial += 1; // Correção ano bissexto fantasma de 1900

    document.getElementById('conv-decimal-excel').value = excelSerial.toFixed(5);
}

function sincronizarPeloExcel() {
    const inputExcel = document.getElementById('conv-decimal-excel');
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
        
        document.getElementById('conv-data-civil').value = dataLocal.toISOString().slice(0, 16);
        document.getElementById('conv-decimal-unix').value = Math.floor(dataObj.getTime() / 1000);
    }
}

function sincronizarPeloUnix() {
    const inputUnix = document.getElementById('conv-decimal-unix');
    let valorTexto = inputUnix.value.replace(/[^0-9]/g, '');
    inputUnix.value = valorTexto;

    if (valorTexto === '') { limparCamposAba2(); return; }

    let unixTime = parseInt(valorTexto);
    if (isNaN(unixTime)) return;

    const dataObj = new Date(unixTime * 1000);

    if (!isNaN(dataObj.getTime())) {
        const offsetMs = dataObj.getTimezoneOffset() * 60000;
        const dataLocal = new Date(dataObj.getTime() - offsetMs);
        document.getElementById('conv-data-civil').value = dataLocal.toISOString().slice(0, 16);

        let excelSerial = (dataObj.getTime() / MS_PER_DAY) + EXCEL_EPOCH_DIFF;
        excelSerial -= (dataObj.getTimezoneOffset() / 1440);
        if (excelSerial > 59) excelSerial += 1;

        document.getElementById('conv-decimal-excel').value = excelSerial.toFixed(5);
    }
}

// ==========================================
// ROTINAS DE LIMPEZA DOS CAMPOS
// ==========================================
function limparCamposAba2() {
    document.getElementById('conv-data-civil').value = '';
    document.getElementById('conv-decimal-excel').value = '';
    document.getElementById('conv-decimal-unix').value = '';
}

function limparTodosCamposConv() {
    // Detecta qual aba está visível no momento para realizar a limpeza seletiva
    if (document.getElementById('aba-hora-decimal').classList.contains('active')) {
        document.getElementById('conv-hora-relogio').value = '';
        document.getElementById('conv-hora-decimal').value = '';
    } else {
        limparCamposAba2();
    }
}

// Inicializador de escutas
function inicializarConversorMaster() {
    // Ouvintes Aba 1
    const rec = document.getElementById('conv-hora-relogio');
    const dec = document.getElementById('conv-hora-decimal');
    if (rec) rec.addEventListener('input', sincronizarHoraDigital);
    if (dec) dec.addEventListener('input', sincronizarHoraDecimal);

    // Ouvintes Aba 2
    const inputData = document.getElementById('conv-data-civil');
    const inputExcel = document.getElementById('conv-decimal-excel');
    const inputUnix = document.getElementById('conv-decimal-unix');
    if (inputData) inputData.addEventListener('input', sincronizarPelaData);
    if (inputExcel) inputExcel.addEventListener('input', sincronizarPeloExcel);
    if (inputUnix) inputUnix.addEventListener('input', sincronizarPeloUnix);
}

inicializarConversorMaster();