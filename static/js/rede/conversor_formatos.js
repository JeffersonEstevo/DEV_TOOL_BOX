/* ==========================================================================
   === REDE - Canivete Suíço Multiformatos (Estável & Otimizado) ===
   ========================================================================== */

function sanitizarNomeTagXml(chave) {
    let tag = chave.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    if (/^[0-9\-\.]/.test(tag)) {
        tag = `_${tag}`;
    }
    return tag || "item";
}

function objetoParaXml(obj, rootName = "root") {
    const rootFormatado = sanitizarNomeTagXml(rootName);
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootFormatado}>\n`;
    
    function construir(o, indent = "  ") {
        for (let chave in o) {
            if (o.hasOwnProperty(chave)) {
                let valor = o[chave];
                let tagValida = sanitizarNomeTagXml(chave);

                if (typeof valor === "object" && valor !== null) {
                    xml += `${indent}<${tagValida}>\n`;
                    construir(valor, indent + "  ");
                    xml += `${indent}</${tagValida}>\n`;
                } else {
                    xml += `${indent}<${tagValida}>${valor}</${tagValida}>\n`;
                }
            }
        }
    }
    
    construir(obj);
    xml += `</${rootFormatado}>`;
    return xml;
}

function xmlParaObjeto(xmlNode) {
    if (xmlNode.nodeType === 3) return xmlNode.nodeValue.trim();
    if (xmlNode.nodeType === 1 && xmlNode.childNodes.length === 0) return "";

    let obj = {};
    if (xmlNode.childNodes.length === 1 && xmlNode.firstChild.nodeType === 3) {
        return xmlNode.firstChild.nodeValue.trim();
    }

    for (let i = 0; i < xmlNode.childNodes.length; i++) {
        let item = xmlNode.childNodes[i];
        if (item.nodeType === 1) {
            let nomeNode = item.nodeName;
            let valorNode = xmlParaObjeto(item);
            
            if (obj[nomeNode] === undefined) {
                obj[nomeNode] = valorNode;
            } else {
                if (!Array.isArray(obj[nomeNode])) {
                    obj[nomeNode] = [obj[nomeNode]];
                }
                obj[nomeNode].push(valorNode);
            }
        }
    }
    return obj;
}

function jsonParaCsv(data) {
    let array = typeof data != 'object' ? JSON.parse(data) : data;
    if (!Array.isArray(array)) {
        array = [array];
    }
    if (array.length === 0) return "";

    let colunas = Object.keys(array[0]);
    let csv = colunas.join(",") + "\n";

    array.forEach(linha => {
        let linhaCsv = colunas.map(coluna => {
            let valor = linha[coluna] !== undefined ? linha[coluna] : "";
            let valorStr = String(valor);
            if (valorStr.includes(",") || valorStr.includes("\n") || valorStr.includes('"')) {
                valorStr = `"${valorStr.replace(/"/g, '""')}"`;
            }
            return valorStr;
        }).join(",");
        csv += linhaCsv + "\n";
    });

    return csv.trim();
}

function csvParaObjeto(csvText) {
    let linhas = csvText.trim().split("\n");
    if (linhas.length === 0) return [];

    let cabecalho = linhas[0].split(",").map(item => item.trim().replace(/^"(.*)"$/, '$1'));
    let resultado = [];

    for (let i = 1; i < linhas.length; i++) {
        let linhaAtual = linhas[i].split(",");
        let obj = {};
        for (let j = 0; j < cabecalho.length; j++) {
            let val = linhaAtual[j] !== undefined ? linhaAtual[j].trim() : "";
            val = val.replace(/^"(.*)"$/, '$1');
            if (!isNaN(val) && val !== "") {
                val = Number(val);
            } else if (val.toLowerCase() === "true") {
                val = true;
            } else if (val.toLowerCase() === "false") {
                val = false;
            }
            obj[cabecalho[j]] = val;
        }
        resultado.push(obj);
    }
    return resultado;
}

function jsonParaQuery(obj) {
    let plano = {};
    function achatar(o, prefixo = '') {
        for (let k in o) {
            if (o.hasOwnProperty(k)) {
                let chaveCompleta = prefixo ? `${prefixo}[${k}]` : k;
                if (typeof o[k] === 'object' && o[k] !== null && !Array.isArray(o[k])) {
                    achatar(o[k], chaveCompleta);
                } else {
                    plano[chaveCompleta] = o[k];
                }
            }
        }
    }
    achatar(obj);
    const params = new URLSearchParams(plano);
    return params.toString();
}

function queryParaObjeto(queryString) {
    if (queryString.startsWith('?')) queryString = queryString.substring(1);
    const params = new URLSearchParams(queryString);
    let obj = {};
    for (const [key, value] of params.entries()) {
        obj[key] = !isNaN(value) && value !== "" ? Number(value) : value;
    }
    return obj;
}

function detectarFormato(texto) {
    texto = texto.trim();
    if (!texto) return 'vazio';

    if ((texto.startsWith('{') && texto.endsWith('}')) || (texto.startsWith('[') && texto.endsWith(']'))) {
        try { JSON.parse(texto); return 'json'; } catch(e) {}
    }
    if (texto.startsWith('<') && texto.endsWith('>')) return 'xml';
    if (texto.includes('=') && !texto.includes(':') && !texto.includes('{')) return 'query';
    if (texto.includes(',') && texto.split('\n').length > 1) return 'csv';
    return 'yaml';
}

