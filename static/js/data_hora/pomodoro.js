// ==========================================
// CONSTANTES E ESTADO GLOBAL PARA SPA (WINDOW)
// ==========================================
window.pomoInterval = window.pomoInterval || null;
window.pomoTimeLeft = window.pomoTimeLeft || 25 * 60; // em segundos (padrão 25 min)
window.pomoTotalDuration = window.pomoTotalDuration || 25 * 60;
window.pomoIsRunning = window.pomoIsRunning || false;
window.pomoCurrentMode = window.pomoCurrentMode || 'foco';
window.pomoCompletedCycles = window.pomoCompletedCycles || 0;

// ==========================================
// FUNÇÕES DE ÁUDIO SUTIL (WEB AUDIO API)
// ==========================================
function tocarAlarmePomodoro() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Nota D5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
        // Ignora caso o navegador bloqueie autoplay sem interação prévia
    }
}

// ==========================================
// LÓGICA PRINCIPAL DO POMODORO
// ==========================================
function atualizarVisorPomodoro() {
    const display = document.getElementById('pomo-display');
    if (!display) return;

    const minutos = Math.floor(window.pomoTimeLeft / 60);
    const segundos = window.pomoTimeLeft % 60;

    const mStr = String(minutos).padStart(2, '0');
    const sStr = String(segundos).padStart(2, '0');

    display.textContent = `${mStr}:${sStr}`;

    // Atualiza título da aba do navegador dinamicamente
    document.title = `(${mStr}:${sStr}) Pomodoro - Conversores`;
}

function mudarModoPomodoro(modo, minutos) {
    if (window.pomoIsRunning) {
        pararPomodoro();
    }

    window.pomoCurrentMode = modo;
    window.pomoTimeLeft = minutos * 60;
    window.pomoTotalDuration = minutos * 60;

    // Atualiza classes ativas das abas
    document.querySelectorAll('.pomodoro-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const btnClicado = Array.from(document.querySelectorAll('.pomodoro-tabs .tab-btn')).find(btn => {
        const attr = btn.getAttribute('onclick');
        return attr && attr.includes(modo);
    });
    if (btnClicado) btnClicado.classList.add('active');

    // Atualiza o texto descritivo de status
    const labelStatus = document.getElementById('pomo-status-label');
    if (labelStatus) {
        if (modo === 'foco') labelStatus.textContent = "Hora de focar com dedicação!";
        else if (modo === 'pausaCurta') labelStatus.textContent = "Relaxe um pouco, respire fundo.";
        else labelStatus.textContent = "Descanse bem, você mereceu uma pausa longa!";
    }

    atualizarVisorPomodoro();
}

function loopPomodoro() {
    if (!window.pomoIsRunning) return;

    if (window.pomoTimeLeft > 0) {
        window.pomoTimeLeft--;
        atualizarVisorPomodoro();
        window.pomoInterval = setTimeout(loopPomodoro, 1000);
    } else {
        // Ciclo Finalizado!
        pararPomodoro();
        tocarAlarmePomodoro();

        if (window.pomoCurrentMode === 'foco') {
            window.pomoCompletedCycles++;
            const contadorEl = document.getElementById('pomo-counter');
            if (contadorEl) contadorEl.textContent = window.pomoCompletedCycles;

            // Sugere automaticamente pausa curta ou longa a cada 4 ciclos
            if (window.pomoCompletedCycles % 4 === 0) {
                mudarModoPomodoro('pausaLonga', 15);
            } else {
                mudarModoPomodoro('pausaCurta', 5);
            }
        } else {
            mudarModoPomodoro('foco', 25);
        }
    }
}

function alternarPomodoro() {
    const btnStart = document.getElementById('btn-pomo-start');

    if (!window.pomoIsRunning) {
        window.pomoIsRunning = true;
        window.pomoInterval = setTimeout(loopPomodoro, 1000);

        if (btnStart) {
            btnStart.innerHTML = `<i class="bi bi-pause-fill"></i> Pausar`;
            btnStart.className = 'chrono-btn btn-pause';
        }
    } else {
        pararPomodoro();
    }
}

function pararPomodoro() {
    window.pomoIsRunning = false;
    clearTimeout(window.pomoInterval);

    const btnStart = document.getElementById('btn-pomo-start');
    if (btnStart) {
        btnStart.innerHTML = `<i class="bi bi-play-fill"></i> Continuar`;
        btnStart.className = 'chrono-btn btn-start';
    }
}

function reiniciarPomodoro() {
    pararPomodoro();
    window.pomoTimeLeft = window.pomoTotalDuration;
    atualizarVisorPomodoro();

    const btnStart = document.getElementById('btn-pomo-start');
    if (btnStart) {
        btnStart.innerHTML = `<i class="bi bi-play-fill"></i> Iniciar`;
        btnStart.className = 'chrono-btn btn-start';
    }
}

// Exportações globais seguras para SPA
window.mudarModoPomodoro = mudarModoPomodoro;
window.alternarPomodoro = alternarPomodoro;
window.reiniciarPomodoro = reiniciarPomodoro;

// Inicializa o visor na carga inicial
atualizarVisorPomodoro();