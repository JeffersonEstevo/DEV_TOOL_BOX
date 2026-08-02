// ==========================================
// CONSTANTES E ESTADO GLOBAL PARA SPA (WINDOW)
// ==========================================
window.chronoInterval = window.chronoInterval || null;
window.chronoElapsedTime = window.chronoElapsedTime || 0; // em milissegundos
window.chronoIsRunning = window.chronoIsRunning || false;
window.chronoLastTimestamp = window.chronoLastTimestamp || 0;
window.chronoLaps = window.chronoLaps || [];

// ==========================================
// LÓGICA DO CRONÔMETRO
// ==========================================
function atualizarVisorCronometro() {
    const display = document.getElementById('chrono-display');
    if (!display) return;

    const msTotal = window.chronoElapsedTime;
    const horas = Math.floor(msTotal / 3600000);
    const minutos = Math.floor((msTotal % 3600000) / 60000);
    const segundos = Math.floor((msTotal % 60000) / 1000);
    const centesimos = Math.floor((msTotal % 1000) / 10);

    const hStr = String(horas).padStart(2, '0');
    const mStr = String(minutos).padStart(2, '0');
    const sStr = String(segundos).padStart(2, '0');
    const cStr = String(centesimos).padStart(2, '0');

    display.innerHTML = `${hStr}:${mStr}:${sStr}<small>.${cStr}</small>`;
}

function loopCronometro() {
    if (!window.chronoIsRunning) return;

    const agora = performance.now();
    const delta = agora - window.chronoLastTimestamp;
    window.chronoLastTimestamp = agora;
    window.chronoElapsedTime += delta;

    atualizarVisorCronometro();
    window.chronoInterval = requestAnimationFrame(loopCronometro);
}

function alternarCronometro() {
    const btnStart = document.getElementById('btn-chrono-start');
    const btnLap = document.getElementById('btn-chrono-lap');
    const btnReset = document.getElementById('btn-chrono-reset');

    if (!window.chronoIsRunning) {
        // Iniciar / Retomar
        window.chronoIsRunning = true;
        window.chronoLastTimestamp = performance.now();
        window.chronoInterval = requestAnimationFrame(loopCronometro);

        if (btnStart) {
            btnStart.innerHTML = `<i class="bi bi-pause-fill"></i> Pausar`;
            btnStart.className = 'chrono-btn btn-pause';
        }
        if (btnLap) btnLap.removeAttribute('disabled');
        if (btnReset) btnReset.removeAttribute('disabled');
    } else {
        // Pausar
        window.chronoIsRunning = false;
        cancelAnimationFrame(window.chronoInterval);

        if (btnStart) {
            btnStart.innerHTML = `<i class="bi bi-play-fill"></i> Continuar`;
            btnStart.className = 'chrono-btn btn-start';
        }
    }
}

function registrarVoltaCronometro() {
    if (!window.chronoIsRunning && window.chronoElapsedTime === 0) return;

    const listaEl = document.getElementById('chrono-laps-list');
    if (!listaEl) return;

    window.chronoLaps.push(window.chronoElapsedTime);
    const numeroVolta = window.chronoLaps.length;

    const msTotal = window.chronoElapsedTime;
    const horas = Math.floor(msTotal / 3600000);
    const minutos = Math.floor((msTotal % 3600000) / 60000);
    const segundos = Math.floor((msTotal % 60000) / 1000);
    const centesimos = Math.floor((msTotal % 1000) / 10);

    const tempoFormatado = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}.${String(centesimos).padStart(2, '0')}`;

    // Remove mensagem de "vazio" se for a primeira volta
    if (numeroVolta === 1) {
        listaEl.innerHTML = '';
    }

    const itemVolta = document.createElement('div');
    itemVolta.className = 'chrono-lap-item';
    itemVolta.innerHTML = `<span>Volta ${numeroVolta}</span> <strong>${tempoFormatado}</strong>`;
    
    listaEl.prepend(itemVolta); // Adiciona as voltas mais recentes no topo
}

function zerarCronometro() {
    window.chronoIsRunning = false;
    cancelAnimationFrame(window.chronoInterval);
    window.chronoElapsedTime = 0;
    window.chronoLaps = [];

    atualizarVisorCronometro();

    const btnStart = document.getElementById('btn-chrono-start');
    const btnLap = document.getElementById('btn-chrono-lap');
    const btnReset = document.getElementById('btn-chrono-reset');
    const listaEl = document.getElementById('chrono-laps-list');

    if (btnStart) {
        btnStart.innerHTML = `<i class="bi bi-play-fill"></i> Iniciar`;
        btnStart.className = 'chrono-btn btn-start';
    }
    if (btnLap) btnLap.setAttribute('disabled', 'true');
    if (btnReset) btnReset.setAttribute('disabled', 'true');

    if (listaEl) {
        listaEl.innerHTML = `<span class="chrono-empty-laps">Nenhuma volta registrada ainda.</span>`;
    }
}

// Exportação global segura
window.alternarCronometro = alternarCronometro;
window.registrarVoltaCronometro = registrarVoltaCronometro;
window.zerarCronometro = zerarCronometro;