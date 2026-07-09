function convertToLowercase() {
    const originalText = document.getElementById('original-text')?.value || "";
    const modifiedText = originalText.toLowerCase();
    const output = document.getElementById('modified-text');
    if (output) output.value = modifiedText;
}

function convertToUppercase() {
    const originalText = document.getElementById('original-text')?.value || "";
    const modifiedText = originalText.toUpperCase();
    const output = document.getElementById('modified-text');
    if (output) output.value = modifiedText;
}

function capitalizeText() {
    const originalText = document.getElementById('original-text')?.value || "";
    const modifiedText = originalText.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
    const output = document.getElementById('modified-text');
    if (output) output.value = modifiedText;
}

function alternateText() {
    const originalText = document.getElementById('original-text')?.value || "";
    const modifiedText = originalText.split('').map((char, index) => {
        return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
    }).join('');
    const output = document.getElementById('modified-text');
    if (output) output.value = modifiedText;
}

function convertToCamelCase() {
    const originalText = document.getElementById('original-text')?.value || "";
    const modifiedText = originalText
        .replace(/\s(.)/g, function(match, group1) {
            return group1.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/^(.)/, function(match, group1) {
            return group1.toLowerCase();
        });
    const output = document.getElementById('modified-text');
    if (output) output.value = modifiedText;
}

function cleanText() {
    const input = document.getElementById('original-text');
    const output = document.getElementById('modified-text');
    if (input) input.value = '';
    if (output) output.value = '';
}

function copyText() {
    const modifiedText = document.getElementById('modified-text');
    const alertBox = document.getElementById('copy-alert');
    if (!modifiedText || modifiedText.value.trim() === "") return;

    // API Moderna de Área de Transferência (substitui o execCommand antigo)
    navigator.clipboard.writeText(modifiedText.value)
        .then(() => {
            if (alertBox) {
                alertBox.classList.remove('hidden');
                setTimeout(() => alertBox.classList.add('hidden'), 2000);
            }
        })
        .catch(err => console.error("Erro ao copiar: ", err));
}

console.log("Módulo do Conversor de Case carregado com sucesso!");