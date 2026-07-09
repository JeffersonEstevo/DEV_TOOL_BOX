function executarInversaoDeTexto() {
    const originalText = document.getElementById('original-text')?.value || "";
    const invertedText = originalText.split('').reverse().join('');
    const output = document.getElementById('inverted-text');
    
    if (output) {
        output.value = invertedText;
    }
}

function limparInversaoDeTexto() {
    const input = document.getElementById('original-text');
    const output = document.getElementById('inverted-text');
    
    if (input) input.value = '';
    if (output) output.value = '';
    console.log("[Inversor] Campos limpos!");
}

console.log("Módulo do Inversor de Texto carregado com sucesso!");