function inicializarRegraDeTres() {
    const inputs = ["value-a", "value-b", "value-c"];
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeEventListener("input", calcularRegraDeTresImediata);
            el.addEventListener("input", calcularRegraDeTresImediata);
        }
    });
}

function calcularRegraDeTresImediata() {
    const a = parseFloat(document.getElementById("value-a").value);
    const b = parseFloat(document.getElementById("value-b").value);
    const c = parseFloat(document.getElementById("value-c").value);
    const output = document.getElementById("value-x");

    if (!output) return;

    // Se algum campo estiver vazio ou incompleto, mantém o resultado limpo
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        output.value = "";
        return;
    }

    // Proteção contra divisão por zero (Matematicamente inválido)
    if (a === 0) {
        output.value = "Divisão por 0";
        return;
    }

    // Algoritmo: Cruzamento de proporção (b * c) / a
    const x = (b * c) / a;
    
    // Formata o output removendo casas decimais extras se for número inteiro
    output.value = Number.isInteger(x) ? x : x.toFixed(4);
}

function limparRegraDeTres() {
    const inputs = ["value-a", "value-b", "value-c", "value-x"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    console.log("[Regra de 3] Campos redefinidos.");
}

// Inicializa a escuta responsiva instantaneamente
inicializarRegraDeTres();