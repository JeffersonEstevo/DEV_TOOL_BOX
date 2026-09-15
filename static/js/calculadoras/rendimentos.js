(function() {
    // Escopo isolado para evitar vazamento de variáveis na SPA

    function formatarMoedaCurta(valor) {
        if (valor >= 1000000) {
            return `R$ ${(valor / 1000000).toFixed(1)}M`;
        } else if (valor >= 1000) {
            return `R$ ${(valor / 1000).toFixed(0)}k`;
        }
        return `R$ ${valor.toFixed(0)}`;
    }

    // Expõe a função de atalho globalmente para os botões do HTML
    window.definirTaxa = function(taxa) {
        const inputTaxa = document.getElementById('interestRate');
        if (inputTaxa) {
            inputTaxa.value = taxa;
            calcular();
        }
    };

    function calcular() {
        const valorInicial = parseFloat(document.getElementById('initialValue')?.value) || 0;
        const aporteFixo = parseFloat(document.getElementById('monthlyValue')?.value) || 0;
        const incluirRendimento = document.getElementById('incluirRendAporte')?.value === 'sim';
        const taxaMensal = (parseFloat(document.getElementById('interestRate')?.value) || 0) / 100;
        const meses = parseInt(document.getElementById('months')?.value) || 0;

        let saldoAtual = valorInicial;
        let totalInvestido = valorInicial;
        const historicoSaldo = [valorInicial];

        for (let i = 1; i <= meses; i++) {
            const jurosDoMes = saldoAtual * taxaMensal;
            
            let aporteDoMes = aporteFixo;
            if (incluirRendimento) {
                aporteDoMes += jurosDoMes;
            }

            saldoAtual = saldoAtual + jurosDoMes + aporteDoMes;
            totalInvestido += aporteDoMes;
            
            historicoSaldo.push(saldoAtual);
        }

        const totalJuros = saldoAtual - totalInvestido;

        const resInvestido = document.getElementById('resInvestido');
        const resJuros = document.getElementById('resJuros');
        const resTotal = document.getElementById('resTotal');

        if (resInvestido) resInvestido.innerText = totalInvestido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (resJuros) resJuros.innerText = totalJuros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (resTotal) resTotal.innerText = saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        desenharGraficoXY(historicoSaldo, meses);
    }

    function desenharGraficoXY(dados, totalMeses) {
        const svg = document.getElementById('xyChart');
        if (!svg) return;

        const defs = svg.querySelector('defs');
        svg.innerHTML = '';
        if (defs) svg.appendChild(defs);

        const paddingLeft = 65;
        const paddingRight = 30;
        const paddingTop = 20;
        const paddingBottom = 40;
        
        const width = svg.clientWidth || 800;
        const height = svg.clientHeight || 350;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const minSaldo = 0;
        const maxSaldo = Math.max(...dados) * 1.1 || 1;

        for (let i = 0; i <= 5; i++) {
            const proporcao = i / 5;
            const y = height - paddingBottom - (proporcao * chartHeight);
            const valorY = minSaldo + (proporcao * (maxSaldo - minSaldo));

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', paddingLeft);
            line.setAttribute('y1', y);
            line.setAttribute('x2', width - paddingRight);
            line.setAttribute('y2', y);
            line.setAttribute('class', 'grid-line');
            svg.appendChild(line);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', paddingLeft - 10);
            text.setAttribute('y', y + 4);
            text.setAttribute('class', 'axis-text y-axis');
            text.textContent = formatarMoedaCurta(valorY);
            svg.appendChild(text);
        }

        let pontosArea = `${paddingLeft},${height - paddingBottom} `;
        let pontosLinha = [];

        dados.forEach((valor, index) => {
            const x = paddingLeft + (index / (totalMeses || 1)) * chartWidth;
            const y = height - paddingBottom - ((valor - minSaldo) / (maxSaldo - minSaldo)) * chartHeight;
            
            pontosLinha.push(`${x},${y}`);
            pontosArea += `${x},${y} `;
        });

        pontosArea += `${paddingLeft + chartWidth},${height - paddingBottom}`;

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', pontosArea);
        polygon.setAttribute('class', 'area-fill');
        svg.appendChild(polygon);

        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', pontosLinha.join(' '));
        polyline.setAttribute('class', 'trend-line');
        svg.appendChild(polyline);

        const eixoY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        eixoY.setAttribute('x1', paddingLeft);
        eixoY.setAttribute('y1', paddingTop);
        eixoY.setAttribute('x2', paddingLeft);
        eixoY.setAttribute('y2', height - paddingBottom);
        eixoY.setAttribute('class', 'axis');
        svg.appendChild(eixoY);

        const eixoX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        eixoX.setAttribute('x1', paddingLeft);
        eixoX.setAttribute('y1', height - paddingBottom);
        eixoX.setAttribute('x2', width - paddingRight);
        eixoX.setAttribute('y2', height - paddingBottom);
        eixoX.setAttribute('class', 'axis');
        svg.appendChild(eixoX);

        const passosX = Math.min(totalMeses, 6);
        for (let i = 0; i <= passosX; i++) {
            const mesIndex = Math.round((i / passosX) * totalMeses);
            const x = paddingLeft + (mesIndex / (totalMeses || 1)) * chartWidth;

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', height - paddingBottom + 20);
            text.setAttribute('class', 'axis-text x-axis');
            text.textContent = `${mesIndex}m`;
            svg.appendChild(text);
        }
    }

    // Vincula eventos aos inputs para cálculo automático em tempo real
    const inputsDaFerramenta = document.querySelectorAll('#initialValue, #monthlyValue, #interestRate, #months, #incluirRendAporte');
    inputsDaFerramenta.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });

    const calcBtn = document.getElementById("calc-rendimento-button");
    if (calcBtn && !calcBtn.dataset.listenerAttached) {
        calcBtn.dataset.listenerAttached = "true";
        calcBtn.addEventListener("click", calcular);
    }

    // Executa o cálculo inicial assim que a ferramenta é carregada na SPA
    calcular();
})();