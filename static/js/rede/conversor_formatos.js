// Função auxiliar: Converte Objeto JavaScript para String XML formatada
function objetoParaXml(obj, rootName = "root") {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
    
    function construir(o, indent = "  ") {
        for (let chave in o) {
            if (o.hasOwnProperty(chave)) {
                let valor = o[chave];
                if (typeof valor === "object" && valor !== null) {
                    xml += `${indent}<${chave}>\n`;
                    construir(valor, indent + "  ");
                    xml += `${indent}</${chave}>\n`;
                } else {
                    xml += `${indent}<${chave}>${valor}</${chave}>\n`;
                }
            }
        }
    }
    
    construir(obj);
    xml += `</${rootName}>`;
    return xml;
}

// Função auxiliar: Converte documento XML para um Objeto JavaScript simples
function xmlParaObjeto(xmlNode) {
    if (xmlNode.nodeType === 3) return xmlNode.nodeValue.trim(); // Nó de texto
    if (xmlNode.nodeType === 1 && xmlNode.childNodes.length === 0) return "";

    let obj = {};
    if (xmlNode.childNodes.length === 1 && xmlNode.firstChild.nodeType === 3) {
        return xmlNode.firstChild.nodeValue.trim();
    }

    for (let i = 0; i < xmlNode.childNodes.length; i++) {
        let item = xmlNode.childNodes[i];
        if (item.nodeType === 1) { // Elemento normal
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

    if (typeof jsyaml === 'undefined') {
        outputPre.innerText = "Erro: Biblioteca YAML não carregada.";
        return;
    }

    try {
        let resultado = "";
        const direcao = directionSelect.value;

        if (direcao === "json2yaml") {
            const obj = JSON.parse(textoEntrada);
            resultado = jsyaml.dump(obj, { indent: 2, noRefs: true });

        } else if (direcao === "json2xml") {
            const obj = JSON.parse(textoEntrada);
            resultado = objetoParaXml(obj);

        } else if (direcao === "yaml2json") {
            const obj = jsyaml.load(textoEntrada);
            resultado = JSON.stringify(obj, null, 2);

        } else if (direcao === "xml2json") {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textoEntrada, "text/xml");
            
            // Verifica se o XML possui erro de parsing estrutural interno
            const erroParser = xmlDoc.getElementsByTagName("parsererror");
            if (erroParser.length > 0) {
                throw new Error("Tags XML mal formatadas ou sem fechamento.");
            }
            
            const obj = xmlParaObjeto(xmlDoc.documentElement);
            // Cria um objeto envelopado com a tag raiz para manter a fidelidade
            const resultadoFinal = {};
            resultadoFinal[xmlDoc.documentElement.nodeName] = obj;
            
            resultado = JSON.stringify(resultadoFinal, null, 2);
        }

        errorBox.classList.add("hidden");
        outputPre.innerText = resultado;

    } catch (erro) {
        errorBox.innerText = `Erro de Sintaxe: ${erro.message}`;
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

function inicializarConversorFormatos() {
    const inputArea = document.getElementById("format-input");
    const directionSelect = document.getElementById("format-direction");

    if (inputArea) {
        inputArea.removeEventListener("input", processarConversaoFormatos);
        inputArea.addEventListener("input", processarConversaoFormatos);
    }

    if (directionSelect) {
        directionSelect.addEventListener("change", () => {
            const direcao = directionSelect.value;
            if (direcao === "json2yaml" || direcao === "json2xml") {
                inputArea.placeholder = '{\n  "status": "sucesso",\n  "porta": 8080\n}';
            } else if (direcao === "yaml2json") {
                inputArea.placeholder = 'status: "sucesso"\nporta: 8080';
            } else if (direcao === "xml2json") {
                inputArea.placeholder = '<config>\n  <status>sucesso</status>\n  <porta>8080</porta>\n</config>';
            }
            processarConversaoFormatos();
        });
    }
}

inicializarConversorFormatos();