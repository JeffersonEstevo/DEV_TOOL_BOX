// ==========================================
// ESTADO GLOBAL PERSISTENTE NO OBJETO WINDOW
// ==========================================
window.pomoInterval = window.pomoInterval || null;

window.pomoDurations = window.pomoDurations || {
    foco: 25,
    pausaCurta: 5,
    pausaLonga: 15
};

window.pomoCurrentMode = window.pomoCurrentMode || 'foco';

// Guarda o tempo restante de CADA modo separadamente, para que trocar de aba
// não reinicie o progresso de um ciclo que já estava em andamento
window.pomoTimeLeftByMode = window.pomoTimeLeftByMode || {
    foco: window.pomoDurations.foco * 60,
    pausaCurta: window.pomoDurations.pausaCurta * 60,
    pausaLonga: window.pomoDurations.pausaLonga * 60
};

// Mantém o tempo restante atual se já existir, senão usa o valor salvo do modo ativo
window.pomoTimeLeft = window.pomoTimeLeft !== undefined ? window.pomoTimeLeft : window.pomoTimeLeftByMode[window.pomoCurrentMode];
window.pomoTotalDuration = window.pomoTotalDuration !== undefined ? window.pomoTotalDuration : window.pomoDurations[window.pomoCurrentMode] * 60;

window.pomoIsRunning = window.pomoIsRunning || false;
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

    // Atualiza o contador visual de ciclos na tela
    const contadorEl = document.getElementById('pomo-counter');
    if (contadorEl) {
        contadorEl.textContent = window.pomoCompletedCycles;
    }

    // Atualiza o título da aba apenas se o Pomodoro estiver rodando ativamente
    if (window.pomoIsRunning) {
        document.title = `(${mStr}:${sStr}) Pomodoro - Dev Tool Box`;
    } else {
        document.title = `Dev Tool Box`;
    }
}

function mudarModoPomodoro(modo) {
    if (window.pomoIsRunning) {
        pararPomodoro();
    }

    // Salva o tempo restante do modo atual antes de sair dele
    window.pomoTimeLeftByMode[window.pomoCurrentMode] = window.pomoTimeLeft;

    window.pomoCurrentMode = modo;

    // Restaura o tempo salvo do modo de destino (não reseta o progresso já feito)
    window.pomoTimeLeft = window.pomoTimeLeftByMode[modo];
    window.pomoTotalDuration = window.pomoDurations[modo] * 60;

    atualizarInterfaceEstado();
}

