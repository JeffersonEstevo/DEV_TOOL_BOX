function executarRemocaoDePontuacao() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("modified-text");

    if (!input || !output) return;

    const originalText = input.value;
    // Remove símbolos de pontuação comuns e corrige espaços duplicados gerados pela remoção
    const textWithoutPunctuation = originalText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡"']/g, "").replace(/\s{2,}/g, " ");
    
    output.value = textWithoutPunctuation;
}

function limparRemocaoDePontuacao() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("modified-text");

    if (input) input.value = "";
    if (output) output.value = "";
    console.log("[Pontuação] Campos limpos!");
}

console.log("Módulo de Remoção de Pontuação carregado com sucesso!");