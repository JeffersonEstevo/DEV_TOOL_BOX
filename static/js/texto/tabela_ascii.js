// Banco de dados explicativo para os caracteres de controle invisíveis (0-31) e o 127
const controleAscii = {
    0: "NUL (null)", 1: "SOH (start of heading)", 2: "STX (start of text)", 3: "ETX (end of text)",
    4: "EOT (end of transmission)", 5: "ENQ (enquiry)", 6: "ACK (acknowledge)", 7: "BEL (bell)",
    8: "BS (backspace)", 9: "TAB (horizontal tab)", 10: "LF (NL line feed, new line)", 11: "VT (vertical tab)",
    12: "FF (NP form feed, new page)", 13: "CR (carriage return)", 14: "SO (shift out)", 15: "SI (shift in)",
    16: "DLE (data link escape)", 17: "DC1 (device control 1)", 18: "DC2 (device control 2)", 19: "DC3 (device control 3)",
    20: "DC4 (device control 4)", 21: "NAK (negative acknowledge)", 22: "SYN (synchronous idle)", 23: "ETB (end of trans. block)",
    24: "CAN (cancel)", 25: "EM (end of medium)", 26: "SUB (substitute)", 27: "ESC (escape)",
    28: "FS (file separator)", 29: "GS (group separator)", 30: "RS (record separator)", 31: "US (unit separator)",
    127: "DEL (delete)"
};

function gerarTabelasASCII() {
    const container = document.getElementById("ascii-tables-container");
    if (!container) return;

    let html = "";

    // Definição das seções
    const secoes = [
        { titulo: "Tabela ASCII: Códigos de Controle (0..31)", min: 0, max: 31 },
        { titulo: "Tabela ASCII: Caracteres-padrão (32..127)", min: 32, max: 127 },
        { titulo: "Tabela ASCII: Caracteres Estendidos (128..255)", min: 128, max: 255 }
    ];

    secoes.forEach(secao => {
        html += `
            <div class="ascii-section" data-min="${secao.min}" data-max="${secao.max}">
                <h3>${secao.titulo}</h3>
                <table class="ascii-table-data">
                    <thead>
                        <tr>
                            <th>Dec</th>
                            <th>Caractere</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (let i = secao.min; i <= secao.max; i++) {
            let caractereExibido = "";
            let charParaBusca = String.fromCharCode(i);
            if (controleAscii[i] !== undefined) {
                charParaBusca = controleAscii[i]; // Permite buscar por "NUL", "LF", "ESC", etc.
            } else if (i === 32) {
                charParaBusca = "SP espaço space";
            }

            if (controleAscii[i] !== undefined) {
                caractereExibido = `<span class="control-char">${controleAscii[i]}</span>`;
            } else if (i === 32) {
                caractereExibido = `<span class="control-char">SP (espaço)</span>`;
            } else if (i >= 128 && i <= 255) {
                // Evita o caractere "?" decodificando como Windows-1252
                const decoder = new TextDecoder('windows-1252');
                const charEstendido = decoder.decode(new Uint8Array([i]));
                
                // Trata pontos vazios/controles da própria tabela estendida
                if (charEstendido.trim() === "" || i === 129 || i === 141 || i === 143 || i === 144 || i === 157) {
                    caractereExibido = `<span class="control-char">Controle (${i})</span>`;
                    charParaBusca = `controle ${i}`;
                } else {
                    caractereExibido = charEstendido;
                    charParaBusca = charEstendido;
                }
            } else {
                caractereExibido = String.fromCharCode(i);
            }

            html += `
                <tr class="ascii-row" data-code="${i}" data-char="${charParaBusca.toLowerCase()}">
                    <td class="ascii-code"><strong>${i}</strong></td>
                    <td class="ascii-char">${caractereExibido}</td>
                </tr>
            `;
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;
    });

    container.innerHTML = html;
}

function filtrarTabelaASCII() {
    const searchInput = document.getElementById("ascii-search");
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const rows = document.querySelectorAll(".ascii-row");
    const sections = document.querySelectorAll(".ascii-section");

    if (!query) {
        // Mostra tudo se a busca estiver vazia
        rows.forEach(row => row.classList.remove("hidden-row"));
        sections.forEach(sec => sec.classList.remove("hidden-row"));
        return;
    }

    rows.forEach(row => {
        const code = row.getAttribute("data-code");
        const char = row.getAttribute("data-char");
        
        // Verifica correspondência do código ou do caractere
        if (code === query || char.includes(query)) {
            row.classList.remove("hidden-row");
        } else {
            row.classList.add("hidden-row"); // Corrigido: removido o ".addClassList =" antigo
        }
    });

    // Oculta seções vazias para melhorar o visual
    sections.forEach(sec => {
        const totalRows = sec.querySelectorAll(".ascii-row").length;
        const hiddenRows = sec.querySelectorAll(".ascii-row.hidden-row").length;
        
        if (totalRows === hiddenRows) {
            sec.classList.add("hidden-row");
        } else {
            sec.classList.remove("hidden-row");
        }
    });
}

function limparBuscaASCII() {
    const searchInput = document.getElementById("ascii-search");
    if (searchInput) {
        searchInput.value = "";
        filtrarTabelaASCII();
    }
}

function inicializarTabelaASCII() {
    gerarTabelasASCII();

    const searchInput = document.getElementById("ascii-search");
    const cleanButton = document.getElementById("clean-ascii-button");

    if (searchInput) {
        searchInput.removeEventListener("input", filtrarTabelaASCII);
        searchInput.addEventListener("input", filtrarTabelaASCII);
    }

    if (cleanButton) {
        cleanButton.removeEventListener("click", limparBuscaASCII);
        cleanButton.addEventListener("click", limparBuscaASCII);
    }
}

// Inicializa o componente assim que o script carrega
inicializarTabelaASCII();