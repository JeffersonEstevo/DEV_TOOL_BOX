// Função auxiliar para obter e limpar as linhas das textareas
function obterLinhasUnicas(idTextArea) {
    const textarea = document.getElementById(idTextArea);
    if (!textarea) return [];
    
    return textarea.value
        .split('\n')
        .map(linha => linha.trim())
        .filter(linha => linha !== ""); // Ignora linhas em branco
}

// Monitora em tempo real a quantidade de itens inseridos
function atualizarContadores() {
    const listA = obterLinhasUnicas("list-a");
    const listB = obterLinhasUnicas("list-b");
    
    const counterA = document.getElementById("counter-a");
    const counterB = document.getElementById("counter-b");
    
    if (counterA) counterA.textContent = listA.length;
    if (counterB) counterB.textContent = listB.length;
}

// Inicializa os listeners para contagem dinâmica ao digitar/colar de forma robusta
function inicializarContadoresDinamicos() {
    const inputA = document.getElementById("list-a");
    const inputB = document.getElementById("list-b");
    
    if (inputA) inputA.addEventListener("input", atualizarContadores);
    if (inputB) inputB.addEventListener("input", atualizarContadores);
    
    // Atualização preventiva caso os campos já possuam dados ao renderizar
    atualizarContadores();
}

// Inicializadores (Garante o funcionamento mesmo em sistemas que carregam páginas via AJAX/Abas)
document.addEventListener("DOMContentLoaded", inicializarContadoresDinamicos);
if (document.readyState === "interactive" || document.readyState === "complete") {
    inicializarContadoresDinamicos();
}

// Executa a comparação entre as listas
function executarComparacaoDeListas() {
    const listA = obterLinhasUnicas("list-a");
    const listB = obterLinhasUnicas("list-b");
    const resultPanel = document.getElementById("result-panel");

    if (listA.length === 0 && listB.length === 0) {
        alert("Por favor, preencha pelo menos uma das listas para comparar.");
        return;
    }

    // Cria conjuntos (Sets) para busca rápida e deduplicação
    const setA = new Set(listA);
    const setB = new Set(listB);

    // 1. Itens apenas na Lista A (estão em A, mas não em B)
    const apenasA = [...setA].filter(item => !setB.has(item));

    // 2. Itens em ambas (interseção de A e B)
    const emAmbas = [...setA].filter(item => setB.has(item));

    // 3. Itens apenas na Lista B (estão em B, mas não em A)
    const apenasB = [...setB].filter(item => !setA.has(item));

    // Renderiza nos respectivos containers de saída
    renderizarLista("output-only-a", "count-only-a", apenasA);
    renderizarLista("output-both", "count-both", emAmbas);
    renderizarLista("output-only-b", "count-only-b", apenasB);

    if (resultPanel) {
        resultPanel.classList.remove("hidden");
        resultPanel.scrollIntoView({ behavior: 'smooth' });
    }
}

// Renderiza a lista de strings dentro do container de forma limpa
function renderizarLista(containerId, counterId, itens) {
    const container = document.getElementById(containerId);
    const counter = document.getElementById(counterId);
    
    if (counter) counter.textContent = itens.length;
    
    if (container) {
        if (itens.length === 0) {
            container.innerHTML = `<span class="empty-list-msg">Nenhum item encontrado</span>`;
        } else {
            // Escapa o HTML de cada linha para evitar quebras visuais e XSS
            container.innerHTML = itens.map(item => escaparHTML(item)).join('\n');
        }
    }
}

// Limpa os campos e esconde os resultados
function limparComparacaoDeListas() {
    const listA = document.getElementById("list-a");
    const listB = document.getElementById("list-b");
    const resultPanel = document.getElementById("result-panel");

    if (listA) listA.value = "";
    if (listB) listB.value = "";
    
    atualizarContadores();

    if (resultPanel) resultPanel.classList.add("hidden");
    console.log("[Comparador de Listas] Campos limpos!");
}

// Auxiliar de escape de caracteres HTML
function escaparHTML(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Função para copiar os dados da coluna de resultado para a área de transferência
function copiarColuna(containerId, botao) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Se a lista estiver vazia, exibe o feedback de "Sem itens" na própria tela
    if (container.querySelector('.empty-list-msg') || container.innerText.trim() === "") {
        const htmlOriginal = container.innerHTML;
        
        // Exibe temporariamente um aviso discreto dentro do card
        container.innerHTML = `<span style="color: var(--danger-color, #dc3545); font-style: italic;">Nenhum item para copiar!</span>`;
        
        setTimeout(() => {
            container.innerHTML = htmlOriginal;
        }, 2000);
        return;
    }

    const textoParaCopiar = container.innerText;

    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        // Feedback visual de sucesso no botão (aparece e some após 2 segundos)
        const htmlOriginal = botao.innerHTML;
        botao.innerHTML = `<i class="bi bi-check-lg"></i> Copiado!`;
        botao.classList.add('copied');
        
        setTimeout(() => {
            botao.innerHTML = htmlOriginal;
            botao.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar dados: ', err);
    });
}