function processarConversaoFormatos() {
    const inputArea = document.getElementById("format-input");
    const outputPre = document.getElementById("format-output");
    const directionSelect = document.getElementById("format-direction");
    const errorBox = document.getElementById("format-error-display");

    if (!inputArea || !outputPre || !directionSelect || !errorBox) return;

    const textoEntrada = inputArea.value.trim();

    if (!textoEntrada) {
        outputPre.innerText = "";
        errorBox.classList.add("hidden");
        return;
    }

    localStorage.setItem("dev_conversor_input", textoEntrada);

    try {
        let resultado = "";
        const direcao = directionSelect.value;
        let tipoDetectado = direcao;

        if (direcao === "auto") {
            const detectado = detectarFormato(textoEntrada);
            if (detectado === 'json') tipoDetectado = 'json2yaml';
            else if (detectado === 'xml') tipoDetectado = 'xml2json';
            else if (detectado === 'csv') tipoDetectado = 'csv2json';
            else if (detectado === 'query') tipoDetectado = 'query2json';
            else tipoDetectado = 'yaml2json';
        }

        if (tipoDetectado === "json2yaml") {
            const obj = JSON.parse(textoEntrada);
            resultado = jsyaml.dump(obj, { indent: 2, noRefs: true });
        } else if (tipoDetectado === "json2xml") {
            const obj = JSON.parse(textoEntrada);
            resultado = objetoParaXml(obj);
        } else if (tipoDetectado === "json2csv") {
            const obj = JSON.parse(textoEntrada);
            resultado = jsonParaCsv(obj);
        } else if (tipoDetectado === "json2query") {
            const obj = JSON.parse(textoEntrada);
            resultado = jsonParaQuery(obj);
        } else if (tipoDetectado === "yaml2json") {
            const obj = jsyaml.load(textoEntrada);
            resultado = JSON.stringify(obj, null, 2);
        } else if (tipoDetectado === "xml2json") {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textoEntrada, "text/xml");
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Tags XML mal formatadas ou sem fechamento.");
            }
            const obj = xmlParaObjeto(xmlDoc.documentElement);
            const resultadoFinal = {};
            resultadoFinal[xmlDoc.documentElement.nodeName] = obj;
            resultado = JSON.stringify(resultadoFinal, null, 2);
        } else if (tipoDetectado === "csv2json") {
            const obj = csvParaObjeto(textoEntrada);
            resultado = JSON.stringify(obj, null, 2);
        } else if (tipoDetectado === "query2json") {
            const obj = queryParaObjeto(textoEntrada);
            resultado = JSON.stringify(obj, null, 2);
        }

        errorBox.classList.add("hidden");
        outputPre.innerText = resultado;

    } catch (erro) {
        errorBox.innerText = `Erro de Sintaxe / Conversão: ${erro.message}`;
        errorBox.classList.remove("hidden");
        outputPre.innerText = "";
    }
}

function limparConversorFormatos() {
    const inputArea = document.getElementById("format-input");
    const outputPre = document.getElementById("format-output");
    const errorBox = document.getElementById("format-error-display");

    if (inputArea) inputArea.value = "";
    if (outputPre) outputPre.innerText = "";
    if (errorBox) {
        errorBox.innerText = "";
        errorBox.classList.add("hidden");
    }
    localStorage.removeItem("dev_conversor_input");
}

function copiarFormatoConvertido() {
    const outputPre = document.getElementById("format-output");
    const alertSpan = document.getElementById("copy-format-alert");
    if (!outputPre) return;

    const textoParaCopiar = outputPre.innerText || outputPre.textContent;
    if (!textoParaCopiar.trim()) return;

    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        if (alertSpan) {
            alertSpan.classList.remove("hidden");
            setTimeout(() => alertSpan.classList.add("hidden"), 2000);
        }
    }).catch(err => console.error("Erro ao copiar: ", err));
}

function minificarJsonInput() {
    const inputArea = document.getElementById("format-input");
    if (!inputArea || !inputArea.value.trim()) return;
    try {
        const parsed = JSON.parse(inputArea.value);
        inputArea.value = JSON.stringify(parsed);
        processarConversaoFormatos();
    } catch(e) {
        alert("O conteúdo atual não é um JSON válido para minificar.");
    }
}

function beautifyJsonInput() {
    const inputArea = document.getElementById("format-input");
    if (!inputArea || !inputArea.value.trim()) return;
    try {
        const parsed = JSON.parse(inputArea.value);
        inputArea.value = JSON.stringify(parsed, null, 2);
        processarConversaoFormatos();
    } catch(e) {
        alert("O conteúdo atual não é um JSON válido para formatar.");
    }
}

function inicializarConversorFormatos() {
    const inputArea = document.getElementById("format-input");
    const directionSelect = document.getElementById("format-direction");
    const btnClean = document.getElementById("clean-format-button");
    const btnCopy = document.getElementById("copy-format-button");
    const btnMinify = document.getElementById("btn-minify");
    const btnBeautify = document.getElementById("btn-beautify");

    const rascunhoSalvo = localStorage.getItem("dev_conversor_input");
    if (inputArea && rascunhoSalvo) {
        inputArea.value = rascunhoSalvo;
        setTimeout(processarConversaoFormatos, 100);
    }

    if (inputArea) inputArea.addEventListener("input", processarConversaoFormatos);
    if (directionSelect) directionSelect.addEventListener("change", processarConversaoFormatos);
    if (btnClean) btnClean.addEventListener("click", limparConversorFormatos);
    if (btnCopy) btnCopy.addEventListener("click", copiarFormatoConvertido);
    if (btnMinify) btnMinify.addEventListener("click", minificarJsonInput);
    if (btnBeautify) btnBeautify.addEventListener("click", beautifyJsonInput);
}

document.addEventListener("DOMContentLoaded", inicializarConversorFormatos);
if (document.readyState === "complete" || document.readyState === "interactive") {
    inicializarConversorFormatos();
}