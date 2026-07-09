function executarRemocaoDeAcentos() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("modified-text");

    if (!input || !output) return;

    const originalText = input.value;
    // Algoritmo nativo de normalização Unicode para separação e remoção de acentos
    const textWithoutAccents = originalText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    output.value = textWithoutAccents;
}

function limparRemocaoDeAcentos() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("modified-text");

    if (input) input.value = "";
    if (output) output.value = "";
    console.log("[Acentos] Campos limpos!");
}

console.log("Módulo de Remoção de Acentos carregado com sucesso!");