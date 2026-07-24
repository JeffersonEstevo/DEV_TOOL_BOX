// Torna a função segura para o escopo global do window na SPA
window.calcularSomatorioHoras = function() {
    let totalMinutos = 0;

    // Busca os elementos dinamicamente para garantir referências vivas na tela
    const inputsHoras = document.querySelectorAll('.input-hora');
    const inputsMinutos = document.querySelectorAll('.input-minuto');
    const displayTotal = document.getElementById('horas-resultado-total');
    const displayExtenso = document.getElementById('horas-resultado-extenso');

    if (!displayTotal || !displayExtenso) return;

    // Soma todas as horas convertendo-as para minutos
    inputsHoras.forEach(input => {
        let valor = parseInt(input.value);
        if (!isNaN(valor) && valor > 0) {
            totalMinutos += valor * 60;
        }
    });

    // Soma todos os minutos diretamente
    inputsMinutos.forEach(input => {
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
};

window.limparTodosCamposHoras = function() {
    const inputsHoras = document.querySelectorAll('.input-hora');
    const inputsMinutos = document.querySelectorAll('.input-minuto');
    const displayTotal = document.getElementById('horas-resultado-total');
    const displayExtenso = document.getElementById('horas-resultado-extenso');

    inputsHoras.forEach(input => input.value = '');
    inputsMinutos.forEach(input => input.value = '');
    
    // Reseta displays para o estado inicial
    if (displayTotal) displayTotal.textContent = '00:00';
    if (displayExtenso) displayExtenso.textContent = '0 hora(s) e 0 minuto(s)';
};

window.inicializarCalculadoraHoras = function() {
    const inputsHoras = document.querySelectorAll('.input-hora');
    const inputsMinutos = document.querySelectorAll('.input-minuto');
    const btnLimparHoras = document.getElementById('btn-limpar-horas');

    // Adiciona o ouvinte nos inputs de horas com limpeza de evento prévio
    inputsHoras.forEach(input => {
        if (input._handleInputHoras) {
            input.removeEventListener('input', input._handleInputHoras);
        }
        input._handleInputHoras = window.calcularSomatorioHoras;
        input.addEventListener('input', input._handleInputHoras);
    });

    // Adiciona o ouvinte nos inputs de minutos com limpeza de evento prévio
    inputsMinutos.forEach(input => {
        if (input._handleInputHoras) {
            input.removeEventListener('input', input._handleInputHoras);
        }
        input._handleInputHoras = window.calcularSomatorioHoras;
        input.addEventListener('input', input._handleInputHoras);
    });

    // Configura a ação do botão limpar
    if (btnLimparHoras) {
        if (btnLimparHoras._handleClickLimparHoras) {
            btnLimparHoras.removeEventListener('click', btnLimparHoras._handleClickLimparHoras);
        }
        btnLimparHoras._handleClickLimparHoras = window.limparTodosCamposHoras;
        btnLimparHoras.addEventListener('click', btnLimparHoras._handleClickLimparHoras);
    }
};

// Alias curtos para referências internas
var calcularSomatorioHoras = window.calcularSomatorioHoras;
var limparTodosCamposHoras = window.limparTodosCamposHoras;
var inicializarCalculadoraHoras = window.inicializarCalculadoraHoras;

// Executa a inicialização dos escutadores
inicializarCalculadoraHoras();