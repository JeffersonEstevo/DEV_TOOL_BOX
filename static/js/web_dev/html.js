// ==========================================
// MÓDULO E GERADOR DE BOILERPLATE HTML & CSS
// ==========================================

function gerarBoilerplateHTML() {
    // Captura o estado dos checkboxes
    const temHeader = document.getElementById('chk-header')?.checked;
    const temNav = document.getElementById('chk-nav')?.checked;
    const temSection = document.getElementById('chk-section')?.checked;
    const temAside = document.getElementById('chk-aside')?.checked;
    const temFooter = document.getElementById('chk-footer')?.checked;

    // 1. Atualiza o Mapa Visual do Layout
    if (document.getElementById('view-header')) document.getElementById('view-header').style.display = temHeader ? 'block' : 'none';
    if (document.getElementById('view-nav')) document.getElementById('view-nav').style.display = temNav ? 'block' : 'none';
    if (document.getElementById('view-section')) document.getElementById('view-section').style.display = temSection ? 'block' : 'none';
    if (document.getElementById('view-aside')) document.getElementById('view-aside').style.display = temAside ? 'flex' : 'none';
    if (document.getElementById('view-footer')) document.getElementById('view-footer').style.display = temFooter ? 'block' : 'none';

    // 2. Montagem Dinâmica do Código HTML
    let bodyConteudo = "  <body>\n";
    
    if (temHeader) {
        bodyConteudo += "    <header>\n      <h1>Logotipo / Título da Marca</h1>\n";
        if (temNav) {
            bodyConteudo += "      <nav>\n        <ul>\n          <li><a href=\"#\">Início</a></li>\n          <li><a href=\"#\">Recursos</a></li>\n          <li><a href=\"#\">Contato</a></li>\n        </ul>\n      </nav>\n";
        }
        bodyConteudo += "    </header>\n\n";
    } else if (temNav) {
        bodyConteudo += "    <nav>\n      <ul>\n        <li><a href=\"#\">Início</a></li>\n        <li><a href=\"#\">Recursos</a></li>\n        <li><a href=\"#\">Contato</a></li>\n      </ul>\n    </nav>\n\n";
    }

    // Container Wrapper condicional se houver Barra Lateral (Aside)
    if (temAside) {
        bodyConteudo += "    <div class=\"app-container\">\n";
    }

    bodyConteudo += "      <main>\n";
    if (temSection) {
        bodyConteudo += "        <section>\n          <h2>Hello, World!</h2>\n          <p>Esta é uma estrutura limpa e responsiva pronta para receber seu código.</p>\n        </section>\n";
    } else {
        bodyConteudo += "        <h2>Hello, World!</h2>\n        <p>Esta é uma estrutura limpa e responsiva pronta para receber seu código.</p>\n";
    }
    bodyConteudo += "      </main>\n\n";

    if (temAside) {
        bodyConteudo += "      <aside>\n        <h3>Conteúdo Lateral</h3>\n        <p>Links extras, widgets ou banners informativos.</p>\n      </aside>\n    </div><!-- /.app-container -->\n\n";
    }

    if (temFooter) {
        bodyConteudo += "    <footer>\n      <p>&copy; 2026 Seu Projeto. Todos os direitos reservados.</p>\n    </footer>\n";
    }

    bodyConteudo += "  </body>";

    // Estrutura Completa do Documento HTML5
    const htmlString = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Boilerplate Inicial</title>
  <link rel="stylesheet" href="style.css">
</head>
${bodyConteudo}
</html>`;

    // 3. Montagem Dinâmica do CSS Reset & Layout Base Responsivo
    let cssString = `/* === RESET COMPLETO & BOAS PRÁTICAS === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select {
  font: inherit;
}

a {
  color: #2563eb;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul, ol {
  list-style: none;
}

/* === ESTRUTURA DO LAYOUT COMPONÍVEL === */
header, nav, main, aside, footer {
  padding: 1rem;
}\n`;

    if (temAside) {
        cssString += `
/* Grid estrutural quando houver barra lateral */
.app-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

main {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

aside {
  background: #f1f5f9;
  border-radius: 8px;
}
`;
    } else {
        cssString += `
main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  padding: 2rem 1rem;
}
`;
    }

    if (temHeader || temNav || temFooter) {
        cssString += `\n/* Estilização básica de blocos estruturais */\n`;
        if (temHeader) cssString += `header { background-color: #0f172a; color: #ffffff; }\n`;
        if (temNav) cssString += `nav ul { display: flex; gap: 1rem; }\n`;
        if (temFooter) cssString += `footer { background-color: #0f172a; color: #ffffff; text-align: center; margin-top: auto; }\n`;
    }

    // Adiciona o Media Query Responsivo se houver o Aside
    if (temAside) {
        cssString += `
/* === RESPONSIVIDADE (DESKTOP) === */
@media (min-width: 768px) {
  .app-container {
    grid-template-columns: 3fr 1fr; /* Main ocupa 3 partes, Aside ocupa 1 */
  }
}
`;
    }

    // Injeta os valores nas caixas de texto
    const caixaHtml = document.getElementById('codigo-html-base');
    const caixaCss = document.getElementById('codigo-css-reset');

    if (caixaHtml) caixaHtml.value = htmlString;
    if (caixaCss) caixaCss.value = cssString;
}

// ==========================================
// ESCUTAS DE EVENTOS E INICIALIZAÇÃO IMEDIATA
// ==========================================
(() => {
    const checkboxes = ['chk-header', 'chk-nav', 'chk-section', 'chk-aside', 'chk-footer'];
    
    checkboxes.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('change', gerarBoilerplateHTML);
        }
    });

    // Gerenciador de Cópia Individual
    const botoesCopiar = document.querySelectorAll('.btn-copiar-codigo-html');
    botoesCopiar.forEach(botao => {
        botao.addEventListener('click', () => {
            const idAlvo = botao.getAttribute('data-alvo');
            const elementoTexto = document.getElementById(idAlvo);
            
            if (elementoTexto) {
                navigator.clipboard.writeText(elementoTexto.value).then(() => {
                    const textoOriginal = botao.textContent;
                    botao.textContent = "Copiado!";
                    botao.style.color = "#2ECC71";
                    
                    setTimeout(() => {
                        botao.textContent = textoOriginal;
                        botao.style.color = "var(--primary-color)";
                    }, 1200);
                }).catch(err => {
                    console.error('Falha ao copiar:', err);
                });
            }
        });
    });

    // Dispara a primeira geração na carga da view
    gerarBoilerplateHTML();
})();