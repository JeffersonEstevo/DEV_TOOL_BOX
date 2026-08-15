// Verifica se a variável global já existe na SPA para evitar redeclaração
if (typeof window.ultimosNumerosGerados === 'undefined') {
    window.ultimosNumerosGerados = [];
}

function dispararGeracaoNumeros() {
    const qtdInput = parseInt(document.getElementById("num-quantidade")?.value) || 1;
    const minInput = parseInt(document.getElementById("num-minimo")?.value) || 0;
    const maxInput = parseInt(document.getElementById("num-maximo")?.value) || 100;
    const unicos = document.getElementById("num-unicos")?.checked;
    const ordenacao = document.getElementById("num-ordenacao")?.value;
    const formato = document.getElementById("num-formato")?.value;

    let min = Math.min(minInput, maxInput);
    let max = Math.max(minInput, maxInput);
    let quantidade = Math.max(1, qtdInput);

    const totalPossivel = (max - min) + 1;
    if (unicos && quantidade > totalPossivel) {
        window.ultimosNumerosGerados = [];
        exibirResultadoNumeros(true, `Erro: Máx ${totalPossivel} números únicos.`);
        return;
    }

    let numeros = [];
    if (unicos) {
        let pool = [];
        for (let i = min; i <= max; i++) pool.push(i);
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        numeros = pool.slice(0, quantidade);
    } else {
        for (let i = 0; i < quantidade; i++) {
            numeros.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
    }

    if (ordenacao === 'crescente') {
        numeros.sort((a, b) => a - b);
    } else if (ordenacao === 'decrescente') {
        numeros.sort((a, b) => b - a);
    }

    window.ultimosNumerosGerados = numeros;
    exibirResultadoNumeros(false, "", formato);
}

function exibirResultadoNumeros(isError = false, errorMessage = "", formato = "tabela") {
    const painel = document.getElementById("num-painel-resultado");
    if (!painel) return;

    if (isError) {
        painel.innerHTML = `<span style="color: #dc3545; font-size: 0.9rem; padding: 1rem;">${errorMessage}</span>`;
        return;
    }

    if (window.ultimosNumerosGerados.length === 0) {
        painel.innerHTML = `<span style="opacity: 0.6; font-size: 0.9rem;">Aguardando geração...</span>`;
        return;
    }

    if (formato === 'lista') {
        painel.innerHTML = `<div style="word-break: break-all; font-family: monospace; font-weight: 700; font-size: 1rem; color: var(--text-main);">${window.ultimosNumerosGerados.join(', ')}</div>`;
    } else {
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 0.35rem; justify-content: center; align-items: center;">';
        window.ultimosNumerosGerados.forEach(num => {
            html += `<div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 4px; padding: 0.25rem 0.5rem; font-weight: 700; font-family: monospace; font-size: 0.9rem; min-width: 38px; text-align: center;">${num}</div>`;
        });
        html += '</div>';
        painel.innerHTML = html;
    }
}

function resetarGeradorNumeros() {
    document.getElementById("num-quantidade").value = "10";
    document.getElementById("num-minimo").value = "1";
    document.getElementById("num-maximo").value = "100";
    document.getElementById("num-unicos").checked = false;
    document.getElementById("num-ordenacao").value = "nenhuma";
    document.getElementById("num-formato").value = "tabela";
    window.ultimosNumerosGerados = [];
    exibirResultadoNumeros();
}

function inicializarEventosNumeros() {
    const elementos = ['num-quantidade', 'num-minimo', 'num-maximo', 'num-unicos', 'num-ordenacao', 'num-formato'];
    elementos.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const evento = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
            el.removeEventListener(evento, dispararGeracaoNumeros);
            el.addEventListener(evento, dispararGeracaoNumeros);
        }
    });
}

inicializarEventosNumeros();
dispararGeracaoNumeros();