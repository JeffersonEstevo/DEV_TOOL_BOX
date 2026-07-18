// ==========================================================================
// BANCO DE DADOS DE COMPONENTES UI (Fácil de expandir e adicionar mais!)
// ==========================================================================
// ==========================================================================
// BANCO DE DADOS DE COMPONENTES UI (Atualizado com Cards, Tabelas e Menus)
// ==========================================================================
const BANCO_COMPONENTES_UI = [
    // 1. CARDS - 1. card-produto-moderno 
    {
        id: "card-produto-moderno",
        nome: "Card de Produto Glassmorphism",
        categoria: "cards",
        html: `<div class="ui-card-prod">
    <div class="ui-card-tag">Novo</div>
    <div class="ui-card-img-placeholder">📸 Preview Imagem</div>
    <div class="ui-card-corpo">
        <h4 class="ui-card-titulo">Headphone Premium Wireless</h4>
        <p class="ui-card-desc">Cancelamento ativo de ruído inteligente e bateria com autonomia de até 40 horas contínuas.</p>
        <div class="ui-card-footer">
            <span class="ui-card-preco">R$ 899,00</span>
            <button class="ui-card-btn">Comprar</button>
        </div>
    </div>
</div>`,
        css: `/* Estilos do Card de Produto */
.ui-card-prod {
    width: 300px; background: #ffffff; border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;
    overflow: hidden; font-family: system-ui, -apple-system, sans-serif; transition: transform 0.2s ease;
}
.ui-card-prod:hover { transform: translateY(-5px); }
.ui-card-img-placeholder {
    width: 100%; height: 180px; background: #f1f5f9; color: #94a3b8;
    display: flex; align-items: center; justify-content: center; font-weight: 600;
}
.ui-card-corpo { padding: 1.25rem; position: relative; }
.ui-card-tag {
    position: absolute; top: -160px; left: 15px; background: #3b82f6; color: #fff;
    font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 50px;
}
.ui-card-titulo { margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1.15rem; font-weight: 700; }
.ui-card-desc { margin: 0 0 1.25rem 0; color: #64748b; font-size: 0.87rem; line-height: 1.5; }
.ui-card-footer { display: flex; justify-content: space-between; align-items: center; }
.ui-card-preco { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
.ui-card-btn {
    background: #0f172a; color: #ffffff; border: none; padding: 0.5rem 1rem;
    border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.ui-card-btn:hover { background: #334155; }`
    },
    // 1. CARDS - 2. card-perfil-usuario
    {
        id: "card-perfil-usuario",
        nome: "Card de Perfil Profissional / Redes Sociais",
        categoria: "cards",
        html: `<div class="ui-card-user">
    <div class="ui-user-capa"></div>
    <div class="ui-user-avatar">🧑‍💻</div>
    <div class="ui-user-info">
        <h4 class="ui-user-nome">Marcos Vinícius</h4>
        <span class="ui-user-cargo">Senior UI/UX Designer</span>
        <p class="ui-user-bio">Criando experiências digitais minimalistas e escaláveis há mais de 8 anos.</p>
        <div class="ui-user-stats">
            <div><strong>240+</strong><br><small>Projetos</small></div>
            <div><strong>12k</strong><br><small>Seguidores</small></div>
        </div>
        <button class="ui-user-btn">Seguir Perfil</button>
    </div>
</div>`,
        css: `/* Estilos do Card de Perfil */
.ui-card-user {
    width: 290px; background: #ffffff; border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #eaeaea;
    overflow: hidden; font-family: system-ui, sans-serif; text-align: center;
}
.ui-user-capa { height: 90px; background: linear-gradient(135deg, #6366f1, #a855f7); }
.ui-user-avatar {
    width: 70px; height: 70px; background: #f8fafc; border-radius: 50%; margin: -35px auto 10px auto;
    display: flex; align-items: center; justify-content: center; font-size: 2rem; border: 4px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.ui-user-info { padding: 0 1.5rem 1.5rem 1.5rem; }
.ui-user-nome { margin: 0; color: #1e293b; font-size: 1.2rem; font-weight: 700; }
.ui-user-cargo { color: #6366f1; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.ui-user-bio { color: #64748b; font-size: 0.85rem; margin: 0.75rem 0 1.25rem 0; line-height: 1.4; }
.ui-user-stats { display: flex; justify-content: space-around; margin-bottom: 1.25rem; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; }
.ui-user-stats strong { color: #0f172a; font-size: 1rem; }
.ui-user-stats small { color: #94a3b8; font-size: 0.75rem; }
.ui-user-btn {
    width: 100%; background: #6366f1; color: white; border: none; padding: 0.6rem;
    border-radius: 10px; font-weight: 600; cursor: pointer; transition: filter 0.2s;
}
.ui-user-btn:hover { filter: brightness(0.9); }`
    },
    // 1. CARDS - 3. card-precificacao-saas
    {
        id: "card-precificacao-saas",
        nome: "Card de Plano / Precificação Pro",
        categoria: "cards",
        html: `<div class="ui-card-price ui-price-featured">
    <div class="ui-price-badge">Mais Popular</div>
    <span class="ui-price-plano">Plano Pro</span>
    <div class="ui-price-valor">
        <span class="ui-price-moeda">R$</span>
        <strong class="ui-price-num">79</strong>
        <span class="ui-price-periodo">/mês</span>
    </div>
    <ul class="ui-price-recursos">
        <li>✨ Acesso a todos os componentes</li>
        <li>🚀 Projetos ilimitados</li>
        <li>⚡ Suporte via Discord 24/7</li>
        <li>🔒 Atualizações de Segurança</li>
    </ul>
    <button class="ui-price-btn">Começar Agora</button>
</div>`,
        css: `/* Estilos do Card de Precificação */
.ui-card-price {
    width: 280px; background: #ffffff; border-radius: 20px; padding: 2rem 1.5rem;
    border: 2px solid #e2e8f0; font-family: system-ui, sans-serif; position: relative; display: flex; flex-direction: column;
}
.ui-price-featured { border-color: #3b82f6; box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1); }
.ui-price-badge {
    position: absolute; top: -14px; right: 20px; background: #3b82f6; color: white;
    font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 50px;
}
.ui-price-plano { color: #64748b; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; }
.ui-price-valor { display: flex; align-items: baseline; margin: 1rem 0 1.5rem 0; color: #0f172a; }
.ui-price-moeda { font-size: 1rem; font-weight: 600; margin-right: 2px; }
.ui-price-num { font-size: 2.75rem; font-weight: 800; }
.ui-price-periodo { color: #64748b; font-size: 0.9rem; }
.ui-price-recursos { list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
.ui-price-recursos li { font-size: 0.88rem; color: #334155; text-align: left; }
.ui-price-btn {
    width: 100%; background: #3b82f6; color: white; border: none; padding: 0.75rem;
    border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; margin-top: auto;
}
.ui-price-btn:hover { background: #2563eb; }`
    },
    // 1. CARDS - 4. card-artigo-blog
    {
        id: "card-artigo-blog",
        nome: "Card de Artigo / Post de Blog",
        categoria: "cards",
        html: `<div class="ui-card-blog">
    <div class="ui-blog-banner">💻 Artigo</div>
    <div class="ui-blog-conteudo">
        <span class="ui-blog-meta">18 Julho, 2026 • 5 min leitura</span>
        <h4 class="ui-blog-titulo">O Futuro das Lógicas de Estado em Arquiteturas SPA Modernas</h4>
        <p class="ui-blog-resumo">Descubra como o gerenciamento reativo e componentizado pode transformar a velocidade de renderização no front-end.</p>
        <a href="javascript:void(0)" class="ui-blog-link">Ler artigo completo →</a>
    </div>
</div>`,
        css: `/* Estilos do Card de Blog */
.ui-card-blog {
    width: 320px; background: #ffffff; border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; font-family: system-ui, sans-serif;
}
.ui-blog-banner {
    height: 150px; background: #0f172a; color: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;
}
.ui-blog-conteudo { padding: 1.25rem; text-align: left; }
.ui-blog-meta { color: #94a3b8; font-size: 0.75rem; font-weight: 600; display: block; margin-bottom: 0.5rem; }
.ui-blog-titulo { margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1.1rem; font-weight: 700; line-height: 1.4; }
.ui-blog-resumo { color: #64748b; font-size: 0.85rem; line-height: 1.5; margin: 0 0 1.25rem 0; }
.ui-blog-link { color: #6366f1; text-decoration: none; font-weight: 700; font-size: 0.85rem; transition: color 0.2s; }
.ui-blog-link:hover { color: #4f46e5; }`
    },
    // 1. CARDS - 5. card-dashboard-metrica  
    {
        id: "card-dashboard-metrica",
        nome: "Card de Métrica / Dashboard Analytics",
        categoria: "cards",
        html: `<div class="ui-card-dash">
    <div class="ui-dash-topo">
        <span class="ui-dash-label">Conversões Mensais</span>
        <div class="ui-dash-icon">📈</div>
    </div>
    <div class="ui-dash-corpo">
        <strong class="ui-dash-valor">3,842</strong>
        <span class="ui-dash-indicador positivo">+12.4%</span>
    </div>
    <p class="ui-dash-comparativo">em relação ao mês anterior</p>
</div>`,
        css: `/* Estilos do Card de Dashboard */
.ui-card-dash {
    width: 260px; background: #ffffff; border-radius: 14px; padding: 1.25rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; font-family: system-ui, sans-serif;
}
.ui-dash-topo { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.ui-dash-label { color: #64748b; font-size: 0.85rem; font-weight: 600; }
.ui-dash-icon { width: 32px; height: 32px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.ui-dash-corpo { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 0.5rem; }
.ui-dash-valor { font-size: 1.75rem; font-weight: 800; color: #0f172a; }
.ui-dash-indicador { font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px; }
.ui-dash-indicador.positivo { background: #dcfce7; color: #16a34a; }
.ui-dash-comparativo { margin: 0; color: #94a3b8; font-size: 0.75rem; text-align: left; }`
    },

    // 2. MENUS & NAV - 1. header-minimalista-dropdown
    {
        id: "header-minimalista-dropdown",
        nome: "Header Minimalista com Dropdown Hover",
        categoria: "menus",
        html: `<header class="ui-nav-minimal">
    <div class="ui-nav-logo">⚡ TechFlow</div>
    <nav class="ui-nav-links">
        <a href="javascript:void(0)" class="ui-nav-item">Home</a>
        <div class="ui-nav-dropdown-wrapper">
            <a href="javascript:void(0)" class="ui-nav-item drop-trigger">Recursos ▼</a>
            <div class="ui-nav-dropdown-box">
                <a href="javascript:void(0)">Componentes UI</a>
                <a href="javascript:void(0)">API Integrations</a>
                <a href="javascript:void(0)">Segurança Pro</a>
            </div>
        </div>
        <a href="javascript:void(0)" class="ui-nav-item">Preços</a>
    </nav>
    <div class="ui-nav-action">
        <button class="ui-nav-btn-light">Login</button>
    </div>
</header>`,
        css: `/* Estilos do Header Minimalista */
.ui-nav-minimal {
    width: 100%; min-width: 650px; background: #ffffff; padding: 0.75rem 1.5rem;
    border: 1px solid #e2e8f0; border-radius: 12px; display: flex; justify-content: space-between;
    align-items: center; font-family: system-ui, sans-serif; box-sizing: border-box;
}
.ui-nav-logo { font-weight: 800; font-size: 1.15rem; color: #0f172a; cursor: pointer; }
.ui-nav-links { display: flex; gap: 1.5rem; align-items: center; }
.ui-nav-item { text-decoration: none; color: #475569; font-size: 0.9rem; font-weight: 600; transition: color 0.15s; }
.ui-nav-item:hover { color: #0f172a; }
/* Sistema do Dropdown via CSS puro */
.ui-nav-dropdown-wrapper { position: relative; padding: 0.5rem 0; }
.ui-nav-dropdown-box {
    position: absolute; top: 100%; left: 0; background: #ffffff; min-width: 160px;
    border-radius: 8px; border: 1px solid #edf2f7; box-shadow: 0 10px 15px rgba(0,0,0,0.05);
    display: none; flex-direction: column; padding: 0.5rem 0; z-index: 10;
}
.ui-nav-dropdown-box a {
    padding: 0.5rem 1rem; text-decoration: none; color: #475569; font-size: 0.85rem; text-align: left;
}
.ui-nav-dropdown-box a:hover { background: #f8fafc; color: #0f172a; }
.ui-nav-dropdown-wrapper:hover .ui-nav-dropdown-box { display: flex; }
.ui-nav-btn-light {
    background: #f1f5f9; color: #1e293b; border: none; padding: 0.45rem 1rem;
    border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
}`
    },

    // 2. MENUS & NAV - 2. navbar-corporativa-busca
    {
        id: "navbar-corporativa-busca",
        nome: "Navbar Corporativa com Busca e CTA",
        categoria: "menus",
        html: `<header class="ui-nav-corp">
    <div class="ui-corp-logo">🌐 NexusCorp</div>
    <div class="ui-corp-search">
        <input type="text" placeholder="Buscar no site...">
    </div>
    <div class="ui-corp-right">
        <a href="javascript:void(0)">Suporte</a>
        <button class="ui-corp-btn-cta">Agendar Demo</button>
    </div>
</header>`,
        css: `/* Estilos da Navbar Corporativa */
.ui-nav-corp {
    width: 100%; min-width: 650px; background: #0f172a; padding: 0.85rem 1.5rem;
    border-radius: 12px; display: flex; justify-content: space-between; align-items: center;
    font-family: system-ui, sans-serif; box-sizing: border-box;
}
.ui-corp-logo { color: #ffffff; font-weight: 700; font-size: 1.1rem; }
.ui-corp-search input {
    width: 220px; background: #1e293b; border: 1px solid #334155; padding: 0.4rem 0.8rem;
    border-radius: 6px; color: #ffffff; font-size: 0.85rem; outline: none; transition: width 0.2s;
}
.ui-corp-search input:focus { width: 260px; border-color: #3b82f6; }
.ui-corp-right { display: flex; align-items: center; gap: 1.25rem; }
.ui-corp-right a { color: #94a3b8; text-decoration: none; font-size: 0.88rem; font-weight: 500; }
.ui-corp-right a:hover { color: #ffffff; }
.ui-corp-btn-cta {
    background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem;
    border-radius: 6px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: background 0.15s;
}
.ui-corp-btn-cta:hover { background: #2563eb; }`
    },

    // 2. MENUS & NAV - 3. menu-floating-glassmorphism
    {
        id: "menu-floating-glassmorphism",
        nome: "Menu Flutuante Glassmorphism Style",
        categoria: "menus",
        html: `<div class="ui-nav-glass-blur">
    <a href="javascript:void(0)" class="ui-glass-item active">Dashboard</a>
    <a href="javascript:void(0)" class="ui-glass-item">Analytics</a>
    <a href="javascript:void(0)" class="ui-glass-item">Settings</a>
</div>`,
        css: `/* Estilos do Menu Flutuante */
.ui-nav-glass-blur {
    background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4); padding: 0.5rem; border-radius: 50px;
    display: inline-flex; gap: 0.5rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    font-family: system-ui, sans-serif;
}
.ui-glass-item {
    text-decoration: none; color: #64748b; font-size: 0.88rem; font-weight: 600;
    padding: 0.5rem 1.25rem; border-radius: 50px; transition: all 0.2s ease;
}
.ui-glass-item:hover { color: #0f172a; background: rgba(0, 0, 0, 0.02); }
.ui-glass-item.active { background: #0f172a; color: #ffffff; }`
    },

    // 3. TABELAS - 1. tabela-dados-minimalista
    {
        id: "tabela-dados-minimalista",
        nome: "Tabela de Clientes Administrativa",
        categoria: "tabelas",
        html: `<table class="ui-tabela-admin">
    <thead>
        <tr>
            <th>Usuário</th>
            <th>Função</th>
            <th>Status</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Carlos Eduardo</strong><br><small>carlos@email.com</small></td>
            <td>Admin</td>
            <td><span class="ui-status-badge online">Ativo</span></td>
            <td><a href="javascript:void(0)" class="ui-tabela-link">Editar</a></td>
        </tr>
        <tr>
            <td><strong>Ana Beatriz</strong><br><small>ana@email.com</small></td>
            <td>Editor</td>
            <td><span class="ui-status-badge offline">Inativo</span></td>
            <td><a href="javascript:void(0)" class="ui-tabela-link">Editar</a></td>
        </tr>
    </tbody>
</table>`,
        css: `/* Estilos da Tabela Minimalista */
.ui-tabela-admin {
    width: 100%; max-width: 600px; border-collapse: collapse;
    background: #ffffff; border-radius: 12px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02); font-family: system-ui, sans-serif;
}
.ui-tabela-admin th {
    background: #f8fafc; color: #64748b; text-align: left;
    padding: 1rem; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid #edf2f7;
}
.ui-tabela-admin td { padding: 1rem; color: #334155; font-size: 0.9rem; border-bottom: 1px solid #f1f5f9; }
.ui-tabela-admin tr:last-child td { border-bottom: none; }
.ui-tabela-admin small { color: #94a3b8; font-size: 0.8rem; }
.ui-status-badge { padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 700; border-radius: 6px; }
.ui-status-badge.online { background: #dcfce7; color: #15803d; }
.ui-status-badge.offline { background: #ffeeeb; color: #b91c1c; }
.ui-tabela-link { color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 0.85rem; }
.ui-tabela-link:hover { text-decoration: underline; }`
    },
    
    
    
    // 3. TABELAS - 2. tabela-produtos-ecommerce
    {
        id: "tabela-produtos-ecommerce",
        nome: "Tabela de Inventário / E-commerce com Imagem",
        categoria: "tabelas",
        html: `<table class="ui-tabela-prod">
        <thead>
            <tr>
                <th>Produto</th>
                <th>Estoque</th>
                <th>Preço</th>
                <th>Categoria</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="ui-prod-cell">
                        <span class="ui-prod-icon">📱</span>
                        <div>
                            <strong>iPhone 15 Pro</strong><br>
                            <small>SKU: IPH15-256-BLK</small>
                        </div>
                    </div>
                </td>
                <td><span class="ui-badge-estoque em-alta">18 em estoque</span></td>
                <td class="ui-txt-preco">R$ 7.299,00</td>
                <td><span class="ui-tag-cat">Eletrônicos</span></td>
            </tr>
            <tr>
                <td>
                    <div class="ui-prod-cell">
                        <span class="ui-prod-icon">🎧</span>
                        <div>
                            <strong>AirPods Max</strong><br>
                            <small>SKU: APD-MAX-GRY</small>
                        </div>
                    </div>
                </td>
                <td><span class="ui-badge-estoque esgotando">2 restando</span></td>
                <td class="ui-txt-preco">R$ 4.890,00</td>
                <td><span class="ui-tag-cat">Áudio</span></td>
            </tr>
        </tbody>
    </table>`,
        css: `/* Estilos da Tabela de Produtos */
    .ui-tabela-prod {
        width: 100%; max-width: 650px; border-collapse: collapse;
        background: #ffffff; border-radius: 12px; overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.02); font-family: system-ui, sans-serif;
    }
    .ui-tabela-prod th {
        background: #f8fafc; color: #64748b; text-align: left;
        padding: 1rem; font-size: 0.85rem; font-weight: 600; border-bottom: 1px solid #edf2f7;
    }
    .ui-tabela-prod td { padding: 1rem; color: #334155; font-size: 0.9rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .ui-tabela-prod tr:last-child td { border-bottom: none; }
    .ui-prod-cell { display: flex; align-items: center; gap: 0.75rem; text-align: left; }
    .ui-prod-icon { width: 32px; height: 32px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .ui-tabela-prod small { color: #94a3b8; font-size: 0.75rem; }
    .ui-badge-estoque { padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 4px; }
    .ui-badge-estoque.em-alta { background: #e0f2fe; color: #0369a1; }
    .ui-badge-estoque.esgotando { background: #fef3c7; color: #b45309; }
    .ui-txt-preco { font-weight: 700; color: #0f172a; }
    .ui-tag-cat { background: #f1f5f9; color: #475569; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 500; }`
    },

    // 3. TABELAS - 3. tabela-logs-dark
    {
        id: "tabela-logs-dark",
        nome: "Tabela Dark Mode de Logs e Eventos API",
        categoria: "tabelas",
        html: `<table class="ui-tabela-dark">
        <thead>
            <tr>
                <th>Método / Endpoint</th>
                <th>Status</th>
                <th>Origem</th>
                <th>Tempo</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><span class="ui-log-method get">GET</span> <code class="ui-log-route">/api/v1/users</code></td>
                <td><span class="ui-log-status s200">200 OK</span></td>
                <td class="ui-log-mono">192.168.1.45</td>
                <td class="ui-log-mono">14ms</td>
            </tr>
            <tr>
                <td><span class="ui-log-method post">POST</span> <code class="ui-log-route">/api/v1/auth/login</code></td>
                <td><span class="ui-log-status s401">401 Unauth</span></td>
                <td class="ui-log-mono">187.45.12.110</td>
                <td class="ui-log-mono">42ms</td>
            </tr>
        </tbody>
    </table>`,
        css: `/* Estilos da Tabela Dark Mode */
    .ui-tabela-dark {
        width: 100%; max-width: 650px; border-collapse: collapse;
        background: #0f172a; border-radius: 10px; overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); font-family: monospace;
    }
    .ui-tabela-dark th {
        background: #1e293b; color: #94a3b8; text-align: left;
        padding: 0.85rem 1rem; font-size: 0.8rem; font-weight: 600; border-bottom: 1px solid #334155;
        font-family: system-ui, sans-serif;
    }
    .ui-tabela-dark td { padding: 0.85rem 1rem; color: #e2e8f0; font-size: 0.85rem; border-bottom: 1px solid #1e293b; text-align: left; }
    .ui-tabela-dark tr:last-child td { border-bottom: none; }
    .ui-log-method { font-size: 0.75rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px; margin-right: 0.5rem; }
    .ui-log-method.get { background: #10b981; color: #ffffff; }
    .ui-log-method.post { background: #3b82f6; color: #ffffff; }
    .ui-log-route { color: #38bdf8; }
    .ui-log-status { font-weight: 700; font-size: 0.8rem; }
    .ui-log-status.s200 { color: #4ade80; }
    .ui-log-status.s401 { color: #f87171; }
    .ui-log-mono { color: #94a3b8; }`
    },

    // 4. MODAL - 1. modal-confirmacao-moderno
    {
        id: "modal-confirmacao-moderno",
        nome: "Modal de Confirmação / Alerta Clássico",
        categoria: "modais-footers",
        html: `<div class="ui-modal-box">
        <div class="ui-modal-header">
            <div class="ui-modal-icon">⚠️</div>
            <h4 class="ui-modal-title">Desativar Conta</h4>
        </div>
        <p class="ui-modal-text">Tem certeza que deseja desativar a sua assinatura? Esta ação suspenderá seus acessos imediatamente e não poderá ser desfeita.</p>
        <div class="ui-modal-actions">
            <button class="ui-modal-btn cancel">Cancelar</button>
            <button class="ui-modal-btn confirm">Confirmar e Desativar</button>
        </div>
    </div>`,
        css: `/* Estilos do Modal */
    .ui-modal-box {
        width: 100%; max-width: 400px; background: #ffffff; border-radius: 16px;
        padding: 1.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        border: 1px solid #e2e8f0; font-family: system-ui, sans-serif; text-align: left;
    }
    .ui-modal-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .ui-modal-icon { width: 36px; height: 36px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .ui-modal-title { margin: 0; color: #1e293b; font-size: 1.2rem; font-weight: 700; }
    .ui-modal-text { color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 1.5rem 0; }
    .ui-modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
    .ui-modal-btn { padding: 0.55rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; border: none; transition: background 0.15s; }
    .ui-modal-btn.cancel { background: #f1f5f9; color: #475569; }
    .ui-modal-btn.cancel:hover { background: #e2e8f0; }
    .ui-modal-btn.confirm { background: #ef4444; color: #ffffff; }
    .ui-modal-btn.confirm:hover { background: #dc2626; }`
    },

    // 5. FOOTER - 1. footer-institucional-completo
    {
        id: "footer-institucional-completo",
        nome: "Footer Corporativo com Colunas e Newsletter",
        categoria: "modais-footers",
        html: `<footer class="ui-footer-rich">
        <div class="ui-footer-grid">
            <div class="ui-footer-brand">
                <span class="ui-footer-logo">🚀 DevPlatform</span>
                <p>Acelerando o desenvolvimento de interfaces desde 2026.</p>
            </div>
            <div class="ui-footer-col">
                <h5>Produto</h5>
                <a href="javascript:void(0)">Componentes</a>
                <a href="javascript:void(0)">Preços</a>
                <a href="javascript:void(0)">Roadmap</a>
            </div>
            <div class="ui-footer-col">
                <h5>Suporte</h5>
                <a href="javascript:void(0)">Documentação</a>
                <a href="javascript:void(0)">Guias</a>
                <a href="javascript:void(0)">Contato</a>
            </div>
        </div>
        <div class="ui-footer-bottom">
            <p>&copy; 2026 DevPlatform. Todos os direitos reservados.</p>
        </div>
    </footer>`,
        css: `/* Estilos do Footer Rich */
    .ui-footer-rich {
        width: 100%; min-width: 650px; background: #0f172a; border-radius: 12px;
        padding: 2rem 2rem 1rem 2rem; font-family: system-ui, sans-serif; box-sizing: border-box; text-align: left;
    }
    .ui-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #1e293b; }
    .ui-footer-brand p { color: #94a3b8; font-size: 0.85rem; margin-top: 0.5rem; max-width: 200px; line-height: 1.4; }
    .ui-footer-logo { color: #ffffff; font-weight: 800; font-size: 1.1rem; }
    .ui-footer-col h5 { color: #ffffff; margin: 0 0 0.75rem 0; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .ui-footer-col a { display: block; color: #94a3b8; text-decoration: none; font-size: 0.85rem; margin-bottom: 0.5rem; transition: color 0.15s; }
    .ui-footer-col a:hover { color: #3b82f6; }
    .ui-footer-bottom { padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; }
    .ui-footer-bottom p { color: #64748b; font-size: 0.75rem; margin: 0; }`
    },
    
    // 6. BOTOÕES - 1. botoes-design-system
    {
        id: "botoes-design-system",
        nome: "Botões de Marca (Primary, Secondary & Outline)",
        categoria: "botoes",
        html: `<div class="ui-btn-group">
        <button class="ui-btn-ds primary">Primary Action</button>
        <button class="ui-btn-ds secondary">Secondary</button>
        <button class="ui-btn-ds outline">Outline Button</button>
    </div>`,
        css: `/* Estilos dos Botões Base */
    .ui-btn-group { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; font-family: system-ui, sans-serif; }
    .ui-btn-ds {
        padding: 0.6rem 1.25rem; font-size: 0.88rem; font-weight: 600; border-radius: 8px;
        cursor: pointer; border: 1px solid transparent; transition: all 0.2s ease;
    }
    .ui-btn-ds.primary { background: #3b82f6; color: #ffffff; }
    .ui-btn-ds.primary:hover { background: #2563eb; transform: translateY(-1px); }
    .ui-btn-ds.secondary { background: #f1f5f9; color: #334155; }
    .ui-btn-ds.secondary:hover { background: #e2e8f0; }
    .ui-btn-ds.outline { background: transparent; border-color: #cbd5e1; color: #475569; }
    .ui-btn-ds.outline:hover { background: #f8fafc; border-color: #94a3b8; color: #0f172a; }`
    },

    // 6. BOTOÕES - 2. botao-glow-gradient
    {
        id: "botao-glow-gradient",
        nome: "Botão de Destaque com Gradiente e Brilho",
        categoria: "botoes",
        html: `<div class="ui-btn-wrapper-glow">
        <button class="ui-btn-glow">Garantir Meu Acesso</button>
    </div>`,
        css: `/* Estilo do Botão Glow */
    .ui-btn-wrapper-glow { font-family: system-ui, sans-serif; padding: 0.5rem; }
    .ui-btn-glow {
        position: relative; padding: 0.75rem 1.75rem; font-size: 0.95rem; font-weight: 700;
        color: white; background: linear-gradient(135deg, #6366f1, #a855f7);
        border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
        transition: all 0.3s ease;
    }
    .ui-btn-glow:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(168, 85, 247, 0.6);
    }
    .ui-btn-glow:active { transform: translateY(0); }`
    },

   // 6. BOTOÕES - 3. botoes-semanticos-status
    {
        id: "botoes-semanticos-status",
        nome: "Botões de Estado / Feedback Semântico",
        categoria: "botoes",
        html: `<div class="ui-btn-group">
        <button class="ui-btn-status success">✓ Salvar Cadastro</button>
        <button class="ui-btn-status warning">⚠️ Atenção</button>
        <button class="ui-btn-status danger">🗑 Excluir Item</button>
    </div>`,
        css: `/* Estilos de Botões Semânticos */
    .ui-btn-status {
        padding: 0.55rem 1.1rem; font-size: 0.85rem; font-weight: 600; border-radius: 6px;
        cursor: pointer; border: none; color: white; display: inline-flex; align-items: center; gap: 0.4rem;
        transition: filter 0.2s; font-family: system-ui, sans-serif;
    }
    .ui-btn-status:hover { filter: brightness(0.9); }
    .ui-btn-status.success { background: #10b981; }
    .ui-btn-status.warning { background: #f59e0b; }
    .ui-btn-status.danger { background: #ef4444; }`
    },

    // 6. BOTOÕES - 4. botao-slide-arrow
    {
        id: "botao-slide-arrow",
        nome: "Botão Textual com Seta Deslizante (Hover Effect)",
        categoria: "botoes",
        html: `<button class="ui-btn-slide">
        <span>Ver todos os projetos</span>
        <span class="ui-btn-arrow">→</span>
    </button>`,
        css: `/* Estilo do Botão Textual com Seta */
    .ui-btn-slide {
        background: transparent; border: none; color: #0f172a; font-size: 0.9rem;
        font-weight: 700; cursor: pointer; display: inline-flex; align-items: center;
        gap: 0.5rem; font-family: system-ui, sans-serif; padding: 0.5rem 0;
        position: relative;
    }
    .ui-btn-arrow { transition: transform 0.2s ease; }
    .ui-btn-slide:hover .ui-btn-arrow { transform: translateX(5px); }
    .ui-btn-slide::after {
        content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px;
        background: #0f172a; transform: scaleX(0); transform-origin: right; transition: transform 0.25s ease;
    }
    .ui-btn-slide:hover::after { transform: scaleX(1); transform-origin: left; }`
    }

];

