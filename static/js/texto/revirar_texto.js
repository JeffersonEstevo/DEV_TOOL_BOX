function executarReviradaDeTexto() {
    const input = document.getElementById('original-text');
    const output = document.getElementById('turned-text');

    if (!input || !output) return;

    const originalText = input.value;
    output.value = flipString(originalText);
}

function flipString(text) {
    const chars = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 
        'j': 'ɾ', 'k': 'ʞ', 'l': 'ʃ', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 
        's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z', 
        'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': '◖', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 
        'J': 'ſ', 'K': 'ʞ', 'L': '⅂', 'M': 'W', 'N': 'ᴎ', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴚ', 
        'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Ʌ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
        '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
        '.': '˙', ',': "'", "'": ',', '"': ',', ';': '；', '!': '¡', '?': '¿', '[': ']', ']': '[', 
        '(': ')', ')': '(', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾', '¯': '_',
        ' ': ' '
    };
    
    let result = '';
    for (let i = text.length - 1; i >= 0; i--) {
        result += chars[text[i]] || text[i];
    }
    return result;
}

function limparReviradaDeTexto() {
    const input = document.getElementById('original-text');
    const output = document.getElementById('turned-text');

    if (input) input.value = '';
    if (output) output.value = '';
    console.log("[Revirar] Campos limpos!");
}

console.log("Módulo do Revirador de Texto carregado com sucesso!");