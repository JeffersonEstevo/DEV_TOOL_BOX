/**
 * HtmlToPdfConverter - Motor de conversão profissional de HTML para PDF
 *
 * Estratégia: em vez de tirar um "screenshot" do HTML renderizado
 * (abordagem antiga com html2canvas/html2pdf, que gera imagem e não
 * texto), este módulo abre o conteúdo em um documento HTML isolado
 * e limpo, e usa o motor de impressão nativo do navegador
 * (window.print) para gerar o PDF.
 *
 * Vantagens em relação à abordagem anterior:
 * - Texto real e selecionável dentro do PDF.
 * - Paginação correta feita pelo próprio motor de renderização
 *   (não corta conteúdo no meio de forma arbitrária).
 * - Tabelas longas podem quebrar entre páginas repetindo o cabeçalho
 *   (thead), em vez de serem cortadas ou forçadas numa página só.
 * - O documento de impressão é isolado e sempre em tema claro,
 *   independente do tema (claro/escuro) da aplicação.
 */
class HtmlToPdfConverter {
    constructor() {
        this.inputArea = document.getElementById("pdf-html-input");
        this.previewArea = document.getElementById("pdf-preview-area");
        this.downloadBtn = document.getElementById("download-pdf-button");
        this.cleanBtn = document.getElementById("clean-pdf-button");

        if (!this.inputArea || !this.previewArea) {
            console.error("HtmlToPdfConverter: Elementos essenciais do DOM não encontrados.");
            return;
        }

        this.init();
    }

    /**
     * Inicializa os escutadores de eventos e o estado inicial da aplicação
     */
    init() {
        this.renderPreview = this.renderPreview.bind(this);
        this.handleGeneratePdf = this.handleGeneratePdf.bind(this);
        this.clearAll = this.clearAll.bind(this);

        this.inputArea.addEventListener("input", this.renderPreview);
        if (this.downloadBtn) this.downloadBtn.addEventListener("click", this.handleGeneratePdf);
        if (this.cleanBtn) this.cleanBtn.addEventListener("click", this.clearAll);

        this.renderPreview();
    }

    /**
     * Atualiza a área de simulação de página do PDF (preview em tela)
     */
    renderPreview() {
        const htmlContent = this.inputArea.value.trim();

        if (!htmlContent) {
            this.previewArea.innerHTML = `
                <div class="preview-empty-state">
                    <i class="bi bi-code-slash" style="font-size: 2rem; color: var(--text-muted);"></i>
                    <p style="color: var(--text-muted); font-style: italic; margin-top: 0.5rem;">
                        Aguardando código HTML para visualização...
                    </p>
                </div>
            `;
            return;
        }

        this.previewArea.innerHTML = htmlContent;
    }

    /**
     * Altera o estado do botão para indicar carregamento
     */
    setLoadingState(isLoading) {
        if (!this.downloadBtn) return;

        const content = this.downloadBtn.querySelector(".btn-content");
        const loading = this.downloadBtn.querySelector(".btn-loading");

        if (isLoading) {
            this.downloadBtn.disabled = true;
            content?.classList.add("hidden");
            loading?.classList.remove("hidden");
        } else {
            this.downloadBtn.disabled = false;
            content?.classList.remove("hidden");
            loading?.classList.add("hidden");
        }
    }

