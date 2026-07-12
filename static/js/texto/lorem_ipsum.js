// Banco de palavras base do Lorem Ipsum para gerar os textos dinamicamente
const loremWordsBase = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
    "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
    "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
    "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
    "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
    "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

// Função auxiliar para gerar uma frase aleatória
function gerarFrase(minPalavras = 5, maxPalavras = 15) {
    const qtdWords = Math.floor(Math.random() * (maxPalavras - minPalavras + 1)) + minPalavras;
    let frase = [];
    
    for (let i = 0; i < qtdWords; i++) {
        const randomIndex = Math.floor(Math.random() * loremWordsBase.length);
        frase.push(loremWordsBase[randomIndex]);
    }
    
    let textoFrase = frase.join(" ");
    return textoFrase.charAt(0).toUpperCase() + textoFrase.slice(1) + ".";
}

// Função auxiliar para gerar um parágrafo composto de várias frases
function gerarParagrafo(minFrases = 3, maxFrases = 6) {
    const qtdFrases = Math.floor(Math.random() * (maxFrases - minFrases + 1)) + minFrases;
    let paragrafo = [];
    
    for (let i = 0; i < qtdFrases; i++) {
        paragrafo.push(gerarFrase());
    }
    
    return paragrafo.join(" ");
}

// Função principal de geração engatada ao botão do scripts.js
function processarGeracaoLorem() {
    const amountInput = document.getElementById("lorem-amount");
    const unitSelect = document.getElementById("lorem-unit");
    const outputDiv = document.getElementById("lorem-output");
    
    if (!amountInput || !unitSelect || !outputDiv) return;

    const quantidade = parseInt(amountInput.value) || 1;
    const unidade = unitSelect.value;
    const tipoTexto = document.querySelector('input[name="lorem-type"]:checked').value;
    const iniciarComLorem = document.querySelector('input[name="lorem-start"]:checked').value;

    let resultadoArray = [];

    // Se for solicitado gerar PARÁGRAFOS
    if (unidade === "paragraphs") {
        for (let i = 0; i < quantidade; i++) {
            resultadoArray.push(gerarParagrafo());
        }
        
        // Aplica a regra de iniciar com "Lorem ipsum dolor sit amet..."
        if (iniciarComLorem === "yes" && resultadoArray.length > 0) {
            const inicioPadrao = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
            resultadoArray[0] = inicioPadrao + resultadoArray[0].charAt(0).toLowerCase() + resultadoArray[0].slice(1);
        }

        // Formata a saída baseado no Tipo de Texto (Texto x HTML)
        if (tipoTexto === "html") {
            outputDiv.innerText = resultadoArray.map(p => `<p>${p}</p>`).join("\n\n");
        } else {
            outputDiv.innerHTML = resultadoArray.map(p => `<p style="margin-bottom: 1rem;">${p}</p>`).join("");
        }

    // Se for solicitado gerar PALAVRAS
    } else if (unidade === "words") {
        let palavrasResultado = [];
        
        if (iniciarComLorem === "yes") {
            palavrasResultado = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];
        }

        while (palavrasResultado.length < quantidade) {
            const randomIndex = Math.floor(Math.random() * loremWordsBase.length);
            palavrasResultado.push(loremWordsBase[randomIndex]);
        }

        // Corta o excesso caso o "Lorem Ipsum" inicial ultrapasse o limite pedido
        palavrasResultado = palavrasResultado.slice(0, quantidade);
        
        let textoFinal = palavrasResultado.join(" ");
        textoFinal = textoFinal.charAt(0).toUpperCase() + textoFinal.slice(1) + ".";

        if (tipoTexto === "html") {
            outputDiv.innerText = `<p>${textoFinal}</p>`;
        } else {
            outputDiv.innerHTML = `<p>${textoFinal}</p>`;
        }
    }
}

// Função de limpeza engatada ao botão do scripts.js
function limparLorem() {
    const outputDiv = document.getElementById("lorem-output");
    const amountInput = document.getElementById("lorem-amount");
    
    if (outputDiv) outputDiv.innerHTML = "";
    if (amountInput) amountInput.value = "3";
}

// Função de cópia com suporte ao Alerta Toast engatada ao botão do scripts.js
function copiarLoremParaAreaTransferencia() {
    const outputDiv = document.getElementById("lorem-output");
    const alertSpan = document.getElementById("copy-lorem-alert");
    if (!outputDiv) return;

    const textoParaCopiar = outputDiv.innerText || outputDiv.textContent;

    if (!textoParaCopiar.trim()) {
        return; // Impede copiar container vazio
    }

    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        if (alertSpan) {
            // Remove a classe hidden para exibir o toast de sucesso
            alertSpan.classList.remove("hidden");
            
            // Oculta o toast novamente após 2 segundos
            setTimeout(() => {
                alertSpan.classList.add("hidden");
            }, 2000);
        }
    }).catch(err => {
        console.error("Erro ao copiar o texto: ", err);
    });
}

// Inicializador seguro do componente
function inicializarGeradorLorem() {
    // Carrega um conteúdo inicial padrão ao renderizar a tela
    processarGeracaoLorem();
}

// Executa a inicialização do módulo
inicializarGeradorLorem();
