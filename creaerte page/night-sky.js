(() => {
// Natural Night Sky
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function initStars() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const count = isMobile ? 78 : 196;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    stars = [];
    for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const spark = roll < 0.1;
        const strong = !spark && roll < 0.22;
        const bright = !spark && !strong && roll < 0.48;
        const medium = !spark && !strong && !bright && roll < 0.78;
        const tier = spark ? 'spark' : strong ? 'strong' : bright ? 'bright' : medium ? 'medium' : 'faint';
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.26,
            tier,
            r: spark
                ? (0.84 + Math.random() * 0.44)
                : strong
                    ? (0.66 + Math.random() * 0.34)
                    : bright
                        ? (0.42 + Math.random() * 0.26)
                        : medium
                            ? (0.18 + Math.random() * 0.12)
                            : (0.05 + Math.random() * 0.08),
            opacity: spark
                ? (0.58 + Math.random() * 0.16)
                : strong
                    ? (0.66 + Math.random() * 0.16)
                    : bright
                        ? (0.48 + Math.random() * 0.16)
                        : medium
                            ? (0.28 + Math.random() * 0.14)
                            : (0.1 + Math.random() * 0.1),
            maxOpacity: spark
                ? (0.96 + Math.random() * 0.03)
                : strong
                    ? (0.98 + Math.random() * 0.02)
                    : bright
                        ? (0.92 + Math.random() * 0.05)
                        : medium
                            ? (0.76 + Math.random() * 0.08)
                            : (0.4 + Math.random() * 0.14),
            speed: spark
                ? (0.002 + Math.random() * 0.003)
                : strong
                    ? (0.0012 + Math.random() * 0.002)
                    : bright
                        ? (0.0009 + Math.random() * 0.0016)
                        : medium
                            ? (0.0006 + Math.random() * 0.0012)
                            : (0.00035 + Math.random() * 0.0008),
            increasing: Math.random() > 0.5,
            warm: spark ? Math.random() < 0.6 : strong ? Math.random() < 0.55 : bright ? Math.random() < 0.45 : Math.random() < 0.3,
            glowFactor: spark ? 1.8 : strong ? 1.35 : bright ? 1.05 : medium ? 0.7 : 0.45,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: spark
                ? (0.08 + Math.random() * 0.06)
                : strong
                    ? (0.03 + Math.random() * 0.02)
                    : bright
                        ? (0.018 + Math.random() * 0.018)
                        : medium
                            ? (0.01 + Math.random() * 0.01)
                            : (0.004 + Math.random() * 0.006),
            pulseAmp: spark
                ? (0.34 + Math.random() * 0.18)
                : strong
                    ? (0.12 + Math.random() * 0.1)
                    : bright
                        ? (0.06 + Math.random() * 0.08)
                        : medium
                            ? (0.02 + Math.random() * 0.04)
                            : (0.008 + Math.random() * 0.015)
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
        s.pulsePhase += s.pulseSpeed;

        if (s.increasing) {
            s.opacity += s.speed;
            if (s.opacity >= s.maxOpacity) s.increasing = false;
        } else {
            s.opacity -= s.speed;
            if (s.opacity <= 0.08) s.increasing = true;
        }

        const pulse = (Math.sin(s.pulsePhase) + 1) * 0.5;
        const flicker = s.tier === 'spark'
            ? Math.pow((Math.sin(s.pulsePhase * 2.2) + 1) * 0.5, 2) * 0.28
            : s.tier === 'strong'
                ? Math.pow((Math.sin(s.pulsePhase * 1.6) + 1) * 0.5, 2) * 0.12
                : 0;
        const alpha = Math.min(1, s.opacity + (s.pulseAmp * pulse) + flicker);
        const color = s.warm
            ? `rgba(255, 240, 210, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Glow for all stars
        if (s.r > 0.16) {
            const glowR = s.tier === 'spark'
                ? s.r * 2.8
                : s.tier === 'strong'
                    ? s.r * 2.2
                    : s.r > 1.1
                        ? s.r * 2.3
                        : s.r * 1.35;
            ctx.beginPath();
            ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
            const grd = ctx.createRadialGradient(s.x, s.y, s.r * 0.3, s.x, s.y, glowR);
            const glowAlpha = alpha * (s.tier === 'spark' ? 0.2 : s.tier === 'strong' ? 0.14 : s.r > 1.1 ? 0.12 : 0.045) * (s.glowFactor || 1);
            grd.addColorStop(0, s.warm ? `rgba(255,240,210,${glowAlpha})` : `rgba(255,255,255,${glowAlpha})`);
            grd.addColorStop(0.4, s.warm ? `rgba(255,240,210,${glowAlpha * 0.4})` : `rgba(255,255,255,${glowAlpha * 0.4})`);
            grd.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grd;
            ctx.fill();
        }
    }
    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', initStars);
initStars();
drawStars();


})();
