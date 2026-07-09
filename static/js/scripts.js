document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // 1. FUNÇÃO GLOBAL DO MENU LATERAL (SIDEBAR)
    // ==========================================================================
    function toggleMenu() {
        const appContainer = document.getElementById("app-container");
        const toggleIcon = document.getElementById("toggle-icon");
        
        if (appContainer && toggleIcon) {
            // Alterna a classe que esconde o menu
            appContainer.classList.toggle("sidebar-hidden");
            
            // Se 'sidebar-hidden' está ativa (menu recolhido) -> Seta para a ESQUERDA
            // Se não está ativa (menu aberto) -> Seta para a DIREITA
            if (appContainer.classList.contains("sidebar-hidden")) {
                toggleIcon.className = "bi bi-arrow-left-short";
            } else {
                toggleIcon.className = "bi bi-arrow-right-short";
            }
        }
    }

    // ==========================================================================
    // 2. INICIALIZAÇÃO DE COMPONENTES APÓS O CARREGAMENTO DA PÁGINA
    // ==========================================================================
    document.addEventListener("DOMContentLoaded", () => {

        // === CONTROLE DO MODO ESCURO ===
        const themeToggle = document.getElementById("theme-toggle");
        const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
        const body = document.body;

        // Verifica se o usuário já tinha uma preferência salva no navegador
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            body.classList.add("dark-mode");
            if (themeIcon) themeIcon.className = "bi bi-sun";
        }

        if (themeToggle && themeIcon) {
            themeToggle.addEventListener("click", () => {
                body.classList.toggle("dark-mode");
                
                if (body.classList.contains("dark-mode")) {
                    themeIcon.className = "bi bi-sun"; // Ícone de sol para voltar pro claro
                    localStorage.setItem("theme", "dark");
                } else {
                    themeIcon.className = "bi bi-moon-stars"; // Ícone de lua para ir pro escuro
                    localStorage.setItem("theme", "light");
                }
            });
        }

        // === ATUALIZAÇÃO DO ANO NO FOOTER ===
        const yearSpan = document.getElementById("current-year");
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    });

    /* ==========================================================================
       3. CARREGADOR SPA COMPATÍVEL COM ROTAS LOCAIS E EM SERVIDOR
       ========================================================================== */
    function carregarConteudo(hash) {
        // Limpa o hash para descobrir o caminho do arquivo real
        let caminhoArquivo = hash.replace(/^#\/?/, ""); 

        if (!caminhoArquivo || caminhoArquivo === "#" || caminhoArquivo === "") {
            return;
        }

        console.log(`%c[Roteador] Buscando HTML em: ${caminhoArquivo}`, "color: #4f46e5; font-weight: bold;");

        fetch(caminhoArquivo)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} - Não foi possível encontrar o arquivo.`);
                }
                return response.text();
            })
            .then(htmlPuro => {
                const areaPrincipal = document.querySelector("#content-area");
                if (!areaPrincipal) return;

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlPuro, "text/html");
                
                // 1. Isola e remove as tags script para tratamento manual
                const scriptsNoHtml = doc.querySelectorAll("script");
                scriptsNoHtml.forEach(s => s.remove());
                
                // 2. Injeta o HTML renderizado na área principal
                areaPrincipal.innerHTML = doc.body.innerHTML;
                console.log("%c[Roteador] HTML injetado com sucesso no DOM!", "color: #166534;");

                // 3. Injeta os scripts de forma assíncrona controlada
                scriptsNoHtml.forEach(scriptOrigem => {
                    const novoScript = document.createElement("script");
                    
                    if (scriptOrigem.src) {
                        let srcLimpo = scriptOrigem.getAttribute("src").replace(/^(\.\.\/|\.\/)/, "");
                        if (srcLimpo.startsWith("/")) srcLimpo = srcLimpo.substring(1);

                        // Remove réplicas antigas do mesmo script rodando na memória
                        document.querySelectorAll(`script`).forEach(s => {
                            if (s.src && s.src.includes(srcLimpo.split('?')[0])) {
                                s.remove();
                            }
                        });

                        // Força o navegador a re-executar o script limpando o cache cache via timestamp (?t=...)
                        novoScript.src = `${srcLimpo}?t=${Date.now()}`;
                        novoScript.async = false; 
                        document.body.appendChild(novoScript);
                    } else {
                        novoScript.textContent = scriptOrigem.textContent;
                        document.body.appendChild(novoScript);
                    }
                });
            })
            .catch(error => {
                console.error("%c[Roteador Erro Crítico]", "color: #991b1b; font-weight: bold;", error.message);
                const areaPrincipal = document.querySelector("#content-area");
                if (areaPrincipal) {
                    areaPrincipal.innerHTML = `
                        <div style="padding: 2rem; border: 1px dashed #fca5a5; background: #fef2f2; color: #991b1b; border-radius: 8px;">
                            <h3>Erro ao carregar a ferramenta</h3>
                            <p>O arquivo <strong>"${caminhoArquivo}"</strong> não foi encontrado nas suas pastas locais.</p>
                            <small>Verifique se o nome está correto ou se o link na sidebar possui letras maiúsculas/plural incorretos.</small>
                        </div>
                    `;
                }
            });
    }

    /* ==========================================================================
       4. MONITORAMENTO DE EVENTOS DE LINKS
       ========================================================================== */
    document.addEventListener("click", function (e) {
        const link = e.target.closest(".nav-link");
        if (link) {
            const paginaAlvo = link.getAttribute("href");
            if (paginaAlvo && paginaAlvo.startsWith("#/")) {
                carregarConteudo(paginaAlvo);
            }
        }
    });

    window.addEventListener("hashchange", function () {
        carregarConteudo(window.location.hash);
    });

    if (window.location.hash) {
        carregarConteudo(window.location.hash);
    }

    /* ==========================================================================
      5. FUNÇÃO GLOBAL DE CÓPIA (Para todas as ferramentas)
    ========================================================================== */
    window.copiarTextoDeElemento = function(idElemento, idAlerta) {
        const elementoTexto = document.getElementById(idElemento);
        const alerta = document.getElementById(idAlerta);
        
        if (!elementoTexto || elementoTexto.value.trim() === "") {
            console.warn(`[Cópia] Elemento #${idElemento} vazio ou não encontrado.`);
            return;
        }

        // API Moderna de Área de Transferência
        navigator.clipboard.writeText(elementoTexto.value)
            .then(() => {
                if (alerta) {
                    alerta.classList.remove('hidden');
                    setTimeout(() => alerta.classList.add('hidden'), 2000);
                }
                console.log(`[Cópia] Conteúdo de #${idElemento} copiado com sucesso!`);
            })
            .catch(err => {
                console.error("[Cópia Erro] Falha ao copiar texto: ", err);
            });
    };

    /* ==========================================================================
     6.  DELEGAÇÃO DE CLIQUES - CONVERSOR DE TEXTO
    ========================================================================== */
    document.addEventListener("click", function (event) {
        if (event.target.closest('#lowercase-letter-button')) { event.preventDefault(); convertToLowercase(); }
        if (event.target.closest('#uppercase-letter-button')) { event.preventDefault(); convertToUppercase(); }
        if (event.target.closest('#capitalize-button'))       { event.preventDefault(); capitalizeText(); }
        if (event.target.closest('#alternate-button'))        { event.preventDefault(); alternateText(); }
        if (event.target.closest('#camelcase-button'))        { event.preventDefault(); convertToCamelCase(); }
        if (event.target.closest('#clean-button'))            { event.preventDefault(); cleanText(); }
        
        // Chamada atualizada para o botão de copiar usando a nova função global
        if (event.target.closest('#copy-button')) { 
            event.preventDefault(); 
            window.copiarTextoDeElemento('modified-text', 'copy-alert'); 
        }
                // Copiar reaproveitando a função global do sistema
        if (event.target.closest('#copy-invert-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('inverted-text', 'copy-invert-alert');
        }

        
        // --- 4. FERRAMENTA: INVERSOR DE TEXTO ---
        if (event.target.closest('#invert-button')) {
            event.preventDefault();
            if (typeof executarInversaoDeTexto === "function") executarInversaoDeTexto();
        }
        
        if (event.target.closest('#clean-invert-button')) {
            event.preventDefault();
            if (typeof limparInversaoDeTexto === "function") limparInversaoDeTexto();
        }
        

        // --- 5. FERRAMENTA: LEITURA DINÂMICA ---
        if (event.target.closest('#start-button')) {
            event.preventDefault();
            if (typeof iniciarLeituraDinamica === "function") iniciarLeituraDinamica();
        }
        if (event.target.closest('#stop-button')) {
            event.preventDefault();
            if (typeof pararLeituraDinamica === "function") pararLeituraDinamica();
        }
        // --- 6. FERRAMENTA: REMOVER ACENTOS ---
        if (event.target.closest('#remove-accents-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDeAcentos === "function") executarRemocaoDeAcentos();
        }

        if (event.target.closest('#clean-accents-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDeAcentos === "function") limparRemocaoDeAcentos();
        }

        // Integração direta com a sua função global unificada de cópia
        if (event.target.closest('#copy-accents-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-accents-alert');
        }
        // --- 7. FERRAMENTA: REMOVER ESPAÇOS EXTRA ---
        if (event.target.closest('#remove-space-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDeEspacos === "function") executarRemocaoDeEspacos();
        }

        if (event.target.closest('#clean-spaces-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDeEspacos === "function") limparRemocaoDeEspacos();
        }

        // Utiliza o nosso motor mestre unificado de cópia
        if (event.target.closest('#copy-spaces-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-spaces-alert');
        }
        // --- 8. FERRAMENTA: REMOVER PONTUAÇÃO ---
        if (event.target.closest('#remove-punctuation-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDePontuacao === "function") executarRemocaoDePontuacao();
        }

        if (event.target.closest('#clean-punctuation-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDePontuacao === "function") limparRemocaoDePontuacao();
        }

        // Integração perfeita com a cópia centralizada
        if (event.target.closest('#copy-punctuation-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-punctuation-alert');
        }    
        // --- 9. FERRAMENTA: REMOVER QUEBRAS ---
        if (event.target.closest('#remove-linebreaks-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDeQuebras === "function") executarRemocaoDeQuebras();
        }

        if (event.target.closest('#clean-linebreaks-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDeQuebras === "function") limparRemocaoDeQuebras();
        }

        // Motor mestre de cópia reaproveitado
        if (event.target.closest('#copy-linebreaks-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-linebreaks-alert');
        }
        // --- 10. FERRAMENTA: EXTRAIR/REMOVER ENTRE CARACTERES ---
        if (event.target.closest('#extract-button')) {
            event.preventDefault();
            if (typeof executarExtracaoPorDelimitadores === "function") executarExtracaoPorDelimitadores();
        }

        if (event.target.closest('#clean-delimiters-button')) {
            event.preventDefault();
            if (typeof limparExtracaoPorDelimitadores === "function") limparExtracaoPorDelimitadores();
        }

        // Cópia centralizada usando o ID correto do campo de saída
        if (event.target.closest('#copy-delimiters-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('extracted-text', 'copy-delimiters-alert');
        }
        // --- 11. FERRAMENTA: REVIRAR TEXTO ---
        if (event.target.closest('#turn-button')) {
            event.preventDefault();
            if (typeof executarReviradaDeTexto === "function") executarReviradaDeTexto();
        }

        if (event.target.closest('#clean-flip-button')) {
            event.preventDefault();
            if (typeof limparReviradaDeTexto === "function") limparReviradaDeTexto();
        }

        // Integração cirúrgica com o motor mestre de cópia da SPA
        if (event.target.closest('#copy-flip-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('turned-text', 'copy-flip-alert');
        }
        // --- 12. FERRAMENTA: SIMILARIDADE ENTRE TEXTOS ---
        if (event.target.closest('#calc-similarity-button')) {
            event.preventDefault();
            if (typeof executarCalculoDeSimilaridade === "function") executarCalculoDeSimilaridade();
        }

        if (event.target.closest('#clean-similarity-button')) {
            event.preventDefault();
            if (typeof limparCalculoDeSimilaridade === "function") limparCalculoDeSimilaridade();
        }
        // --- 13. FERRAMENTA: SUBSTITUIR PALAVRAS ---
        if (event.target.closest('#replace-button')) {
            event.preventDefault();
            if (typeof executarSubstituicaoDePalavras === "function") executarSubstituicaoDePalavras();
        }

        if (event.target.closest('#clean-replace-button')) {
            event.preventDefault();
            if (typeof limparSubstituicaoDePalavras === "function") limparSubstituicaoDePalavras();
        }

        // Cópia centralizada apontando para o id do textarea modificado desta ferramenta
        if (event.target.closest('#copy-replace-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('final-text', 'copy-replace-alert');
        }
        // --- 14. CALCULADORA: FRAÇÕES ---
        if (event.target.closest('#calc-fraction-button')) {
            event.preventDefault();
            if (typeof executarCalculoDeFracao === "function") executarCalculoDeFracao();
        }

        if (event.target.closest('#clean-fraction-button')) {
            event.preventDefault();
            if (typeof limparCalculoDeFracao === "function") limparCalculoDeFracao();
        }
        // --- 15. FERRAMENTA: MÉDIA ARITMÉTICA ---
        if (event.target.closest('#clean-mean-button')) {
            event.preventDefault();
            if (typeof limparMediaAritmetica === "function") limparMediaAritmetica();
        }

        if (event.target.closest('#copy-terms-btn')) {
            event.preventDefault();
            window.copiarTextoDeElemento('number-of-terms', 'mean-metrics-alert');
        }

        if (event.target.closest('#copy-min-btn')) {
            event.preventDefault();
            window.copiarTextoDeElemento('min-value', 'mean-metrics-alert');
        }

        if (event.target.closest('#copy-max-btn')) {
            event.preventDefault();
            window.copiarTextoDeElemento('max-value', 'mean-metrics-alert');
        }

        if (event.target.closest('#copy-range-btn')) {
            event.preventDefault();
            window.copiarTextoDeElemento('range-values', 'mean-metrics-alert');
        }

        if (event.target.closest('#copy-mean-btn')) {
            event.preventDefault();
            window.copiarTextoDeElemento('mean-value', 'mean-metrics-alert');
        }
        // --- 16. CALCULADORA: PORCENTAGEM ---
        if (event.target.closest('#clean-percentage-button')) {
            event.preventDefault();
            if (typeof limparCalculadoraPorcentagem === "function") limparCalculadoraPorcentagem();
        }

        if (event.target.closest('#copy-pct-quantity')) {
            event.preventDefault();
            window.copiarTextoDeElemento('result-quantity', 'percentage-global-alert');
        }

        if (event.target.closest('#copy-pct-percentage')) {
            event.preventDefault();
            window.copiarTextoDeElemento('result-percentage', 'percentage-global-alert');
        }

        if (event.target.closest('#copy-pct-total')) {
            event.preventDefault();
            window.copiarTextoDeElemento('result-total-value', 'percentage-global-alert');
        }

        if (event.target.closest('#copy-pct-increase')) {
            event.preventDefault();
            window.copiarTextoDeElemento('result-increase', 'percentage-global-alert');
        }

        if (event.target.closest('#copy-pct-decrease')) {
            event.preventDefault();
            window.copiarTextoDeElemento('result-decrease', 'percentage-global-alert');
        }
        // --- 17. CALCULADORA: REGRA DE TRÊS ---
        if (event.target.closest('#clean-rule-button')) {
            event.preventDefault();
            if (typeof limparRegraDeTres === "function") limparRegraDeTres();
        }

        if (event.target.closest('#copy-rule-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('value-x', 'rule-three-alert');
        }
        // --- 18. GERADOR: CPF ---
        if (event.target.closest('#btn-gerar-cpf')) {
            event.preventDefault();
            if (typeof dispararGeracaoCPF === "function") dispararGeracaoCPF();
        }

        if (event.target.closest('#btn-copiar-cpf')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cpf-resultado', 'cpf-generator-alert');
        }
        // --- 19. GERADOR: CEP ---
        if (event.target.closest('#btn-gerar-cep')) {
            event.preventDefault();
            if (typeof dispararGeracaoCEP === "function") dispararGeracaoCEP();
        }

        if (event.target.closest('#btn-copiar-cep')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cep-resultado', 'cep-generator-alert');
        }
        // --- 20. GERADOR: CNPJ ---
        if (event.target.closest('#btn-gerar-cnpj')) {
            event.preventDefault();
            if (typeof dispararGeracaoCNPJ === "function") dispararGeracaoCNPJ();
        }

        if (event.target.closest('#btn-copiar-cnpj')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cnpj-resultado', 'cnpj-generator-alert');
        }
        // --- 21. GERADOR: CARTÃO DE CRÉDITO ---
        if (event.target.closest('#btn-gerar-cartao')) {
            event.preventDefault();
            if (typeof dispararGeracaoCartao === "function") dispararGeracaoCartao();
        }

        if (event.target.closest('#btn-copiar-cartao')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cartao-resultado', 'cartao-generator-alert');
        }
        // --- 22. GERADOR: UUID ---
        if (event.target.closest('#btn-gerar-uuid')) {
            event.preventDefault();
            if (typeof dispararGeracaoUUID === "function") dispararGeracaoUUID();
        }

        if (event.target.closest('#btn-copiar-uuid')) {
            event.preventDefault();
            window.copiarTextoDeElemento('uuid-resultado', 'uuid-generator-alert');
        }
        // --- 23. GERADOR: PERFIL DE PESSOA ---
        if (event.target.closest('#btn-gerar-pessoa')) {
            event.preventDefault();
            if (typeof dispararGeracaoPessoa === "function") dispararGeracaoPessoa();
        }
        // --- 24. CONVERSOR: COMPRIMENTO ---
        if (event.target.closest('#btn-limpar-comprimento')) {
            event.preventDefault();
            if (typeof limparTodosCamposComprimento === "function") limparTodosCamposComprimento();
        }
        // --- 25. CONVERSOR: MASSA ---
        if (event.target.closest('#btn-limpar-massa')) {
            event.preventDefault();
            if (typeof limparTodosCamposMassa === "function") limparTodosCamposMassa();
        }
        // --- 26. CONVERSOR: TEMPERATURA ---
        if (event.target.closest('#btn-limpar-temperatura')) {
            event.preventDefault();
            if (typeof limparTodosCamposTemperatura === "function") limparTodosCamposTemperatura();
        }
          // --- 27. CONVERSOR: TEMPO ---
        if (event.target.closest('#btn-limpar-tempo')) {
            event.preventDefault();
            if (typeof limparTodosCamposTempo === "function") limparTodosCamposTempo();
        }
        // --- 28. CONVERSOR: VELOCIDADE ---
        if (event.target.closest('#btn-limpar-velocidade')) {
            event.preventDefault();
            if (typeof limparTodosCamposVelocidade === "function") limparTodosCamposVelocidade();
        }
        // --- 29. CONVERSOR: GRANDEZAS ELÉTRICAS ---
        if (event.target.closest('#btn-limpar-eletrica')) {
            event.preventDefault();
            if (typeof limparTudoEletrica === "function") limparTudoEletrica();
        }
        // --- 30. CONVERSOR: TENSÃO TRIFÁSICA ---
        if (event.target.closest('#btn-limpar-trifasica')) {
            event.preventDefault();
            if (typeof limparCamposTrifasica === "function") limparCamposTrifasica();
        }
        // --- 31. REDE: MÁSCARA E CIDR ---
        if (event.target.closest('#btn-limpar-rede')) {
            event.preventDefault();
            if (typeof limparTudoRede === "function") limparTudoRede();
        }
        // --- 32. REDE: CONVERSOR DE BASES ---
        if (event.target.closest('#btn-limpar-bases')) {
            event.preventDefault();
            if (typeof limparTodosCamposBases === "function") limparTodosCamposBases();
        }
        // --- 33. DATA E HORA: CALCULADORA DE HORAS ---
        if (event.target.closest('#btn-limpar-horas')) {
            event.preventDefault();
            if (typeof limparTodosCamposHoras === "function") limparTodosCamposHoras();
        }
        // --- 34. DATA E HORA: CONTADOR DE DIAS ---
        if (event.target.closest('#btn-limpar-dias')) {
            event.preventDefault();
            if (typeof limparTodosCamposDias === "function") limparTodosCamposDias();
        }
        // --- 35. DATA E HORA: SUBTRAÇÃO DE DATAS ---
        if (event.target.closest('#btn-limpar-sub-datas')) {
            event.preventDefault();
            if (typeof limparTodosCamposSubDatas === "function") limparTodosCamposSubDatas();
        }
        // --- 36. DATA E HORA: CONVERSOR DATA / DECIMAL ---
        if (event.target.closest('#btn-limpar-conv-datas')) {
            event.preventDefault();
            if (typeof limparTodosCamposConv === "function") limparTodosCamposConv();
        }
        // --- 37. DATA E HORA: CONVERSOR DATA / DECIMAL ---
        if (event.target.closest('#btn-limpar-conv-datas')) {
            event.preventDefault();
            if (typeof limparTodosCamposConv === "function") limparTodosCamposConv();
        }
        // --- 38. FERRAMENTA: SELETOR DE CORES ---
        if (event.target.closest('#btn-limpar-cores')) {
            event.preventDefault();
            if (typeof atualizarInterfacePorHex === "function") {
                atualizarInterfacePorHex('#3498DB'); // Reseta para o azul padrão
            }
        }



        // Atalho global para fechar o leitor dinâmico
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                if (typeof pararLeituraDinamica === "function") pararLeituraDinamica();
            }
        });
    });



    /* ==========================================================================
    7. DELEGAÇÃO DE CLIQUES PARA FERRAMENTAS INTERNAS (PÁGINAS INJETADAS)
    ========================================================================== */
    document.addEventListener("click", function (event) {
        // Captura o clique do botão Comparar Textos
        const compareBtn = event.target.closest("#compare-button");
        if (compareBtn) {
            event.preventDefault();
            // Verifica se a função da ferramenta existe antes de chamá-la
            if (typeof executarComparacaoDeTextos === "function") {
                executarComparacaoDeTextos();
            } else {
                console.error("A engine de comparação de textos não está carregada na memória.");
            }
        }

        // Captura o clique do botão Limpar
        const clearBtn = event.target.closest("#clear-button");
        if (clearBtn) {
            event.preventDefault();
            if (typeof limparComparacaoDeTextos === "function") {
                limparComparacaoDeTextos();
            }
        }
    });

});


// Atualiza o ano do copyright automaticamente para footer
document.getElementById('current-year').textContent = new Date().getFullYear();


// ==========================================================================
// 8. SISTEMA AUTOMÁTICO DE CARREGAMENTO DE CSS SOB DEMANDA (SPA)
// ==========================================================================
function gerenciarCSSDaFerramenta() {
    // 1. Remove o CSS da ferramenta anterior para não acumular lixo na página
    const antigoCSS = document.getElementById('css-da-ferramenta');
    if (antigoCSS) antigoCSS.remove();

    // 2. Pega a rota atual (ex: "#/texto/comparar_textos.html")
    const rota = window.location.hash;

    // Se o usuário estiver na Home (sem hash) ou no "Sobre", não precisa carregar CSS dinâmico
    if (!rota || rota === "#" || rota.includes("sobre.html")) {
        return; 
    }

    // 3. Magia da conversão: 
    // Transforma "#/texto/comparar_textos.html" em "static/css/texto/comparar_textos.css"
    let caminhoCSS = rota.replace('#/', 'static/css/').replace('.html', '.css');

    // 4. Cria a tag <link> e injeta no <head> do seu index.html
    const novoLink = document.createElement('link');
    novoLink.id = 'css-da-ferramenta';
    novoLink.rel = 'stylesheet';
    novoLink.href = caminhoCSS;

    document.head.appendChild(novoLink);
}

// Escuta quando o usuário clica nos menus laterais (troca o hash)
window.addEventListener('hashchange', gerenciarCSSDaFerramenta);

// Escuta quando a página é atualizada direto em uma rota específica (F5)
window.addEventListener('DOMContentLoaded', gerenciarCSSDaFerramenta);


document.addEventListener("DOMContentLoaded", () => {
    // === CONTROLE DA SIDEBAR (MENU LATERAL) ===
    const sidebarToggle = document.getElementById("sidebarToggle");
    const toggleIcon = document.getElementById("toggle-icon");
    const appContainer = document.getElementById("app-container");

    if (sidebarToggle && toggleIcon && appContainer) {
        sidebarToggle.addEventListener("click", () => {
            appContainer.classList.toggle("sidebar-hidden");
            
            // Altera o ícone da seta conforme o estado escondido ou visível
            if (appContainer.classList.contains("sidebar-hidden")) {
                toggleIcon.className = "bi bi-chevron-right";
            } else {
                toggleIcon.className = "bi bi-chevron-left";
            }
        });
    }

    // === CONTROLE DO MODO ESCURO ===
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;
    const body = document.body;

    // Verifica se o usuário já tinha uma preferência salva
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        if (themeIcon) themeIcon.className = "bi bi-sun";
    }

    if (themeToggle && themeIcon) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            
            if (body.classList.contains("dark-mode")) {
                themeIcon.className = "bi bi-sun"; // Ícone de sol para voltar pro claro
                localStorage.setItem("theme", "dark");
            } else {
                themeIcon.className = "bi bi-moon-stars"; // Ícone de lua para ir pro escuro
                localStorage.setItem("theme", "light");
            }
        });
    }

    // Código do rodapé (Ano atual)
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});


// ==========================================
// 9. CAPTURA DE EVENTOS TIPO INPUT (GLOBAL PARA SPA)
// ==========================================
document.addEventListener('input', (event) => {
    // 1. Se o usuário mexer no Input Nativo (Color Picker)
    if (event.target.id === 'picker-nativo') {
        atualizarInterfacePorHex(event.target.value);
    }

    // 2. Se o usuário digitar no Input de Texto HEX
    if (event.target.id === 'cor-hex') {
        let valor = event.target.value;
        if (valor && !valor.startsWith('#')) valor = '#' + valor;
        atualizarInterfacePorHex(valor);
    }

    // 3. Se o usuário digitar no Input de Texto RGB
    if (event.target.id === 'cor-rgb') {
        atualizarInterfacePorRgb(event.target.value);
    }

    // 4. Se o usuário digitar no Input de Texto HSL
    if (event.target.id === 'cor-hsl') {
        atualizarInterfacePorHsl(event.target.value);
    }
});