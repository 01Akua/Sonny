// --- Fondo de girasoles (líneas orgánicas que se van creando) ---
let sunflowerAnimationId = null;
let sparkleAnimationId = null;

function buildSunflowerStrokes(cx, cy, scale) {
    const strokes = [];
    const twoPi = Math.PI * 2;
    const petalCount = 20;
    const petalLength = 0.2 * scale;
    const petalWidth = 0.045 * scale;
    const centerRadius = 0.032 * scale;

    // Tallo con curva suave tipo S
    const stemSteps = 12;
    for (let i = 0; i < stemSteps; i++) {
        const t0 = i / stemSteps;
        const t1 = (i + 1) / stemSteps;
        const sway = 0.022 * scale * Math.sin(t0 * Math.PI);
        strokes.push({
            x1: cx + sway, y1: cy + petalLength + t0 * 0.22 * scale,
            x2: cx + 0.022 * scale * Math.sin(t1 * Math.PI), y2: cy + petalLength + t1 * 0.22 * scale,
            color: '#1e3d16'
        });
    }

    // Hojas en forma de lágrima suave
    for (const side of [-1, 1]) {
        const baseY = cy + petalLength + 0.07 * scale;
        const steps = 14;
        for (let i = 0; i < steps; i++) {
            const t0 = i / steps;
            const t1 = (i + 1) / steps;
            const curve = (t) => Math.sin(t * Math.PI);
            const x0 = cx + side * petalWidth * 1.2 * curve(t0) + 0.008 * Math.sin(t0 * 15);
            const y0 = baseY + t0 * 0.12 * scale;
            const x1 = cx + side * petalWidth * 1.2 * curve(t1) + 0.008 * Math.sin(t1 * 15);
            const y1 = baseY + t1 * 0.12 * scale;
            strokes.push({ x1: x0, y1: y0, x2: x1, y2: y1, color: '#2d5a22' });
        }
    }

    // Centro tipo semillas: espiral de Fibonacci con pequeños trazos
    const seedCount = 48;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < seedCount; i++) {
        const r = centerRadius * Math.sqrt(i + 0.5) / Math.sqrt(seedCount);
        const theta = i * goldenAngle;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const dx = 0.008 * scale * Math.cos(theta);
        const dy = 0.008 * scale * Math.sin(theta);
        const dark = i % 3 === 0 ? '#3d2914' : '#5c3d1e';
        const mid = '#6b4a28';
        strokes.push({ x1: x - dx, y1: y - dy, x2: x + dx, y2: y + dy, color: i % 2 === 0 ? dark : mid });
    }
    // Borde del centro (círculo suave)
    const rimSegs = 28;
    for (let i = 0; i < rimSegs; i++) {
        const a0 = (i / rimSegs) * twoPi;
        const a1 = ((i + 1) / rimSegs) * twoPi;
        const r = centerRadius * (1 + 0.06 * Math.sin(i * 0.9));
        strokes.push({
            x1: cx + r * Math.cos(a0), y1: cy + r * Math.sin(a0),
            x2: cx + r * Math.cos(a1), y2: cy + r * Math.sin(a1),
            color: '#7d5a35'
        });
    }

    // Pétalos en forma de óvalo (contorno suave, como pétalo real)
    const petalColors = ['#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ff8f00'];
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * twoPi + 0.02 * (i % 2);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const rot = (px, py) => ({ x: cx + (px * cos - py * sin), y: cy + (px * sin + py * cos) });
        const steps = 10;
        const lenVar = 0.92 + 0.16 * Math.sin(i * 0.5);
        const L = petalLength * lenVar;
        const W = petalWidth * (0.9 + 0.2 * Math.sin(i * 0.7));
        for (let k = 0; k < steps; k++) {
            const t0 = k / steps;
            const t1 = (k + 1) / steps;
            const ovalX = (t) => W * Math.sin(t * Math.PI);
            const ovalY = (t) => -centerRadius - L * t;
            const p0 = rot(ovalX(t0), ovalY(t0));
            const p1 = rot(ovalX(t1), ovalY(t1));
            const colorIndex = Math.min(Math.floor((1 - t0) * petalColors.length), petalColors.length - 1);
            strokes.push({ x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, color: petalColors[colorIndex] });
        }
        for (let k = 0; k < steps; k++) {
            const t0 = k / steps;
            const t1 = (k + 1) / steps;
            const ovalX = (t) => -W * Math.sin(t * Math.PI);
            const ovalY = (t) => -centerRadius - L * t;
            const p0 = rot(ovalX(t0), ovalY(t0));
            const p1 = rot(ovalX(t1), ovalY(t1));
            const colorIndex = Math.min(Math.floor((1 - t0) * petalColors.length), petalColors.length - 1);
            strokes.push({ x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, color: petalColors[colorIndex] });
        }
    }

    return strokes;
}

