function alternarAbaFasor(abaId) {
    document.querySelectorAll('.fasor-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.fasor-workspace.tab-content').forEach(content => content.classList.remove('active'));

    const btnClicado = Array.from(document.querySelectorAll('.fasor-tabs .tab-btn')).find(btn => btn.getAttribute('onclick')?.includes(abaId));
    if (btnClicado) btnClicado.classList.add('active');
    
    const conteudoAba = document.getElementById(abaId);
    if (conteudoAba) conteudoAba.classList.add('active');

    setTimeout(() => calcularFasoresGeral(), 30);
}

function calcularFasoresGeral() {
    calcularMonofasico();
    calcularTrifasico();
}

// LÓGICA MONOFÁSICA
function calcularMonofasico() {
    const vMag = parseFloat(document.getElementById('fasor-v-mag')?.value) || 0;
    const vAng = parseFloat(document.getElementById('fasor-v-ang')?.value) || 0;
    const iMag = parseFloat(document.getElementById('fasor-i-mag')?.value) || 0;
    const iAng = parseFloat(document.getElementById('fasor-i-ang')?.value) || 0;
    
    const lblAngulo = document.getElementById('res-mono-angulo');
    const lblZ = document.getElementById('res-mono-z');
    const lblFP = document.getElementById('res-mono-fp');
    const canvas = document.getElementById('canvas-fasor-mono');

    if (!canvas) return;

    let defasagem = vAng - iAng;
    let zMag = iMag > 0 ? vMag / iMag : 0;
    let fp = Math.cos(defasagem * (Math.PI / 180));

    if (lblAngulo) lblAngulo.textContent = defasagem.toFixed(2) + '°';
    if (lblZ) lblZ.textContent = zMag.toFixed(2) + ' Ω';
    if (lblFP) lblFP.textContent = fp.toFixed(4);

    desenharCanvasMono(canvas, vMag, vAng, iMag, iAng);
}

function desenharCanvasMono(canvas, vMag, vAng, iMag, iAng) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const raioMax = 130;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEixosBase(ctx, cx, cy, raioMax);

    let maxVal = Math.max(vMag, iMag, 1);
    let escala = raioMax / (maxVal * 1.1);

    // Tensão (V)
    let vComp = vMag * escala;
    let vRad = vAng * (Math.PI / 180);
    let vx = cx + vComp * Math.cos(vRad);
    let vy = cy - vComp * Math.sin(vRad);
    const corPrimaria = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#3498db';
    desenharSetaFasor(ctx, cx, cy, vx, vy, corPrimaria, 2.5);

    // Corrente (I)
    let iComp = iMag * escala;
    let iRad = iAng * (Math.PI / 180);
    let ix = cx + iComp * Math.cos(iRad);
    let iy = cy - iComp * Math.sin(iRad);
    desenharSetaFasor(ctx, cx, cy, ix, iy, '#e74c3c', 2.5);
}

// LÓGICA TRIFÁSICA
function calcularTrifasico() {
    const vFase = parseFloat(document.getElementById('tri-v-mag')?.value) || 0;
    const iLinha = parseFloat(document.getElementById('tri-i-mag')?.value) || 0;
    const angCarga = parseFloat(document.getElementById('tri-angulo-carga')?.value) || 0;
    const inputFP = document.getElementById('tri-fp');
    
    const canvas = document.getElementById('canvas-fasor-tri');
    if (!canvas) return;

    let fp = Math.cos(angCarga * (Math.PI / 180));
    if (inputFP) inputFP.value = fp.toFixed(2);

    let vLinha = vFase * Math.sqrt(3);
    let pTot = Math.sqrt(3) * vLinha * iLinha * fp;
    let sTot = Math.sqrt(3) * vLinha * iLinha;
    let qTot = Math.sqrt(Math.max(0, (sTot * sTot) - (pTot * pTot)));

    document.getElementById('res-tri-p').textContent = pTot.toFixed(2) + ' W';
    document.getElementById('res-tri-q').textContent = qTot.toFixed(2) + ' VAr';
    document.getElementById('res-tri-s').textContent = sTot.toFixed(2) + ' VA';

    desenharCanvasTri(canvas, vFase, iLinha, angCarga);
}

function desenharCanvasTri(canvas, vMag, iMag, angCarga) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const raioMax = 130;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEixosBase(ctx, cx, cy, raioMax);

    let maxVal = Math.max(vMag, iMag, 1);
    let escala = raioMax / (maxVal * 1.1);

    const angulosBase = [0, -120, 120];
    const coresFases = ['#e74c3c', '#f1c40f', '#3498db'];

    angulosBase.forEach((angBase, idx) => {
        let vComp = vMag * escala;
        let vRad = angBase * (Math.PI / 180);
        let vx = cx + vComp * Math.cos(vRad);
        let vy = cy - vComp * Math.sin(vRad);
        desenharSetaFasor(ctx, cx, cy, vx, vy, coresFases[idx], 2);

        let iComp = iMag * escala;
        let iAng = angBase + angCarga;
        let iRad = iAng * (Math.PI / 180);
        let ix = cx + iComp * Math.cos(iRad);
        let iy = cy - iComp * Math.sin(iRad);
        desenharSetaFasor(ctx, cx, cy, ix, iy, coresFases[idx], 1.5, true);
    });
}

function desenharEixosBase(ctx, cx, cy, raioMax) {
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#ccc';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(ctx.canvas.width, cy);
    ctx.moveTo(cx, 0); ctx.lineTo(cx, ctx.canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, raioMax, 0, 2 * Math.PI);
    ctx.stroke();
}

function desenharSetaFasor(ctx, fromX, fromY, toX, toY, color, width, tracejado = false) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;

    if (tracejado) ctx.setLineDash([3, 3]);
    else ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.setLineDash([]);

    let angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 8 * Math.cos(angle - Math.PI / 6), toY - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - 8 * Math.cos(angle + Math.PI / 6), toY - 8 * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(toX, toY);
    ctx.fill();
}

function limparFasor() {
    ['fasor-v-mag', 'fasor-v-ang', 'fasor-i-mag', 'fasor-i-ang', 'tri-v-mag', 'tri-i-mag', 'tri-angulo-carga'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    calcularFasoresGeral();
}

function inicializarAnalisadorFasor() {
    const ids = ['fasor-v-mag', 'fasor-v-ang', 'fasor-i-mag', 'fasor-i-ang', 'tri-v-mag', 'tri-i-mag', 'tri-angulo-carga'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el._handleInputFasor) el.removeEventListener('input', el._handleInputFasor);
            el._handleInputFasor = () => calcularFasoresGeral();
            el.addEventListener('input', el._handleInputFasor);
        }
    });

    calcularFasoresGeral();
}

inicializarAnalisadorFasor();