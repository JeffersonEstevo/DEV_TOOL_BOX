document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // 1. FUNÇÃO GLOBAL DO MENU LATERAL (SIDEBAR)
    // ==========================================================================
    function toggleMenu() {
        const appContainer = document.getElementById("app-container");
        const toggleIcon = document.getElementById("toggle-icon");
        
        if (appContainer && toggleIcon) {
            // Alterna a classe que esconde/mostra o menu
            appContainer.classList.toggle("sidebar-hidden");
            
            // NOTE: Ajusta a direção da seta do ícone conforme o estado do menu
            if (appContainer.classList.contains("sidebar-hidden")) {
                toggleIcon.className = "bi bi-arrow-right-short"; // Menu fechado -> Seta para DIREITA
            } else {
                toggleIcon.className = "bi bi-arrow-left-short";  // Menu aberto -> Seta para ESQUERDA
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

        // NOTE: Recupera e aplica a preferência de tema salva no localStorage do navegador
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
            // NOTE: Obtém o ano atual baseado nas configurações regionais do dispositivo do usuário
            yearSpan.textContent = new Date().getFullYear();
        }
    });

    // ==========================================================================
    // 3. CARREGADOR SPA COMPATÍVEL COM ROTAS LOCAIS E EM SERVIDOR
    // ==========================================================================
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

                        // WARNING: Remove réplicas antigas do mesmo script presentes na árvore do DOM.
                        // TODO: Event listeners criados por scripts antigos ainda residem na memória do navegador.
                        document.querySelectorAll(`script`).forEach(s => {
                            if (s.src && s.src.includes(srcLimpo.split('?')[0])) {
                                s.remove();
                            }
                        });

                        // NOTE: Força o navegador a re-executar o script ignorando o cache via timestamp (?t=...)
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

    // ==========================================================================
    // 4. MONITORAMENTO DE EVENTOS DE LINKS E ROTAS
    // ==========================================================================
    document.addEventListener("click", function (e) {
        const link = e.target.closest(".nav-link");
        if (link) {
            const paginaAlvo = link.getAttribute("href");
            if (paginaAlvo && paginaAlvo.startsWith("#/")) {
                // WARNING: O clique altera o hash, o que já dispara o evento 'hashchange' abaixo.
                // Chamar carregarConteudo aqui faz a requisição rodar duas vezes seguidas no clique.
                carregarConteudo(paginaAlvo);
            }
        }
    });

    window.addEventListener("hashchange", function () {
        carregarConteudo(window.location.hash);
    });

    // NOTE: Garante o carregamento correto da página caso o usuário atualize o navegador (F5) já estando em uma rota específica
    if (window.location.hash) {
        carregarConteudo(window.location.hash);
    }

    // ==========================================================================
    // 5. FUNÇÃO GLOBAL DE CÓPIA (PARA TODAS AS FERRAMENTAS)
    // ==========================================================================
    window.copiarTextoDeElemento = function(idElemento, idAlerta) {
        const elementoTexto = document.getElementById(idElemento);
        const alerta = document.getElementById(idAlerta);
        
        if (!elementoTexto || elementoTexto.value.trim() === "") {
            console.warn(`[Cópia] Elemento #${idElemento} vazio ou não encontrado.`);
            return;
        }

        // WARNING: A API navigator.clipboard requer obrigatoriamente ambiente seguro (HTTPS ou localhost).
        // Em servidores HTTP convencionais, esta chamada vai falhar porque o objeto ficará indefinido.
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

    // ==========================================================================
    // 6.  DELEGAÇÃO DE CLIQUES GERAIS DA APLICAÇÃO
    //==========================================================================
    document.addEventListener("click", function (event) {
        
        // === 01. TEXTO - 01. Converter Texto ===
        if (event.target.closest('#lowercase-letter-button')) { event.preventDefault(); convertToLowercase(); }
        if (event.target.closest('#uppercase-letter-button')) { event.preventDefault(); convertToUppercase(); }
        if (event.target.closest('#capitalize-button'))       { event.preventDefault(); capitalizeText(); }
        if (event.target.closest('#alternate-button'))        { event.preventDefault(); alternateText(); }
        if (event.target.closest('#camelcase-button'))        { event.preventDefault(); convertToCamelCase(); }
        if (event.target.closest('#clean-button'))            { event.preventDefault(); cleanText(); }
        if (event.target.closest('#copy-button')) { 
            event.preventDefault(); 
            window.copiarTextoDeElemento('modified-text', 'copy-alert'); 
        }
                
        // === 01. TEXTO - 02. Inverter Texto ===
        if (event.target.closest('#invert-button')) {
            event.preventDefault();
            if (typeof executarInversaoDeTexto === "function") executarInversaoDeTexto();
        }
        if (event.target.closest('#clean-invert-button')) {
            event.preventDefault();
            if (typeof limparInversaoDeTexto === "function") limparInversaoDeTexto();
        }
        if (event.target.closest('#copy-invert-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('inverted-text', 'copy-invert-alert');
        }

        // === 01. TEXTO - 03. Leitura Dinâmica ===
        if (event.target.closest('#start-button')) {
            event.preventDefault();
            if (typeof iniciarLeituraDinamica === "function") {
                iniciarLeituraDinamica();
                
                // NOTE: Ativa o atalho do Escape apenas enquanto o leitor estiver ativo
                document.addEventListener("keydown", function escutarEscape(e) {
                    if (e.key === "Escape") {
                        if (typeof pararLeituraDinamica === "function") pararLeituraDinamica();
                        document.removeEventListener("keydown", escutarEscape); // Auto-limpa a memória
                    }
                });
            }
        }
        if (event.target.closest('#stop-button')) {
            event.preventDefault();
            if (typeof pararLeituraDinamica === "function") pararLeituraDinamica();
        }  

        // === 01. TEXTO - 04. Remover Acentos ===
        if (event.target.closest('#remove-accents-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDeAcentos === "function") executarRemocaoDeAcentos();
        }
        if (event.target.closest('#clean-accents-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDeAcentos === "function") limparRemocaoDeAcentos();
        }
        if (event.target.closest('#copy-accents-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-accents-alert');
        }

        // === 01. TEXTO - 05. Remover Espaços Extra ===
        if (event.target.closest('#remove-space-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDeEspacos === "function") executarRemocaoDeEspacos();
        }
        if (event.target.closest('#clean-spaces-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDeEspacos === "function") limparRemocaoDeEspacos();
        }
        if (event.target.closest('#copy-spaces-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-spaces-alert');
        }

        // === 01. TEXTO - 06. Remover Pontuação ===
        if (event.target.closest('#remove-punctuation-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDePontuacao === "function") executarRemocaoDePontuacao();
        }
        if (event.target.closest('#clean-punctuation-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDePontuacao === "function") limparRemocaoDePontuacao();
        }
        if (event.target.closest('#copy-punctuation-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-punctuation-alert');
        }    

        // === 01. TEXTO - 07. Remover Quebras ===
        if (event.target.closest('#remove-linebreaks-button')) {
            event.preventDefault();
            if (typeof executarRemocaoDeQuebras === "function") executarRemocaoDeQuebras();
        }
        if (event.target.closest('#clean-linebreaks-button')) {
            event.preventDefault();
            if (typeof limparRemocaoDeQuebras === "function") limparRemocaoDeQuebras();
        }
        if (event.target.closest('#copy-linebreaks-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('modified-text', 'copy-linebreaks-alert');
        }

        // === 01. TEXTO - 08. Extrair/Remover Entre Caracteres ===
        if (event.target.closest('#extract-button')) {
            event.preventDefault();
            if (typeof executarExtracaoPorDelimitadores === "function") executarExtracaoPorDelimitadores();
        }
        if (event.target.closest('#clean-delimiters-button')) {
            event.preventDefault();
            if (typeof limparExtracaoPorDelimitadores === "function") limparExtracaoPorDelimitadores();
        }
        if (event.target.closest('#copy-delimiters-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('extracted-text', 'copy-delimiters-alert');
        }

        // === 01. TEXTO - 09. Revirar Texto ===
        if (event.target.closest('#turn-button')) {
            event.preventDefault();
            if (typeof executarReviradaDeTexto === "function") executarReviradaDeTexto();
        }
        if (event.target.closest('#clean-flip-button')) {
            event.preventDefault();
            if (typeof limparReviradaDeTexto === "function") limparReviradaDeTexto();
        }
        if (event.target.closest('#copy-flip-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('turned-text', 'copy-flip-alert');
        }

        // === 01. TEXTO - 10. Similaridade Entre Textos ===
        if (event.target.closest('#calc-similarity-button')) {
            event.preventDefault();
            if (typeof executarCalculoDeSimilaridade === "function") executarCalculoDeSimilaridade();
        }
        if (event.target.closest('#clean-similarity-button')) {
            event.preventDefault();
            if (typeof limparCalculoDeSimilaridade === "function") limparCalculoDeSimilaridade();
        }

        // === 01. TEXTO - 11. Comparar Textos ===
        if (event.target.closest('#compare-button')) {
            event.preventDefault();
            if (typeof executarComparacaoDeTextos === "function") {
                executarComparacaoDeTextos();
            } else {
                console.error("[Erro] A engine de comparação de textos não está carregada na memória.");
            }
        }
        if (event.target.closest('#clear-button')) {
            event.preventDefault();
            if (typeof limparComparacaoDeTextos === "function") limparComparacaoDeTextos();
        }

        // === 01. TEXTO - 12. Substituir Palavras ===
        if (event.target.closest('#replace-button')) {
            event.preventDefault();
            if (typeof executarSubstituicaoDePalavras === "function") executarSubstituicaoDePalavras();
        }
        if (event.target.closest('#clean-replace-button')) {
            event.preventDefault();
            if (typeof limparSubstituicaoDePalavras === "function") limparSubstituicaoDePalavras();
        }
        if (event.target.closest('#copy-replace-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('final-text', 'copy-replace-alert');
        }  
        // === 01. TEXTO - 13. Tabela ASCII ===
        if (event.target.closest('#clean-ascii-button')) {
            event.preventDefault();
            if (typeof limparBuscaASCII === "function") limparBuscaASCII();
        }
        // === 01. TEXTO - 14. Gerar Lorem Ipsum ===
        if (event.target.closest('#generate-lorem-button')) {
            event.preventDefault();
            if (typeof processarGeracaoLorem === "function") processarGeracaoLorem();
        }
        if (event.target.closest('#clean-lorem-button')) {
            event.preventDefault();
            if (typeof limparLorem === "function") limparLorem();
        }
        if (event.target.closest('#copy-lorem-button')) {
            event.preventDefault();
            if (typeof copiarLoremParaAreaTransferencia === "function") copiarLoremParaAreaTransferencia();
        }
        // === 01. TEXTO - 15. Converter de Markdown para HTML ===
        if (event.target.closest('#clean-markdown-button')) {
            event.preventDefault();
            if (typeof limparMarkdown === "function") limparMarkdown();
        }

        if (event.target.closest('#copy-markdown-button')) {
            event.preventDefault();
            if (typeof copiarHtmlConvertido === "function") copiarHtmlConvertido();
        }
        // === 01. TEXTO - 16. Gerador de PDF a partir de HTML ===
        if (event.target.closest('#clean-pdf-button')) {
            event.preventDefault();
            if (typeof limparGeradorPdf === "function") limparGeradorPdf();
        }

        if (event.target.closest('#download-pdf-button')) {
            event.preventDefault();
            if (typeof baixarPdfGerado === "function") baixarPdfGerado();
        }
        // === 01. TEXTO - 17. Comparar de Listas ===
        if (event.target.closest('#compare-lists-button')) {
            event.preventDefault();
            if (typeof executarComparacaoDeListas === "function") {
                executarComparacaoDeListas();
            } else {
                console.error("[Erro] A engine de comparação de listas não está carregada na memória.");
            }
        }
        if (event.target.closest('#clear-lists-button')) {
            event.preventDefault();
            if (typeof limparComparacaoDeListas === "function") {
                limparComparacaoDeListas();
            }
        }
        
        // === 01. TEXTO - 18. Tachar Texto ===
        if (event.target.closest('#strike-button')) {
            event.preventDefault();
            if (typeof executarTacharTexto === "function") {
                executarTacharTexto();
            } else {
                console.error("[Erro] A engine de tachar texto não está carregada na memória.");
            }
        }

        if (event.target.closest('#copy-strike-button')) {
            event.preventDefault();
            if (typeof copiarTextoTachado === "function") copiarTextoTachado();
        }

        if (event.target.closest('#clean-strike-button')) {
            event.preventDefault();
            if (typeof limparTacharTexto === "function") limparTacharTexto();
        }

        // === 02. CALCULADORAS - 01. Frações ===
        if (event.target.closest('#calc-fraction-button')) {
            event.preventDefault();
            if (typeof executarCalculoDeFracao === "function") executarCalculoDeFracao();
        }
        if (event.target.closest('#clean-fraction-button')) {
            event.preventDefault();
            if (typeof limparCalculoDeFracao === "function") limparCalculoDeFracao();
        }

        // === 02. CALCULADORAS - 02. Média Aritmética ===
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

        // === 02. CALCULADORAS - 03. Porcentagem ===
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

        // === 02. CALCULADORAS - 04. Regra de Três ===
        if (event.target.closest('#clean-rule-button')) {
            event.preventDefault();
            if (typeof limparRegraDeTres === "function") limparRegraDeTres();
        }
        if (event.target.closest('#copy-rule-button')) {
            event.preventDefault();
            window.copiarTextoDeElemento('value-x', 'rule-three-alert');
        }
        // === 02. CALCULADORAS - 05. Calculadora Científica ===

        // === 03. GERADORES - 01. Gerar/Validar CPF ===
        // Ação de Gerar Novo CPF (Aba de Geração)
        if (event.target.closest('#btn-gerar-cpf')) {
            event.preventDefault();
            if (typeof dispararGeracaoCPF === "function") dispararGeracaoCPF();
        }

        // Ação de Copiar CPF Gerado (Aba de Geração)
        if (event.target.closest('#btn-copiar-cpf')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cpf-resultado', 'cpf-generator-alert');
        }

        // Ação de Copiar CPF Digitado (Aba de Validação)
        if (event.target.closest('#btn-copiar-validar-cpf')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cpf-input-validar', 'cpf-generator-alert');
        }

        // Ação de Limpar Campo de Validação (Aba de Validação)
        if (event.target.closest('#btn-limpar-validar-cpf')) {
            event.preventDefault();
            if (typeof focarEResetarValidador === "function") focarEResetarValidador();
        }

        // === Eventos para aba de Validação de CPF ===
        if (event.target.closest('#btn-copiar-validar-cpf')) {
            event.preventDefault();
            // Copia o valor do campo de validação
            window.copiarTextoDeElemento('cpf-input-validar', 'cpf-generator-alert');
        }
        if (event.target.closest('#btn-limpar-validar-cpf')) {
            event.preventDefault();
            if (typeof focarEResetarValidador === "function") focarEResetarValidador();
        }

        // === 03. GERADORES - 02. Gerar/Validar CEP ===
        // Ação de Gerar Novo CEP (Aba de Geração)
        if (event.target.closest('#btn-gerar-cep')) {
            event.preventDefault();
            if (typeof dispararGeracaoCEP === "function") dispararGeracaoCEP();
        }

        // Ação de Copiar CEP Gerado (Aba de Geração)
        if (event.target.closest('#btn-copiar-cep')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cep-resultado', 'cep-generator-alert');
        }

        // Ação de Copiar CEP Digitado (Aba de Validação)
        if (event.target.closest('#btn-copiar-validar-cep')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cep-input-validar', 'cep-generator-alert');
        }

        // Ação de Limpar Campo de Validação (Aba de Validação)
        if (event.target.closest('#btn-limpar-validar-cep')) {
            event.preventDefault();
            if (typeof focarEResetarValidadorCEP === "function") focarEResetarValidadorCEP();
        }

        // === 03. GERADORES - 03. Gerar/Validar CNPJ ===
        // Ação de Gerar Novo CNPJ (Aba de Geração)
        if (event.target.closest('#btn-gerar-cnpj')) {
            event.preventDefault();
            if (typeof dispararGeracaoCNPJ === "function") dispararGeracaoCNPJ();
        }
        // Ação de Copiar CNPJ Gerado (Aba de Geração)
        if (event.target.closest('#btn-copiar-cnpj')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cnpj-resultado', 'cnpj-generator-alert');
        }
        // Ação de Copiar CNPJ Digitado (Aba de Validação)
        if (event.target.closest('#btn-copiar-validar-cnpj')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cnpj-input-validar', 'cnpj-generator-alert');
        }
        // Ação de Limpar Campo de Validação (Aba de Validação)
        if (event.target.closest('#btn-limpar-validar-cnpj')) {
            event.preventDefault();
            if (typeof focarEResetarValidadorCNPJ === "function") focarEResetarValidadorCNPJ();
        }


        // === 03. GERADORES - 04. Cartão de Crédito ===
        // Ação de Gerar Novo Cartão (Aba de Geração)
        if (event.target.closest('#btn-gerar-cartao')) {
            event.preventDefault();
            if (typeof dispararGeracaoCartao === "function") dispararGeracaoCartao();
        }
        // Ação de Copiar Cartão Gerado (Aba de Geração)
        if (event.target.closest('#btn-copiar-cartao')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cartao-resultado', 'cartao-generator-alert');
        }
        // Ação de Copiar Cartão Digitado (Aba de Validação)
        if (event.target.closest('#btn-copiar-validar-cartao')) {
            event.preventDefault();
            window.copiarTextoDeElemento('cartao-input-validar', 'cartao-generator-alert');
        }
        // Ação de Limpar Campo de Validação (Aba de Validação)
        if (event.target.closest('#btn-limpar-validar-cartao')) {
            event.preventDefault();
            if (typeof focarEResetarValidadorCartao === "function") focarEResetarValidadorCartao();
        }

        // === 03. GERADORES - 05. Gerar/Validar UUID ===
        // Ação de Gerar Novo UUID (Aba de Geração)
        if (event.target.closest('#btn-gerar-uuid')) {
            event.preventDefault();
            if (typeof dispararGeracaoUUID === "function") dispararGeracaoUUID();
        }
        // Ação de Copiar UUID Gerado (Aba de Geração)
        if (event.target.closest('#btn-copiar-uuid')) {
            event.preventDefault();
            window.copiarTextoDeElemento('uuid-resultado', 'uuid-generator-alert');
        }
        // Ação de Copiar UUID Digitado (Aba de Validação)
        if (event.target.closest('#btn-copiar-validar-uuid')) {
            event.preventDefault();
            window.copiarTextoDeElemento('uuid-input-validar', 'uuid-generator-alert');
        }
        // Ação de Limpar Campo de Validação (Aba de Validação)
        if (event.target.closest('#btn-limpar-validar-uuid')) {
            event.preventDefault();
            if (typeof focarEResetarValidadorUUID === "function") focarEResetarValidadorUUID();
        }

        // === 03. GERADORES - 06. Perfil de Pessoa ===
        if (event.target.closest('#btn-gerar-pessoa')) {
            event.preventDefault();
            if (typeof dispararGeracaoPessoa === "function") dispararGeracaoPessoa();
        }

        // === 03. GERADORES - 07. Gerador de Senhas e Hashes ===
        if (event.target.closest('#btn-gerar-senha')) {
            event.preventDefault();
            if (typeof dispararGeracaoSenha === "function") dispararGeracaoSenha();
        }
        // Ação de Limpar Campos de Verificação (Aba de Validação de Hash)
        if (event.target.closest('#btn-limpar-verificar-senha')) {
            event.preventDefault();
            if (typeof focarEResetarVerificadorSenha === "function") focarEResetarVerificadorSenha();
        }
        // === 03. GERADORES - 08. Gerador de Arrays ===
        if (event.target.closest('#btn-gerar-array')) {
            event.preventDefault();
            if (typeof dispararGeracaoArray === "function") dispararGeracaoArray();
        }

        if (event.target.closest('#btn-copiar-array')) {
            event.preventDefault();
            window.copiarTextoDeElemento('array-resultado', 'array-generator-alert');
        }

        if (event.target.closest('#btn-copiar-senha')) {
            event.preventDefault();
            window.copiarTextoDeElemento('senha-resultado', 'senha-generator-alert');
        }

        // === 04. CONVERSORES - 01. Comprimento ===
        if (event.target.closest('#btn-limpar-comprimento')) {
            event.preventDefault();
            if (typeof limparTodosCamposComprimento === "function") limparTodosCamposComprimento();
        }

        // === 04. CONVERSORES - 02. Massa ===
        if (event.target.closest('#btn-limpar-massa')) {
            event.preventDefault();
            if (typeof limparTodosCamposMassa === "function") limparTodosCamposMassa();
        }

        // === 04. CONVERSORES - 03. Temperatura ===
        if (event.target.closest('#btn-limpar-temperatura')) {
            event.preventDefault();
            if (typeof limparTodosCamposTemperatura === "function") limparTodosCamposTemperatura();
        }

        // === 04. CONVERSORES - 04. Tempo ===
        if (event.target.closest('#btn-limpar-tempo')) {
            event.preventDefault();
            if (typeof limparTodosCamposTempo === "function") limparTodosCamposTempo();
        }

        // === 04. CONVERSORES - 05. Velocidade ===
        if (event.target.closest('#btn-limpar-velocidade')) {
            event.preventDefault();
            if (typeof limparTodosCamposVelocidade === "function") limparTodosCamposVelocidade();
        }

        // === 04. CONVERSORES - 06. Grandezas Elétricas ===
        if (event.target.closest('#btn-limpar-eletrica')) {
            event.preventDefault();
            if (typeof limparTudoEletrica === "function") limparTudoEletrica();
        }

        // === 04. CONVERSORES - 07. Tensão Trifásica ===
        if (event.target.closest('#btn-limpar-trifasica')) {
            event.preventDefault();
            if (typeof limparTrifasica === "function") limparTrifasica();
        }

        // === 05. REDE - 01. Máscara e CIDR ===
        if (event.target.closest('#btn-limpar-rede')) {
            event.preventDefault();
            if (typeof limparTudoRede === "function") limparTudoRede();
        }

        // === 05. REDE - 02. Conversor de Bases ===
        if (event.target.closest('#btn-limpar-bases')) {
            event.preventDefault();
            if (typeof limparTodosCamposBases === "function") limparTodosCamposBases();
        }
        // === 05. REDE - 03. Conversor JSON / YAML ===
        if (event.target.closest('#clean-format-button')) {
            event.preventDefault();
            if (typeof limparConversorFormatos === "function") limparConversorFormatos();
        }
        // === 05. REDE - 03. Calculadora de Sub-redes ===
        if (event.target.closest('#btn-limpar-subredes')) {
            event.preventDefault();
            if (typeof limparTodosCamposSubredes === "function") limparTodosCamposSubredes();
        }

        if (event.target.closest('#copy-format-button')) {
            event.preventDefault();
            if (typeof copiarFormatoConvertido === "function") copiarFormatoConvertido();
        }

        // === 06. DATA/HORA - 01. Calculadora de Horas ===
        if (event.target.closest('#btn-limpar-horas')) {
            event.preventDefault();
            if (typeof limparTodosCamposHoras === "function") limparTodosCamposHoras();
        }

        // === 06. DATA/HORA - 02. Contador de Dias ===
        if (event.target.closest('#btn-limpar-dias')) {
            event.preventDefault();
            if (typeof limparTodosCamposDias === "function") limparTodosCamposDias();
        }

        // === 06. DATA/HORA - 03. Subtração de Datas ===
        if (event.target.closest('#btn-limpar-sub-datas')) {
            event.preventDefault();
            if (typeof limparTodosCamposSubDatas === "function") limparTodosCamposSubDatas();
        }

        // === 06. DATA/HORA - 04. Conversor Data / Decimal ===
        // WARNING: O seu código original continha este mesmo bloco duplicado logo em sequência (antigas ferramentas 36 e 37).
        if (event.target.closest('#btn-limpar-conv-datas')) {
            event.preventDefault();
            if (typeof limparTodosCamposConv === "function") limparTodosCamposConv();
        }

        // === 07. CORES - 01. Seletor de Cores ===
        if (event.target.closest('#btn-limpar-cores')) {
            event.preventDefault();
            if (typeof atualizarInterfacePorHex === "function") {
                atualizarInterfacePorHex('#3498DB'); // Reseta para o azul padrão
            }
        }
        // === 07. CORES - 02. Conta-Gotas de Imagens ===
        if (event.target.closest('#btn-reset-conta-gotas')) {
            event.preventDefault();
            if (typeof limparContaGotas === "function") {
                limparContaGotas();
            }
        }
        // === 07. CORES - 03. Gerador de Gradiente e Contraste ===
        if (event.target.closest('#btn-limpar-gradiente')) {
            event.preventDefault();
            if (typeof atualizarInterfaceGradiente === "function") {
                atualizarInterfaceGradiente('#3498DB'); // Reseta para o azul padrão da aplicação
            }
        }
        // === 07. CORES - 04. Misturador de Cores ===
        if (event.target.closest('#btn-limpar-mixer')) {
            event.preventDefault();
            const inputA = document.getElementById('input-mixer-a');
            const inputB = document.getElementById('input-mixer-b');
            
            if (inputA && inputB && typeof calcularEMisturarCores === "function") {
                inputA.value = '#66FF99';
                inputB.value = '#33CCFF';
                calcularEMisturarCores(); // Executa o recálculo do estado inicial
            }
        }
        // === 07. CORES - 05. Nomes de Cores CSS ===
        if (event.target.closest('#btn-limpar-busca-cores')) {
            event.preventDefault();
            const inputBusca = document.getElementById('busca-nome-cor');
            if (inputBusca) {
                inputBusca.value = ''; // Reseta o campo textual
                if (typeof renderizarGridCores === "function") {
                    renderizarGridCores(''); // Força a re-renderização completa da lista
                }
            }
        }

        // === 08. DEV_WEB - 01. Visualizador de Web Fonts ===
        if (event.target.closest('#btn-limpar-selecao-fontes')) {
            event.preventDefault();
            const seletorFont = document.getElementById('seletor-google-font');
            const inputTexto = document.getElementById('texto-customizado-fonte');
            
            if (seletorFont) {
                seletorFont.value = 'Roboto'; // Alinha o seletor na opção base
            }
            if (inputTexto) {
                inputTexto.value = ''; // Limpa a string customizada
                if (typeof aplicarTextoCustomizado === "function") {
                    aplicarTextoCustomizado('');
                }
            }
            if (typeof atualizarFontePreview === "function" && seletorFont) {
                atualizarFontePreview(seletorFont.value); // Dispara o recálculo estético
            }
        }
        // === 08. DEV_WEB - 02. Gerador de Estrutura HTML ===
        if (event.target.closest('#btn-resetar-estrutura-html')) {
            event.preventDefault();
            
            const checkboxes = ['chk-header', 'chk-nav', 'chk-section', 'chk-aside', 'chk-footer'];
            checkboxes.forEach(id => {
                const chk = document.getElementById(id);
                if (chk) {
                    // Retorna ao estado padrão (aside desmarcado, resto marcado)
                    chk.checked = id !== 'chk-aside';
                }
            });

            if (typeof gerarBoilerplateHTML === "function") {
                gerarBoilerplateHTML();
            }
        }
        // === 08. DEV_WEB - 03. Live Preview HTML/CSS ===
        if (event.target.closest('#btn-limpar-preview')) {
            event.preventDefault();
            const htmlInput = document.getElementById('live-html-input');
            const cssInput = document.getElementById('live-css-input');
            
            if (htmlInput) htmlInput.value = '';
            if (cssInput) cssInput.value = '';
            
            if (typeof renderizarLivePreview === "function") {
                renderizarLivePreview();
            }
        }
        if (event.target.closest('#btn-abrir-nova-aba')) {
            event.preventDefault();
            if (typeof abrirPreviewNovaAba === "function") {
                abrirPreviewNovaAba();
            }
        }
        // === 08. DEV_WEB - 04. Embelezador e Formatador de Código ===
        // LOGO APÓS INJETAR NO DOM: Chama a inicialização para popular o select
        if (typeof inicializarFormatador === "function") {
            inicializarFormatador();
        }
        if (event.target.closest('#btn-executar-formatacao')) {
            event.preventDefault();
            if (typeof processarEExibirCodigo === "function") {
                processarEExibirCodigo();
            }
        }
        if (event.target.closest('#btn-limpar-formatador')) {
            event.preventDefault();
            const inputFormatador = document.getElementById('formatador-input');
            const outputLinhas = document.getElementById('vscode-output-linhas');
            
            if (inputFormatador) inputFormatador.value = '';
            if (outputLinhas) {
                outputLinhas.innerHTML = `<div class="vscode-linha-placeholder" style="color: #6a9955; padding: 0 1rem; font-style: italic;">O código formatado aparecerá aqui...</div>`;
            }
            codigoFormatadoGlobal = ""; // Limpa a memória de cópia
        }
        // === 08. DEV_WEB - 02. Gerador de CSS Starter Kit ===
        if (event.target.closest('#btn-limpar-selecao-css')) {
            event.preventDefault();
            
            // Elementos de Cor Primária
            const pickerPrimary = document.getElementById('seletor-cor-primary');
            const hexPrimary = document.getElementById('hex-primary');
            if (pickerPrimary) pickerPrimary.value = '#2563eb';
            if (hexPrimary) hexPrimary.value = '#2563eb';

            // Elementos de Cor Secundária
            const pickerSecondary = document.getElementById('seletor-cor-secondary');
            const hexSecondary = document.getElementById('hex-secondary');
            if (pickerSecondary) pickerSecondary.value = '#475569';
            if (hexSecondary) hexSecondary.value = '#475569';

            // Elementos de Background
            const pickerBg = document.getElementById('seletor-cor-bg');
            const hexBg = document.getElementById('hex-bg');
            if (pickerBg) pickerBg.value = '#f8fafc';
            if (hexBg) hexBg.value = '#f8fafc';

            // Tipografia e Arredondamento
            const seletorFf = document.getElementById('seletor-ff-regular');
            const seletorRadius = document.getElementById('seletor-radius-css');
            if (seletorFf) seletorFf.selectedIndex = 0;
            if (seletorRadius) seletorRadius.value = '8px';

            // Recalcular e aplicar preview
            if (typeof atualizarCSSPreview === "function") {
                atualizarCSSPreview();
            }
}




        // Atalho global para fechar o leitor dinâmico
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                if (typeof pararLeituraDinamica === "function") pararLeituraDinamica();
            }
        });
    });



    // ==========================================
    // 7. CONTAGEM DE ACESSOS À PAGINA
    // ==========================================
    const visitsElement = document.getElementById('visits');
    if (!visitsElement) return;

    const namespace = 'dev-tool-box-prod-2026';
    const key = 'main-visits';
    
    // Criamos a função global de callback
    window.atualizarTextoContador = function(response) {
        if (response && response.value) {
            visitsElement.innerText = Number(response.value).toLocaleString('pt-BR');
        } else {
            usarFallbackLocal();
        }
    };

    // Função separada para o plano B caso a rede falhe
    function usarFallbackLocal() {
        let localVisits = parseInt(localStorage.getItem('local_user_visits')) || 142;
        localVisits++;
        localStorage.setItem('local_user_visits', localVisits);
        visitsElement.innerText = localVisits.toLocaleString('pt-BR');
    }

    // Criamos o script dinâmico apontando para um servidor ATIVO (countapi.lystit.com)
    const script = document.createElement('script');
    script.src = `https://countapi.lystit.com/hit/${namespace}/${key}?callback=atualizarTextoContador`;
    
    // Se o novo servidor falhar, o fallback entra instantaneamente
    script.onerror = usarFallbackLocal;

    document.head.appendChild(script);    

    // ==========================================================================
    //8. DELEGAÇÃO DE CLIQUES PARA FERRAMENTAS INTERNAS (PÁGINAS INJETADAS)
    // ========================================================================== 
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
// 9. SISTEMA AUTOMÁTICO DE CARREGAMENTO DE CSS SOB DEMANDA (SPA)
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
// 10. CAPTURA DE EVENTOS TIPO INPUT (GLOBAL PARA SPA)
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

    new HtmlToPdfConverter();

});

// ==========================================================================
// 11. ORQUESTRAÇÃO DE INICIALIZAÇÃO DE MÓDULOS NA MUDANÇA DE ROTA (SPA)
// ==========================================================================
function dispararInicializadoresDeModulo() {
    const rota = window.location.hash;

    // 1. Caso o usuário mude para a aba ELEMENTOS
    if (rota.includes('elementos')) {
        setTimeout(() => {
            if (typeof inicializarElementosUI === "function") {
                inicializarElementosUI();
            }
        }, 80);
    }

    // 2. Caso o usuário mude para a aba FORMATADOR
    if (rota.includes('formatador')) {
        setTimeout(() => {
            if (typeof inicializarFormatador === "function") {
                inicializarFormatador();
            }
        }, 80);
    }
}

// Escuta a troca de abas e o carregamento inicial da SPA
window.addEventListener('hashchange', dispararInicializadoresDeModulo);
window.addEventListener('DOMContentLoaded', dispararInicializadoresDeModulo);