function initSunflowerBackground() {
    const canvas = document.getElementById('sunflowerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const sunflowers = [
        { cx: 0.08, cy: 0.12, scale: 0.16 },
        { cx: 0.92, cy: 0.1, scale: 0.14 },
        { cx: 0.12, cy: 0.35, scale: 0.18 },
        { cx: 0.88, cy: 0.32, scale: 0.17 },
        { cx: 0.06, cy: 0.58, scale: 0.15 },
        { cx: 0.94, cy: 0.55, scale: 0.16 },
        { cx: 0.1, cy: 0.82, scale: 0.2 },
        { cx: 0.9, cy: 0.8, scale: 0.18 },
        { cx: 0.28, cy: 0.08, scale: 0.14 },
        { cx: 0.72, cy: 0.06, scale: 0.15 },
        { cx: 0.35, cy: 0.28, scale: 0.2 },
        { cx: 0.65, cy: 0.26, scale: 0.19 },
        { cx: 0.5, cy: 0.48, scale: 0.22 },
        { cx: 0.32, cy: 0.65, scale: 0.17 },
        { cx: 0.68, cy: 0.62, scale: 0.18 },
        { cx: 0.25, cy: 0.88, scale: 0.16 },
        { cx: 0.75, cy: 0.85, scale: 0.17 },
        { cx: 0.48, cy: 0.22, scale: 0.18 },
        { cx: 0.52, cy: 0.72, scale: 0.16 },
        { cx: 0.18, cy: 0.5, scale: 0.19 },
        { cx: 0.82, cy: 0.48, scale: 0.18 }
    ];

    const strokesPerFlower = buildSunflowerStrokes(0.5, 0.5, 0.2).length;
    const timePerFlower = strokesPerFlower * 8 + 28;
    const staggerMs = Math.max(80, Math.floor(timePerFlower / 12));
    const allStrokes = [];
    sunflowers.forEach((s, flowerIndex) => {
        const strokes = buildSunflowerStrokes(s.cx, s.cy, s.scale);
        const startOffset = flowerIndex * staggerMs;
        strokes.forEach((st, idx) => {
            allStrokes.push({ ...st, startOffset, strokeIndexInFlower: idx });
        });
    });

    const strokeDuration = 28;
    const strokeDelay = 8;
    let startTime = null;

    function resize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time) {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        const scaleX = w;
        const scaleY = h;

        allStrokes.forEach((stroke) => {
            const strokeStart = stroke.startOffset + stroke.strokeIndexInFlower * strokeDelay;
            const progress = Math.min(1, (elapsed - strokeStart) / strokeDuration);
            if (progress <= 0) return;
            const eased = 1 - Math.pow(1 - progress, 1.8);

            const x1 = stroke.x1 * scaleX;
            const y1 = stroke.y1 * scaleY;
            const x2 = stroke.x2 * scaleX;
            const y2 = stroke.y2 * scaleY;
            const x = x1 + (x2 - x1) * eased;
            const y = y1 + (y2 - y1) * eased;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x, y);
            ctx.strokeStyle = stroke.color || '#e6b422';
            ctx.lineWidth = Math.max(1.2, (scaleX + scaleY) / 520);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = 0.92;
            ctx.stroke();
            ctx.globalAlpha = 1;
        });

        sunflowerAnimationId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    sunflowerAnimationId = requestAnimationFrame(draw);
}

function stopSunflowerBackground() {
    if (sunflowerAnimationId !== null) {
        cancelAnimationFrame(sunflowerAnimationId);
        sunflowerAnimationId = null;
    }
}

// --- Brillos / sparkles en la página inicial (más vivos) ---
function initSparkles() {
    const canvas = document.getElementById('sparkleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const count = 110;
    const sparkles = [];

    for (let i = 0; i < count; i++) {
        sparkles.push({
            x: Math.random(),
            y: Math.random(),
            phase: Math.random() * Math.PI * 2,
            phase2: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.6,
            sizeBase: 0.004 + Math.random() * 0.01,
            sizePulse: 0.25 + Math.random() * 0.35,
            driftX: (Math.random() - 0.5) * 0.0004,
            driftY: (Math.random() - 0.5) * 0.00035,
            burstPhase: Math.random() * Math.PI * 2,
            burstFreq: 0.00012 + Math.random() * 0.0002
        });
    }

    function resizeSparkle() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawSparkles(time) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.clearRect(0, 0, w, h);

        sparkles.forEach(s => {
            s.x += s.driftX;
            s.y += s.driftY;
            if (s.x < 0 || s.x > 1) s.driftX *= -1;
            if (s.y < 0 || s.y > 1) s.driftY *= -1;
            const twinkle = 0.5 + 0.5 * Math.sin(time * 0.00085 * s.speed + s.phase);
            const pulse = 0.7 + s.sizePulse * Math.sin(time * 0.0007 + s.phase2);
            const burst = 1 + 0.85 * Math.max(0, Math.sin(time * s.burstFreq + s.burstPhase));
            const brightness = Math.min(1, twinkle * pulse * burst);
            const size = s.sizeBase * (0.8 + 0.4 * Math.sin(time * 0.0005 + s.phase));
            const px = s.x * w;
            const py = s.y * h;
            const r = Math.max(1.5, (w + h) / 600 * size * 350);
            const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.2);
            grad.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.95})`);
            grad.addColorStop(0.25, `rgba(255, 230, 245, ${brightness * 0.6})`);
            grad.addColorStop(0.5, `rgba(255, 200, 220, ${brightness * 0.25})`);
            grad.addColorStop(1, 'rgba(255, 180, 200, 0)');
            ctx.beginPath();
            ctx.arc(px, py, r * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });

        sparkleAnimationId = requestAnimationFrame(drawSparkles);
    }

    resizeSparkle();
    window.addEventListener('resize', resizeSparkle);
    sparkleAnimationId = requestAnimationFrame(drawSparkles);
}

function stopSparkles() {
    if (sparkleAnimationId !== null) {
        cancelAnimationFrame(sparkleAnimationId);
        sparkleAnimationId = null;
    }
}

// Iniciar girasoles y brillos al cargar
function initPage() {
    initSunflowerBackground();
    initSparkles();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
