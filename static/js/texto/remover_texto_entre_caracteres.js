function executarExtracaoPorDelimitadores() {
    const input = document.getElementById("original-text");
    const select = document.getElementById("delimiter");
    const output = document.getElementById("extracted-text");

    if (!input || !select || !output) return;

    const originalText = input.value;
    const delimiter = select.value;
    
    const openChar = delimiter.charAt(0);
    const closeChar = delimiter.charAt(1);

    // Função auxiliar interna para escapar caracteres complexos para o RegExp nativo
    function escaparParaRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const escOpen = escaparParaRegex(openChar);
    const escClose = escaparParaRegex(closeChar);

    // Constrói o padrão capturando o que está de forma não-gulosa (.*?) entre os delimitadores
    const regex = new RegExp(`${escOpen}(.*?)${escClose}`, "g");
    const matches = [];
    let match;

    while ((match = regex.exec(originalText)) !== null) {
        matches.push(match[1]);
    }

    output.value = matches.join("\n");
}

function limparExtracaoPorDelimitadores() {
    const input = document.getElementById("original-text");
    const output = document.getElementById("extracted-text");

    if (input) input.value = "";
    if (output) output.value = "";
    console.log("[Delimitadores] Campos limpos!");
}

console.log("Módulo de Extração por Delimitadores carregado com sucesso!");