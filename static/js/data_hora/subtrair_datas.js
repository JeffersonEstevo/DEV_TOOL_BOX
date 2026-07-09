function calcularSubtracaoDatas() {
    const dataInicioStr = document.getElementById('sub-data-inicio').value;
    const dataFimStr = document.getElementById('sub-data-fim').value;
    const incluirFinal = document.getElementById('sub-incluir-dia-final').checked;

    // Elementos de Exibição
    const displayDecomposto = document.getElementById('sub-datas-decomposto');
    const txtTotalDias = document.getElementById('total-dias');
    const txtTotalSemanas = document.getElementById('total-semanas');
    const txtTotalMeses = document.getElementById('total-meses');
    const txtTotalAnos = document.getElementById('total-anos');

    if (!dataInicioStr || !dataFimStr) {
        displayDecomposto.textContent = "Selecione as duas datas.";
        return;
    }

    // Instancia os objetos de data localmente salvando o fuso horário
    const d1 = new Date(dataInicioStr + 'T00:00:00');
    const d2 = new Date(dataFimStr + 'T00:00:00');

    // Organiza para calcular corretamente mesmo se d1 for posterior a d2
    const inverter = d1 > d2;
    const dataMenor = inverter ? d2 : d1;
    const dataMaior = inverter ? d1 : d2;

    // 1. Cálculo Absoluto do Total de Dias
    const diferencaMilissegundos = dataMaior.getTime() - dataMenor.getTime();
    let totalDias = Math.floor(diferencaMilissegundos / (1000 * 60 * 60 * 24));

    if (incluirFinal) {
        totalDias += 1;
    }

    // 2. Cálculos dos Totais Individuais Convertidos
    const totalSemanas = (totalDias / 7).toFixed(1);
    const totalMesesCalculados = (totalDias / 30.4375).toFixed(1); // Média de dias por mês no ano civil
    const totalAnosCalculados = (totalDias / 365.25).toFixed(1);   // Média considerando anos bissextos

    // 3. Cálculo Decomposto (Anos, Meses, Dias) Real do Calendário
    let anos = dataMaior.getFullYear() - dataMenor.getFullYear();
    let meses = dataMaior.getMonth() - dataMenor.getMonth();
    let dias = dataMaior.getDate() - dataMenor.getDate();

    if (incluirFinal) {
        dias += 1;
    }

    // Ajuste dos dias negativos baseando-se no mês anterior
    if (dias < 0) {
        const ultimoDiaMesAnterior = new Date(dataMaior.getFullYear(), dataMaior.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
        meses--;
    }

    // Ajuste dos meses negativos
    if (meses < 0) {
        meses += 12;
        anos--;
    }

    // Impressão na Interface dos Resultados
    const sufixoSinal = inverter ? " (Invertido)" : "";
    displayDecomposto.textContent = `${anos} ano${anos !== 1 ? 's' : ''}, ${meses} mê${meses !== 1 ? 'ses' : 's'} e ${dias} dia${dias !== 1 ? 's' : ''}${sufixoSinal}`;
    
    txtTotalDias.textContent = totalDias;
    txtTotalSemanas.textContent = totalSemanas;
    txtTotalMeses.textContent = totalMesesCalculados;
    txtTotalAnos.textContent = totalAnosCalculados;
}

function limparTodosCamposSubDatas() {
    document.getElementById('sub-data-inicio').value = '';
    document.getElementById('sub-data-fim').value = '';
    document.getElementById('sub-incluir-dia-final').checked = false;

    document.getElementById('sub-datas-decomposto').textContent = '0 anos, 0 meses e 0 dias';
    document.getElementById('total-dias').textContent = '0';
    document.getElementById('total-semanas').textContent = '0';
    document.getElementById('total-meses').textContent = '0';
    document.getElementById('total-anos').textContent = '0';
}

function inicializarSubtracaoDatas() {
    const btnCalcular = document.getElementById('btn-calcular-sub-datas');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularSubtracaoDatas);
    }
}

// Inicializa escuta
inicializarSubtracaoDatas();