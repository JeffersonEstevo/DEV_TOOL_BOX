function dispararGeracaoUUID() {
    const maiusculo = document.getElementById("uuid-maiusculo")?.checked;
    const output = document.getElementById("uuid-resultado");

    if (!output) return;

    output.value = gerarUUIDv4(maiusculo);
}

// Algoritmo Padrão RFC 4122 para Geração de UUID v4
function gerarUUIDv4(emMaiusculo = false) {
    // Tenta usar a API nativa de criptografia do navegador se disponível para máxima aleatoriedade
    const cryptoObj = window.crypto || window.msCrypto;
    
    let uuid;
    if (cryptoObj && cryptoObj.randomUUID) {
        uuid = cryptoObj.randomUUID();
    } else {
        // Fallback matemático caso rodando em ambiente legado ou sem SSL/HTTPS seguro
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    return emMaiusculo ? uuid.toUpperCase() : uuid.toLowerCase();
}

// Executa uma geração automática inicial assim que o usuário abre a ferramenta
dispararGeracaoUUID();