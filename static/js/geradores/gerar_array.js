function dispararGeracaoArray() {
    const linguagem = document.getElementById("array-linguagem")?.value || "javascript";
    const estrutura = document.getElementById("array-estrutura")?.value || "array";
    const tipoDado = document.getElementById("array-tipo-dado")?.value || "number";
    const quantidade = parseInt(document.getElementById("array-quantidade")?.value || 10, 10);
    const tamString = parseInt(document.getElementById("array-tamanho-string")?.value || 5, 10);
    const ordenacao = document.getElementById("array-ordenacao")?.value || "aleatorio";
    const permitirRepetidos = document.getElementById("array-repetidos")?.checked;
    const apenasPositivos = document.getElementById("array-positivos")?.checked; 
    const output = document.getElementById("array-resultado");

    if (!output) return;

    const ehMatriz = estrutura === "matriz";
    let dadosParaFormatar;

    if (ehMatriz) {
        let matriz = [];
        // Limita o tamanho da matriz para evitar travamento visual (máximo 15x15)
        const tamMatriz = Math.min(quantidade, 15); 
        for (let i = 0; i < tamMatriz; i++) {
            matriz.push(gerarLinhaDados(tamMatriz, tipoDado, tamString, permitirRepetidos, apenasPositivos));
        }
        dadosParaFormatar = matriz;
    } else {
        dadosParaFormatar = gerarLinhaDados(quantidade, tipoDado, tamString, permitirRepetidos, apenasPositivos);
    }

    // Aplicação de Ordenação
    if (!ehMatriz) {
        aplicarOrdenacao(dadosParaFormatar, ordenacao);
    } else {
        dadosParaFormatar.forEach(linha => aplicarOrdenacao(linha, ordenacao));
    }

    // Formatação Baseada na Linguagem e Tipo de Estrutura
    output.value = formatarEstrutura(dadosParaFormatar, linguagem, estrutura, tipoDado);
}

// Função auxiliar para gerar uma lista simples de dados
function gerarLinhaDados(qtd, tipo, tamStr, repetir, positivos) {
    let elementos = [];
    const maxTentativas = qtd * 20; // Aumentado para evitar loops infinitos se repetidos for falso
    let tentativas = 0;

    while (elementos.length < qtd && tentativas < maxTentativas) {
        tentativas++;
        let novoItem;

        if (tipo === "number") {
            novoItem = positivos 
                ? Math.floor(Math.random() * 150) 
                : Math.floor(Math.random() * 200) - 50;
        } else if (tipo === "string") {
            novoItem = gerarStringAleatoria(tamStr);
        } else {
            novoItem = Math.random() >= 0.5;
        }

        if (!repetir && elementos.includes(novoItem)) {
            if (tipo === "boolean" && elementos.length >= 2) break;
            continue;
        }
        elementos.push(novoItem);
    }
    return elementos;
}

function aplicarOrdenacao(elementos, ordenacao) {
    if (ordenacao === "crescente") {
        elementos.sort((a, b) => typeof a === 'boolean' ? a - b : (a > b ? 1 : -1));
    } else if (ordenacao === "decrescente") {
        elementos.sort((a, b) => typeof a === 'boolean' ? b - a : (a < b ? 1 : -1));
    }
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
    const ehDicionario = est === "dicionario";
    const ehMatriz = est === "matriz";

    const prepararItem = (v) => {
        if (typeof v === 'string') return `"${v}"`;
        if (typeof v === 'boolean') {
            if (lang === 'python') return v ? "True" : "False";
            if (lang === 'php') return v ? "true" : "false";
            return v.toString();
        }
        return v;
    };

    if (ehMatriz) {
        return formatarMatriz(itens, lang, prepararItem, tipo);
    }

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
            let jTipo = tipo === "string" ? "String" : (tipo === "boolean" ? "Boolean" : "Integer");
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

function formatarMatriz(matriz, lang, prepararItem, tipo) {
    const linhasFormatadas = matriz.map(linha => `[${linha.map(prepararItem).join(", ")}]`);
    
    switch (lang) {
        case "javascript":
            return `const minhaMatriz = [\n  ${linhasFormatadas.join(",\n  ")}\n];`;
        case "python":
            return `minha_matriz = [\n    ${linhasFormatadas.join(",\n    ")}\n]`;
        case "java":
            let jTipo = tipo === "string" ? "String" : (tipo === "boolean" ? "boolean" : "int");
            // Substitui colchetes por chaves para a sintaxe de matriz do Java
            const linhasJava = linhasFormatadas.join(",\n  ").replace(/\[/g, '{').replace(/\]/g, '}');
            return `${jTipo}[][] minhaMatriz = {\n  ${linhasJava}\n};`;
        case "php":
            return `$minhaMatriz = [\n    ${linhasFormatadas.join(",\n    ")}\n];`;
        default:
            return linhasFormatadas.join("\n");
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

    const seletores = ["array-linguagem", "array-estrutura", "array-ordenacao", "array-repetidos", "array-positivos", "array-tamanho-string"];
    seletores.forEach(id => {
        document.getElementById(id)?.addEventListener("change", dispararGeracaoArray);
    });
}

// Inicializadores
inicializarEventosArray();
dispararGeracaoArray();