    /**
     * Monta o documento HTML isolado usado apenas para impressão/PDF.
     * Ele não herda nada da página principal (sidebar, tema, etc.),
     * garantindo um resultado limpo e sempre em fundo claro.
     */
    buildPrintDocument(htmlContent) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Documento</title>
<style>${HtmlToPdfConverter.PRINT_STYLES}</style>
</head>
<body>
<div class="print-content">${htmlContent}</div>
</body>
</html>`;
    }

    /**
     * Abre o HTML de origem em uma janela isolada e aciona a impressão
     * nativa do navegador (o usuário escolhe "Salvar como PDF" como
     * destino na caixa de diálogo de impressão).
     */
    async handleGeneratePdf() {
        const htmlContent = this.inputArea.value.trim();
        if (!htmlContent) return;

        this.setLoadingState(true);

        try {
            const printWindow = window.open("", "_blank");

            if (!printWindow) {
                alert("Não foi possível abrir a janela de geração de PDF. Verifique se o navegador está bloqueando pop-ups para este site.");
                return;
            }

            const doc = printWindow.document;
            doc.open();
            doc.write(this.buildPrintDocument(htmlContent));
            doc.close();

            // Aguarda o documento (incluindo imagens) terminar de carregar
            // antes de disparar a impressão, para não cortar conteúdo.
            const triggerPrint = () => {
                printWindow.focus();
                printWindow.print();
            };

            if (printWindow.document.readyState === "complete") {
                triggerPrint();
            } else {
                printWindow.addEventListener("load", triggerPrint);
            }

            // Fecha a aba automaticamente após o usuário concluir ou
            // cancelar a impressão (suportado nos navegadores baseados
            // em Chromium e Firefox recentes).
            printWindow.addEventListener("afterprint", () => printWindow.close());
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Limpa o painel inteiro
     */
    clearAll() {
        this.inputArea.value = "";
        this.renderPreview();
    }
}

/**
 * Folha de estilos usada exclusivamente no documento de impressão/PDF.
 * Mantém o mesmo "design system" visual (títulos, tabelas, callouts,
 * código) que antes vivia em html_to_pdf.css, mas agora pensado para
 * papel: unidades em pt, tabelas que podem quebrar entre páginas com
 * cabeçalho repetido, e quebra de texto/tabelas largas em vez de corte.
 */
HtmlToPdfConverter.PRINT_STYLES = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }

  @page {
    size: A4;
    margin: 15mm;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: #1e293b;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
  }

  .print-content { width: 100%; }

  img { max-width: 100%; height: auto; }

  h1, h2, h3 {
    color: #0f172a;
    break-after: avoid;
    break-inside: avoid;
  }
  h1 {
    font-size: 22pt;
    font-weight: 700;
    margin: 0 0 12pt;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6pt;
  }
  h2 {
    font-size: 16pt;
    font-weight: 600;
    color: #1e293b;
    margin: 18pt 0 8pt;
  }
  h3 {
    font-size: 13pt;
    font-weight: 600;
    color: #334155;
    margin: 14pt 0 6pt;
  }

  p, li, blockquote, .callout {
    break-inside: avoid;
    margin: 0 0 8pt;
  }

  ul, ol {
    padding-left: 20pt;
    margin: 0 0 10pt;
  }
  li { margin-bottom: 4pt; }

  blockquote {
    border-left: 4px solid #6366f1;
    background-color: #f8fafc;
    padding: 6pt 12pt;
    margin: 12pt 0;
    color: #475569;
    font-style: italic;
  }

  /* Tabelas: permitem quebrar ENTRE linhas ao virar a página, repetindo
     o cabeçalho (thead) — diferente da versão antiga, que forçava a
     tabela inteira a caber numa única página e cortava o excedente. */
  table {
    width: 100%;
    max-width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 9.5pt;
  }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tr { break-inside: avoid; }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 6pt 8pt;
    text-align: left;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
  }
  tbody tr:nth-child(even) { background-color: #f8fafc; }

  .text-center { text-align: center !important; }
  .text-right { text-align: right !important; }
  .text-left { text-align: left !important; }

  code {
    background-color: #f1f5f9;
    color: #e11d48;
    padding: 1pt 4pt;
    border-radius: 3pt;
    font-family: Consolas, Monaco, monospace;
    font-size: 0.9em;
  }
  pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 10pt;
    border-radius: 4pt;
    margin: 12pt 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: anywhere;
    break-inside: avoid;
  }
  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    font-size: 0.9em;
  }

  .callout {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #3b82f6;
    padding: 8pt 12pt;
    border-radius: 4pt;
    margin: 12pt 0;
  }

  /* Classes utilitárias para quebras manuais de página, controladas
     pelo próprio HTML de origem colado pelo usuário. */
  .break-before { break-before: page; }
  .break-after { break-after: page; }
  .avoid-break { break-inside: avoid; }
`;

// Inicialização segura da aplicação
//document.addEventListener("DOMContentLoaded", () => {
//    new HtmlToPdfConverter();
//});
