function dispararGeracaoArray() {
    const linguagem = document.getElementById("array-linguagem")?.value || "javascript";
    const estrutura = document.getElementById("array-estrutura")?.value || "array";
    const tipoDado = document.getElementById("array-tipo-dado")?.value || "number";
    const quantidade = parseInt(document.getElementById("array-quantidade")?.value || 10, 10);
    const tamString = parseInt(document.getElementById("array-tamanho-string")?.value || 5, 10);
    const ordenacao = document.getElementById("array-ordenacao")?.value || "aleatorio";
    const permitirRepetidos = document.getElementById("array-repetidos")?.checked;
    const output = document.getElementById("array-resultado");

    if (!output) return;

    let elementos = [];
    const maxTentativas = quantidade * 10; 
    let tentativas = 0;

    // 1. Geração de Dados Brutos
    while (elementos.length < quantidade && tentativas < maxTentativas) {
        tentativas++;
        let novoItem;

        if (tipoDado === "number") {
            novoItem = Math.floor(Math.random() * 200) - 50; // Valores entre -50 e 150
        } else if (tipoDado === "string") {
            novoItem = gerarStringAleatoria(tamString);
        } else {
            novoItem = Math.random() >= 0.5;
        }

        if (!permitirRepetidos && elementos.includes(novoItem)) {
            if (tipoDado === "boolean") { 
                // Booleanos só possuem 2 estados. Força interrupção se já populou ambos.
                if (elementos.length >= 2) break;
            }
            continue; 
        }
        elementos.push(novoItem);
    }

    // 2. Aplicação de Ordenação (se aplicável ao tipo)
    if (ordenacao === "crescente") {
        elementos.sort((a, b) => typeof a === 'boolean' ? a - b : (a > b ? 1 : -1));
    } else if (ordenacao === "decrescente") {
        elementos.sort((a, b) => typeof a === 'boolean' ? b - a : (a < b ? 1 : -1));
    }

    // 3. Formatação Baseada na Linguagem e Tipo de Estrutura escolhida
    output.value = formatarEstrutura(elementos, linguagem, estrutura, tipoDado);
}

function gerarStringAleatoria(tamanho) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let res = "";
    for (let i = 0; i < tamanho; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
}

function formatarEstrutura(itens, lang, est, tipo) {
    // Tratamento preventivo: conjuntos/tuplas não fazem sentido como dicionários clássicos.
    // Se selecionado dicionário, vamos mapear chaves "item_X" ou "kX".
    const ehDicionario = est === "dicionario";

    // Normaliza strings colocando aspas corretas para a representação do código
    const prepararItem = (v) => {
        if (typeof v === 'string') return `"${v}"`;
        if (typeof v === 'boolean') {
            if (lang === 'python') return v ? "True" : "False";
            if (lang === 'php') return v ? "true" : "false";
            return v.toString();
        }
        return v;
    };

    let corpo = "";
    if (ehDicionario) {
        corpo = itens.map((v, idx) => {
            let chave = lang === 'python' || lang === 'php' ? `"${tipo}_${idx + 1}"` : `${tipo}_${idx + 1}`;
            let separador = lang === 'php' ? " => " : ": ";
            return `${chave}${separador}${prepararItem(v)}`;
        }).join(", ");
    } else {
        corpo = itens.map(prepararItem).join(", ");
    }

    // Estruturação sintática por alvo de Compilação/Linguagem
    switch (lang) {
        case "javascript":
            if (est === "array") return `const meuArray = [${corpo}];`;
            if (est === "tupla") return `// JS não possui Tupla nativa (usando Object.freeze)\nconst minhaTupla = Object.freeze([${corpo}]);`;
            if (est === "conjunto") return `const meuSet = new Set([${corpo}]);`;
            return `const meuObjeto = {\n  ${corpo.split(', ').join(',\n  ')}\n};`;

        case "python":
            if (est === "array") return `minha_lista = [${corpo}]`;
            if (est === "tupla") return `minha_tupla = (${corpo}${itens.length === 1 ? ',' : ''})`;
            if (est === "conjunto") return `meu_set = {${corpo}}`;
            return `meu_dict = {\n    ${corpo.split(', ').join(',\n    ')}\n}`;

        case "java":
            let jTipo = "Integer";
            if (tipo === "string") jTipo = "String";
            if (tipo === "boolean") jTipo = "Boolean";

            if (est === "array") return `${jTipo}[] meuArray = new ${jTipo}[]{${corpo}};`;
            if (est === "tupla") return `// Java não possui Tuplas nativas\nList<${jTipo}> minhaTupla = List.of(${corpo});`;
            if (est === "conjunto") return `Set<${jTipo}> meuSet = new HashSet<>(Arrays.asList(${corpo}));`;
            return `Map<String, ${jTipo}> meuMap = Map.of(\n    ${corpo.split(', ').map(x => x.replace(':', ',')).join(',\n    ')}\n);`;

        case "php":
            if (est === "array" || est === "tupla") return `$meuArray = [${corpo}];`;
            if (est === "conjunto") return `// PHP não possui Set nativo\n$meuSet = array_unique([${corpo}]);`;
            return `$meuArrayAssoc = [\n    ${corpo.split(', ').join(',\n    ')}\n];`;

        default:
            return corpo;
    }
}

function inicializarEventosArray() {
    const slider = document.getElementById("array-quantidade");
    const labelVal = document.getElementById("array-qtd-val");
    const tipoDado = document.getElementById("array-tipo-dado");
    const containerString = document.getElementById("container-tamanho-string");

    if (slider && labelVal) {
        slider.addEventListener("input", function() {
            labelVal.textContent = this.value;
            dispararGeracaoArray();
        });
    }

    if (tipoDado && containerString) {
        tipoDado.addEventListener("change", function() {
            containerString.style.display = this.value === "string" ? "block" : "none";
            dispararGeracaoArray();
        });
    }

    // Escuta mudanças gerais nos selects para rebuild imediato em tempo real
    const seletores = ["array-linguagem", "array-estrutura", "array-ordenacao", "array-repetidos", "array-tamanho-string"];
    seletores.forEach(id => {
        document.getElementById(id)?.addEventListener("change", dispararGeracaoArray);
    });
}

// Inicializadores Dinâmicos
inicializarEventosArray();
dispararGeracaoArray();