function atualizarInterfaceEstado() {
    // Atualiza classes ativas das abas visualmente
    document.querySelectorAll('.pomodoro-tabs .tab-btn').forEach(btn => {
        const attr = btn.getAttribute('onclick');
        if (attr && attr.includes(window.pomoCurrentMode)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Atualiza o texto descritivo de status
    const labelStatus = document.getElementById('pomo-status-label');
    if (labelStatus) {
        if (window.pomoCurrentMode === 'foco') labelStatus.textContent = "Hora de focar com dedicação!";
        else if (window.pomoCurrentMode === 'pausaCurta') labelStatus.textContent = "Relaxe um pouco, respire fundo.";
        else labelStatus.textContent = "Descanse bem, você mereceu uma pausa longa!";
    }

    // Atualiza botão de start/pausa
    const btnStart = document.getElementById('btn-pomo-start');
    if (btnStart) {
        if (window.pomoIsRunning) {
            btnStart.innerHTML = `<i class="bi bi-pause-fill"></i> Pausar`;
            btnStart.className = 'chrono-btn btn-pause';
        } else {
            btnStart.innerHTML = window.pomoTimeLeft < window.pomoTotalDuration ? `<i class="bi bi-play-fill"></i> Continuar` : `<i class="bi bi-play-fill"></i> Iniciar`;
            btnStart.className = 'chrono-btn btn-start';
        }
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

        // O modo concluído deve voltar ao tempo cheio para a próxima vez que for usado
        window.pomoTimeLeftByMode[window.pomoCurrentMode] = window.pomoDurations[window.pomoCurrentMode] * 60;

        if (window.pomoCurrentMode === 'foco') {
            window.pomoCompletedCycles++;
            
            const contadorEl = document.getElementById('pomo-counter');
            if (contadorEl) contadorEl.textContent = window.pomoCompletedCycles;

            // Sugere automaticamente pausa curta ou longa a cada 4 ciclos
            if (window.pomoCompletedCycles % 4 === 0) {
                mudarModoPomodoro('pausaLonga');
            } else {
                mudarModoPomodoro('pausaCurta');
            }
        } else {
            mudarModoPomodoro('foco');
        }
    }
}

function alternarPomodoro() {
    if (!window.pomoIsRunning) {
        window.pomoIsRunning = true;
        window.pomoInterval = setTimeout(loopPomodoro, 1000);
    } else {
        pararPomodoro();
    }
    atualizarInterfaceEstado();
}

function pararPomodoro() {
    window.pomoIsRunning = false;
    clearTimeout(window.pomoInterval);
    atualizarInterfaceEstado();
}

function reiniciarPomodoro() {
    pararPomodoro();
    window.pomoTimeLeft = window.pomoDurations[window.pomoCurrentMode] * 60;
    window.pomoTotalDuration = window.pomoDurations[window.pomoCurrentMode] * 60;
    window.pomoTimeLeftByMode[window.pomoCurrentMode] = window.pomoTimeLeft;
    atualizarInterfaceEstado();
}

// ==========================================
// CONFIGURAÇÕES DOS TEMPOS
// ==========================================
function abrirConfigPomodoro() {
    const modal = document.getElementById('pomo-settings-modal');
    if (!modal) return;

    document.getElementById('input-time-foco').value = window.pomoDurations.foco;
    document.getElementById('input-time-curta').value = window.pomoDurations.pausaCurta;
    document.getElementById('input-time-longa').value = window.pomoDurations.pausaLonga;

    modal.style.display = 'block';
}

function fecharConfigPomodoro() {
    const modal = document.getElementById('pomo-settings-modal');
    if (modal) modal.style.display = 'none';
}

function salvarConfigPomodoro() {
    const focoVal = parseInt(document.getElementById('input-time-foco').value);
    const curtaVal = parseInt(document.getElementById('input-time-curta').value);
    const longaVal = parseInt(document.getElementById('input-time-longa').value);

    const novasDuracoes = { foco: focoVal, pausaCurta: curtaVal, pausaLonga: longaVal };

    Object.keys(novasDuracoes).forEach(modo => {
        const novoValor = novasDuracoes[modo];
        if (!(novoValor > 0)) return;

        const duracaoAntigaSegundos = window.pomoDurations[modo] * 60;
        const tempoRestanteSalvo = window.pomoTimeLeftByMode[modo];

        // Só aplica a nova duração automaticamente se o modo ainda não tiver
        // sido iniciado (tempo restante == duração cheia anterior).
        // Assim, um ciclo em andamento não perde o progresso já feito.
        if (tempoRestanteSalvo === duracaoAntigaSegundos) {
            window.pomoTimeLeftByMode[modo] = novoValor * 60;
        }

        window.pomoDurations[modo] = novoValor;
    });

    fecharConfigPomodoro();

    // Sincroniza o tempo exibido com o modo atualmente ativo
    window.pomoTimeLeft = window.pomoTimeLeftByMode[window.pomoCurrentMode];
    window.pomoTotalDuration = window.pomoDurations[window.pomoCurrentMode] * 60;

    if (!window.pomoIsRunning) {
        atualizarVisorPomodoro();
    }
}

// Exportações globais seguras para SPA
window.mudarModoPomodoro = mudarModoPomodoro;
window.alternarPomodoro = alternarPomodoro;
window.reiniciarPomodoro = reiniciarPomodoro;
window.abrirConfigPomodoro = abrirConfigPomodoro;
window.fecharConfigPomodoro = fecharConfigPomodoro;
window.salvarConfigPomodoro = salvarConfigPomodoro;

// Inicializa a interface e o visor corretamente ao carregar a aba
atualizarInterfaceEstado();