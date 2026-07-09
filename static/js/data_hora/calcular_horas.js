// Captura dos elementos do DOM
const inputsHoras = document.querySelectorAll('.input-hora');
const inputsMinutos = document.querySelectorAll('.input-minuto');
const displayTotal = document.getElementById('horas-resultado-total');
const displayExtenso = document.getElementById('horas-resultado-extenso');
const btnLimparHoras = document.getElementById('btn-limpar-horas');

function calcularSomatorioHoras() {
    let totalMinutos = 0;

    // Soma todas as horas convertendo-as para minutos
    inputsHoras.forEach(input => {
        let valor = parseInt(input.value);
        if (!isNaN(valor) && valor > 0) {
            totalMinutos += valor * 60;
        }
    });

    // Soma todos os minutos diretamente
    inputsMinutos.forEach(input => {
        // Validação em tempo real: impede minutos negativos ou quebras visuais
        let valor = parseInt(input.value);
        if (!isNaN(valor) && valor > 0) {
            totalMinutos += valor;
        }
    });

    // Processa a conversão do total de minutos de volta para o formato Horas:Minutos
    const horasCalculadas = Math.floor(totalMinutos / 60);
    const minutosCalculados = totalMinutos % 60;

    // Formatação em String preenchendo com zero à esquerda se necessário (Ex: 02:05)
    const horasFormatadas = String(horasCalculadas).padStart(2, '0');
    const minutosFormatados = String(minutosCalculados).padStart(2, '0');

    // Atualiza a interface de forma dinâmica
    displayTotal.textContent = `${horasFormatadas}:${minutosFormatados}`;
    displayExtenso.textContent = `${horasCalculadas} hora(s) e ${minutosCalculados} minuto(s)`;
}

function limparTodosCamposHoras() {
    inputsHoras.forEach(input => input.value = '');
    inputsMinutos.forEach(input => input.value = '');
    
    // Reseta displays para o estado inicial
    displayTotal.textContent = '00:00';
    displayExtenso.textContent = '0 horas e 0 minutos';
}

function inicializarCalculadoraHoras() {
    // Adiciona o ouvinte de eventos em todos os inputs de horas
    inputsHoras.forEach(input => {
        input.addEventListener('input', calcularSomatorioHoras);
    });

    // Adiciona o ouvinte de eventos em todos os inputs de minutos
    inputsMinutos.forEach(input => {
        input.addEventListener('input', calcularSomatorioHoras);
    });

    // Configura a ação do botão limpar
    if (btnLimparHoras) {
        btnLimparHoras.addEventListener('click', limparTodosCamposHoras);
    }
}

// Executa a inicialização dos escutadores
inicializarCalculadoraHoras();