const canvas = document.getElementById('pizzaCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPizza();
}

function drawPizza() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    // Draw crust
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#D2691E';
    ctx.fill();

    // Draw sauce
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI);
    ctx.fillStyle = '#B22222';
    ctx.fill();

    // Draw cheese
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.85, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFA500';
    ctx.fill();

    // Draw crust edge
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = radius * 0.1;
    ctx.strokeStyle = '#8B4513';
    ctx.stroke();

    // Draw pizza slices
    const slices = 8;
    ctx.beginPath();
    for (let i = 0; i < slices; i++) {
        const angle = (i / slices) * 2 * Math.PI;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#8B4513';
    ctx.stroke();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
