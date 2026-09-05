/* ==========================================================================
   === REDE - Conversor Avançado de Bases Numéricas (Corrigido) ===
   ========================================================================== */

// Mapeamento das bases e suas regras de validação/conversão
window.configuracaoBases = window.configuracaoBases || {
    'base-decimal': { base: 10, regex: /[^0-9]/g },
    'base-binario': { base: 2, regex: /[^01]/g },
    'base-octal': { base: 8, regex: /[^0-7]/g },
    'base-hexadecimal': { base: 16, regex: /[^0-9a-fA-F]/g },
    'base-base32': { base: 32, regex: /[^0-9a-vA-V]/g },
    'base-base64': { base: 64, regex: /.*/g }
};

var configuracaoBases = window.configuracaoBases;

function converterParaBase(decimal, base) {
    if (base === 64) {
        try {
            let hex = decimal.toString(16);
            if (hex.length % 2) hex = '0' + hex;
            let matchResult = hex.match(/.{1,2}/g);
            if (!matchResult) return "";
            let bytes = new Uint8Array(matchResult.map(function(byte) {
                return parseInt(byte, 16);
            }));
            let binString = String.fromCodePoint.apply(null, bytes);
            return btoa(binString);
        } catch(e) {
            return "";
        }
    }
    return decimal.toString(base).toUpperCase();
}

function parseDeBase(valorTexto, base) {
    if (base === 64) {
        try {
            let binString = atob(valorTexto);
            let bytes = Uint8Array.from(binString, function(m) {
                return m.codePointAt(0);
            });
            let hex = Array.from(bytes).map(function(b) {
                return b.toString(16).padStart(2, '0');
            }).join('');
            return parseInt(hex, 16);
        } catch(e) {
            return NaN;
        }
    }
    return parseInt(valorTexto, base);
}

function converterBasesNumericas(idOrigem) {
    const inputOrigem = document.getElementById(idOrigem);
    if (!inputOrigem) return;

    const configOrigem = configuracaoBases[idOrigem];
    let valorTexto = inputOrigem.value.trim();

    if (idOrigem !== 'base-base64') {
        valorTexto = valorTexto.replace(configOrigem.regex, '');
        inputOrigem.value = valorTexto;
    }

    if (valorTexto === '') {
        limparTodosCamposBases();
        return;
    }

    try {
        let numeroDecimal = parseDeBase(valorTexto, configOrigem.base);

        if (isNaN(numeroDecimal)) {
            return;
        }

        Object.keys(configuracaoBases).forEach(function(idDestino) {
            if (idDestino !== idOrigem) {
                const inputDestino = document.getElementById(idDestino);
                if (inputDestino) {
                    const baseDestino = configuracaoBases[idDestino].base;
                    let resultado = converterParaBase(numeroDecimal, baseDestino);
                    inputDestino.value = resultado;
                }
            }
        });

        let binarioPuro = numeroDecimal.toString(2);
        const bit8 = document.getElementById('bit-8');
        const bit16 = document.getElementById('bit-16');
        const bit32 = document.getElementById('bit-32');

        if (bit8) bit8.innerText = binarioPuro.padStart(8, '0').slice(-8);
        if (bit16) bit16.innerText = binarioPuro.padStart(16, '0').slice(-16);
        if (bit32) bit32.innerText = binarioPuro.padStart(32, '0').slice(-32);

    } catch (e) {
        console.error("Erro na conversão: ", e);
    }
}

function limparTodosCamposBases() {
    Object.keys(configuracaoBases).forEach(function(id) {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    const bit8 = document.getElementById('bit-8');
    const bit16 = document.getElementById('bit-16');
    const bit32 = document.getElementById('bit-32');

    if (bit8) bit8.innerText = '00000000';
    if (bit16) bit16.innerText = '0000000000000000';
    if (bit32) bit32.innerText = '00000000000000000000000000000000';
}

function inicializarConversorBases() {
    Object.keys(configuracaoBases).forEach(function(id) {
        const input = document.getElementById(id);
        if (input) {
            if (input._handleInputBases) {
                input.removeEventListener('input', input._handleInputBases);
            }
            input._handleInputBases = function() {
                converterBasesNumericas(id);
            };
            input.addEventListener('input', input._handleInputBases);
        }
    });

    const btnLimpar = document.getElementById('btn-limpar-bases');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparTodosCamposBases);
    }
}

document.addEventListener("DOMContentLoaded", inicializarConversorBases);
if (document.readyState === "complete" || document.readyState === "interactive") {
    inicializarConversorBases();
}