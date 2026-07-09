function executarRemocaoDeQuebras() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("modified-text");

    if (!input || !output) return;

    const originalText = input.value;
    // Substitui variações de quebras de linha (\r\n, \n, \r) por espaços e corrige espaçamentos duplos
    const textWithoutLineBreaks = originalText.replace(/(\r\n|\n|\r)/g, " ").replace(/\s{2,}/g, " ");
    
    output.value = textWithoutLineBreaks;
}

function limparRemocaoDeQuebras() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("modified-text");

    if (input) input.value = "";
    if (output) output.value = "";
    console.log("[Quebras] Campos limpos!");
}

console.log("Módulo de Remoção de Quebras carregado com sucesso!");