// ==========================================================================
// RENDERIZADOR DO MOTOR DE COMPONENTES COM PAGINAÇÃO
// ==========================================================================
(() => {
    const gridBiblioteca = document.getElementById('grid-biblioteca-ui');
    const containerPaginacao = document.getElementById('paginacao-container-ui');
    const botoesAba = document.querySelectorAll('.btn-aba-ui');

    if (!gridBiblioteca) return;

    // VARIÁVEIS DE ESTADO DA PAGINAÇÃO
    let categoriaAtual = "todos";
    let paginaAtual = 1;
    const itensPorPagina = 3; // Quantos blocos aparecem por página

    // Função central para construir a UI e a Paginação
    function renderizarElementosUI() {
        gridBiblioteca.innerHTML = '';
        containerPaginacao.innerHTML = '';

        // 1. Filtragem por categoria
        const itensFiltrados = BANCO_COMPONENTES_UI.filter(item => 
            categoriaAtual === "todos" || item.categoria === categoriaAtual
        );

        // 2. Cálculo de Páginas
        const totalItens = itensFiltrados.length;
        const totalPaginas = Math.ceil(totalItens / itensPorPagina);
        
        // Ajuste de segurança caso os filtros reduzam as páginas drasticamente
        if (paginaAtual > totalPaginas) paginaAtual = Math.max(1, totalPaginas);

        // 3. Recorte dos itens que pertencem à página atual
        const indiceInicial = (paginaAtual - 1) * itensPorPagina;
        const indiceFinal = indiceInicial + itensPorPagina;
        const itensDaPagina = itensFiltrados.slice(indiceInicial, indiceFinal);

        // 4. Renderização dos Componentes da Página Atual
        itensDaPagina.forEach(comp => {
            const idStyle = `style-runtime-${comp.id}`;
            if (!document.getElementById(idStyle)) {
                const styleTag = document.createElement('style');
                styleTag.id = idStyle;
                styleTag.textContent = comp.css;
                document.head.appendChild(styleTag);
            }

            const bloco = document.createElement('div');
            bloco.className = 'bloco-componente-ui';
            bloco.innerHTML = `
                <div class="topo-componente-ui">
                    <strong style="color: var(--text-main); font-size: 0.95rem;">${comp.nome}</strong>
                    <span class="badge-categoria-ui">${comp.categoria}</span>
                </div>
                <div class="preview-real-ui">${comp.html}</div>
                <div class="rodape-codigos-ui">
                    <div class="caixa-codigo-ui">
                        <div style="display: flex; justify-content: space-between;">
                            <label style="font-size: 0.75rem; font-weight:700; color: var(--text-main);">Código HTML</label>
                            <button class="btn-copiar-ui" data-tipo="HTML" style="background:none; border:none; color:var(--primary-color); font-weight:700; font-size:0.75rem; cursor:pointer;">Copiar HTML</button>
                        </div>
                        <textarea readonly>${comp.html}</textarea>
                    </div>
                    <div class="caixa-codigo-ui">
                        <div style="display: flex; justify-content: space-between;">
                            <label style="font-size: 0.75rem; font-weight:700; color: var(--text-main);">Código CSS</label>
                            <button class="btn-copiar-ui" data-tipo="CSS" style="background:none; border:none; color:var(--primary-color); font-weight:700; font-size:0.75rem; cursor:pointer;">Copiar CSS</button>
                        </div>
                        <textarea readonly>${comp.css}</textarea>
                    </div>
                </div>
            `;

            // Evento de Cópia
            bloco.querySelectorAll('.btn-copiar-ui').forEach(btn => {
                btn.addEventListener('click', () => {
                    const textarea = btn.parentElement.nextElementSibling;
                    navigator.clipboard.writeText(textarea.value).then(() => {
                        const originalTxt = btn.textContent;
                        btn.textContent = `¡${btn.getAttribute('data-tipo')} Copiado!`;
                        btn.style.color = '#2ECC71';
                        setTimeout(() => {
                            btn.textContent = originalTxt;
                            btn.style.color = 'var(--primary-color)';
                        }, 1200);
                    });
                });
            });

            gridBiblioteca.appendChild(bloco);
        });

        // 5. GERAÇÃO DOS BOTÕES DE PAGINAÇÃO (Apenas se houver mais de 1 página)
        if (totalPaginas > 1) {
            for (let i = 1; i <= totalPaginas; i++) {
                const btnPagina = document.createElement('button');
                btnPagina.textContent = i;
                
                // Estilização dinâmica rápida dos botões numéricos
                btnPagina.style.padding = '0.5rem 0.85rem';
                btnPagina.style.fontSize = '0.85rem';
                btnPagina.style.fontWeight = '700';
                btnPagina.style.border = '1px solid var(--border-color)';
                btnPagina.style.borderRadius = '6px';
                btnPagina.style.cursor = 'pointer';
                
                if (i === paginaAtual) {
                    btnPagina.style.backgroundColor = 'var(--primary-color)';
                    btnPagina.style.color = '#ffffff';
                } else {
                    btnPagina.style.backgroundColor = 'var(--bg-sidebar)';
                    btnPagina.style.color = 'var(--text-main)';
                }

                btnPagina.addEventListener('click', () => {
                    paginaAtual = i;
                    renderizarElementosUI();
                    // Scroll suave para o topo da ferramenta ao mudar de página
                    gridBiblioteca.scrollIntoView({ behavior: 'smooth' });
                });

                containerPaginacao.appendChild(btnPagina);
            }
        }
    }

    // --- GERENCIAMENTO DE ALTERNAÇÃO DE ABAS ---
    botoesAba.forEach(aba => {
        aba.addEventListener('click', () => {
            botoesAba.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            aba.classList.remove('btn-secondary');
            aba.classList.add('btn-primary');

            // Reseta para a página 1 e aplica o filtro da nova categoria
            categoriaAtual = aba.getAttribute('data-categoria');
            paginaAtual = 1; 
            renderizarElementosUI();
        });
    });

    // Inicialização automática
    renderizarElementosUI();
})();
