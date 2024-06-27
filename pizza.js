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
    const slices = 8;
    const sliceAngle = (2 * Math.PI) / slices;
    const gapAngle = 0.02; // Adjust this value to increase/decrease the gap between slices

    // Draw individual slices
    for (let i = 0; i < slices; i++) {
        const startAngle = i * sliceAngle + gapAngle / 2;
        const endAngle = (i + 1) * sliceAngle - gapAngle / 2;

        // Draw sauce (now the outermost layer)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = '#B22222';
        ctx.fill();

        // Draw cheese
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius * 0.95, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = '#FFA500';
        ctx.fill();

        // Draw slice outline
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#8B4513';
        ctx.stroke();
    }

}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
