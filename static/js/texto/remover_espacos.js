function executarRemocaoDeEspacos() {
    const input = document.getElementById('original-text');
    const output = document.getElementById('modified-text');

    if (!input || !output) return;

    const originalText = input.value;
    // Substitui múltiplos espaços/quebras por um único espaço e remove as pontas
    const modifiedText = originalText.replace(/\s+/g, ' ').trim();
    
    output.value = modifiedText;
}

function limparRemocaoDeEspacos() {
    const input = document.getElementById('original-text');
    const output = document.getElementById('modified-text');

    if (input) input.value = '';
    if (output) output.value = '';
    console.log("[Espaços] Campos limpos!");
}

console.log("Módulo de Remoção de Espaços carregado com sucesso!");