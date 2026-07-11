// 1. Isolamos a função de colagem para podermos referenciá-la com precisão
function tratarColagem(event) {
    // Cancela o comportamento padrão (evita a duplicação)
    event.preventDefault();
    
    // Pega o texto puro da área de transferência
    const text = (event.clipboardData || window.clipboardData).getData("text");
    
    // Insere o texto exatamente onde o cursor do usuário estava posicionado
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const currentValue = this.value;
    
    this.value = currentValue.substring(0, start) + text + currentValue.substring(end);
    
    // Reposiciona o cursor logo após o texto inserido
    this.selectionStart = this.selectionEnd = start + text.length;
}

function inicializarSubstituidor() {
    const originalTextArea = document.getElementById("original-text");
    if (!originalTextArea) return;

    // GARANTIA: Remove o ouvinte antigo antes de adicionar (evita duplicação se reinjetado)
    originalTextArea.removeEventListener("paste", tratarColagem);
    originalTextArea.addEventListener("paste", tratarColagem);
}

function executarSubstituicaoDePalavras() {
    const originalTextArea = document.getElementById("original-text");
    const wordToReplaceInput = document.getElementById("word-to-replace");
    const replacementWordInput = document.getElementById("replacement-word");
    const replaceTabsCheckbox = document.getElementById("replace-tabs");
    const tabReplacementInput = document.getElementById("tab-replacement");
    const output = document.getElementById("final-text");

    if (!originalTextArea || !output) return;

    let originalText = originalTextArea.value;
    const wordToReplace = wordToReplaceInput?.value || "";
    const replacementWord = replacementWordInput?.value || "";
    const replaceTabs = replaceTabsCheckbox?.checked || false;
    let tabReplacement = tabReplacementInput?.value || "    "; // 4 espaços por padrão

    let finalText = originalText;

    if (wordToReplace) {
        // Escapa caracteres especiais para evitar quebrar a inicialização do RegExp nativo
        const escapedWord = wordToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        finalText = finalText.replace(new RegExp(escapedWord, 'g'), replacementWord);
    }

    if (replaceTabs) {
        finalText = finalText.replace(/\t/g, tabReplacement);
    }

    output.value = finalText;
}

function limparSubstituicaoDePalavras() {
    const fields = ["original-text", "word-to-replace", "replacement-word", "tab-replacement", "final-text"];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const checkbox = document.getElementById("replace-tabs");
    if (checkbox) checkbox.checked = false;
    
    console.log("[Substituidor] Painel de dados zerado.");
}

// Dispara o inicializador com segurança
inicializarSubstituidor();