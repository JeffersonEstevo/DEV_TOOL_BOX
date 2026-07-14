/**
 * HtmlToPdfConverter - Motor de conversão profissional de HTML para PDF
 * Encapsulado, seguro e com feedback de carregamento em tempo real.
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
        // Vincula métodos ao contexto da classe
        this.renderPreview = this.renderPreview.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.clearAll = this.clearAll.bind(this);

        // Eventos
        this.inputArea.addEventListener("input", this.renderPreview);
        if (this.downloadBtn) this.downloadBtn.addEventListener("click", this.handleDownload);
        if (this.cleanBtn) this.cleanBtn.addEventListener("click", this.clearAll);

        // Renderização inicial
        this.renderPreview();
    }

    /**
     * Atualiza a área de simulação de página do PDF
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
     * Executa a exportação do PDF usando html2pdf de alta qualidade
     */
    async handleDownload() {
        const htmlContent = this.inputArea.value.trim();

        if (!htmlContent) return;

        if (typeof html2pdf === 'undefined') {
            alert("Erro: Biblioteca html2pdf não foi carregada corretamente no navegador.");
            return;
        }

        this.setLoadingState(true);

        try {
            // Cria um clone em memória para evitar interferências de estilos da página
            const pdfTarget = this.previewArea.cloneNode(true);

            // Ajustes técnicos de reset para o Canvas não sofrer cortes horizontais
            Object.assign(pdfTarget.style, {
                margin: "0px",
                padding: "0px",
                width: "100%",
                height: "auto",
                display: "block",
                boxShadow: "none"
            });

            const options = {
                margin: [15, 15, 15, 15], // Margem física clássica de 15mm
                filename: 'documento_exportado.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2.5, // Resolução de alta fidelidade para evitar textos borrados
                    useCORS: true,
                    logging: false,
                    scrollY: 0,
                    scrollX: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.break-before',
                    after: '.break-after',
                    avoid: '.avoid-break'
                }
            };

            await html2pdf().set(options).from(pdfTarget).save();
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

// Inicialização segura da aplicação
//document.addEventListener("DOMContentLoaded", () => {
//    new HtmlToPdfConverter();
//});