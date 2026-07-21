// === 01. TEXTO - 18. Tachar Texto ===

function executarTacharTexto() {
    const originalTextArea = document.getElementById("original-text");
    const output = document.getElementById("final-text");

    if (!originalTextArea || !output) return;

    const originalText = originalTextArea.value;

    if (!originalText.trim()) return;

    // Aplica o caractere Unicode combinatório de tachar (\u0336)
    const finalText = originalText
        .split("")
        .map(char => (char === "\n" || char === "\r" ? char : char + "\u0336"))
        .join("");

    output.value = finalText;
}

function copiarTextoTachado() {
    const output = document.getElementById("final-text");
    const alertBox = document.getElementById("copy-strike-alert");

    if (!output || !output.value.trim()) return;

    navigator.clipboard.writeText(output.value).then(() => {
        if (alertBox) {
            alertBox.classList.remove("hidden");
            setTimeout(() => {
                alertBox.classList.add("hidden");
            }, 3000);
        }
    }).catch(err => {
        console.error("[Tachar Texto] Erro ao copiar texto: ", err);
    });
}

function limparTacharTexto() {
    const fields = ["original-text", "final-text"];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const alertBox = document.getElementById("copy-strike-alert");
    if (alertBox) alertBox.classList.add("hidden");
    
    console.log("[Tachar Texto] Painel de dados zerado.");
}