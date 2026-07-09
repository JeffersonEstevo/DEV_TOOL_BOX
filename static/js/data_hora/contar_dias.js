function calcularDiferencaDias() {
    const dataInicioStr = document.getElementById('data-inicio').value;
    const dataFimStr = document.getElementById('data-fim').value;
    const incluirInicial = document.getElementById('incluir-dia-inicial').checked;

    const displayTotal = document.getElementById('dias-total');
    const displayDecomposto = document.getElementById('dias-decomposto');

    // Validação básica se as datas foram preenchidas
    if (!dataInicioStr || !dataFimStr) {
        displayTotal.textContent = "0 dias";
        displayDecomposto.textContent = "Selecione ambas as datas.";
        return;
    }

    // Criar objetos Date baseados no fuso horário local (evitando problemas de fuso UTC padrão do input date)
    const d1 = new Object(new Date(dataInicioStr + 'T00:00:00'));
    const d2 = new Object(new Date(dataFimStr + 'T00:00:00'));

    // Inverte a ordem caso o usuário coloque a data menor no final
    const inverter = d1 > d2;
    const dataMenor = inverter ? d2 : d1;
    const dataMaior = inverter ? d1 : d2;

    // 1. Cálculo do TOTAL Absoluto de Dias
    const diferencaMilissegundos = dataMaior.getTime() - dataMenor.getTime();
    let totalDias = Math.floor(diferencaMilissegundos / (1000 * 60 * 60 * 24));

    if (incluirInicial) {
        totalDias += 1;
    }

    // 2. Cálculo Decomposto (Anos, Meses, Dias) exato baseado no calendário real
    let anos = dataMaior.getFullYear() - dataMenor.getFullYear();
    let meses = dataMaior.getMonth() - dataMenor.getMonth();
    let dias = dataMaior.getDate() - dataMenor.getDate();

    if (incluirInicial) {
        dias += 1;
    }

    // Ajuste se os dias ficarem negativos
    if (dias < 0) {
        // Pega o último dia do mês anterior ao da dataMaior
        const mesAnterior = new Date(dataMaior.getFullYear(), dataMaior.getMonth(), 0);
        dias += mesAnterior.getDate();
        meses--;
    }

    // Ajuste se os meses ficarem negativos
    if (meses < 0) {
        meses += 12;
        anos--;
    }

    // Atualização das strings na tela
    const sufixoSinal = inverter ? " (Invertido)" : "";
    displayTotal.textContent = `${totalDias} dia${totalDias !== 1 ? 's' : ''}${sufixoSinal}`;
    displayDecomposto.textContent = `${anos} ano${anos !== 1 ? 's' : ''}, ${meses} mê${meses !== 1 ? 'ses' : 's'} e ${dias} dia${dias !== 1 ? 's' : ''}`;
}

function limparTodosCamposDias() {
    document.getElementById('data-inicio').value = '';
    document.getElementById('data-fim').value = '';
    document.getElementById('incluir-dia-inicial').checked = false;

    document.getElementById('dias-total').textContent = '0 dias';
    document.getElementById('dias-decomposto').textContent = '0 anos, 0 meses e 0 dias';
}

function inicializarContadorDias() {
    const btnCalcular = document.getElementById('btn-calcular-dias');
    
    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularDiferencaDias);
    }
}

// Inicializa a escuta
inicializarContadorDias();