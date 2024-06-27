const canvas = document.getElementById('pizzaCanvas')
const ctx = canvas.getContext('2d')

let pineappleSlices = []

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  drawPizza()
  drawPineappleSlices()
}

function dropPineapple(x, y, isLocal = true) {
  const xPercent = x / canvas.width
  const yPercent = y / canvas.height
  pineappleSlices.push({ xPercent, yPercent })
  drawPineappleSlices()
  if (isLocal && typeof sendPineapplePosition === 'function') {
    sendPineapplePosition(xPercent, yPercent)
  }
}

function drawPineappleSlices() {
  pineappleSlices.forEach((slice) => {
    const x = slice.xPercent * canvas.width
    const y = slice.yPercent * canvas.height
    // Draw pineapple body
    ctx.beginPath()
    ctx.ellipse(x, y + 10, 15, 20, 0, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFF700'
    ctx.fill()
    ctx.strokeStyle = '#DAA520'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw pineapple pattern
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        ctx.beginPath()
        ctx.arc(x + i * 6, y + 10 + j * 8, 2, 0, 2 * Math.PI)
        ctx.fillStyle = '#DAA520'
        ctx.fill()
      }
    }

    // Draw pineapple crown
    ctx.beginPath()
    ctx.moveTo(x - 15, y)
    ctx.lineTo(x - 10, y - 15)
    ctx.lineTo(x - 5, y - 5)
    ctx.lineTo(x, y - 20)
    ctx.lineTo(x + 5, y - 5)
    ctx.lineTo(x + 10, y - 15)
    ctx.lineTo(x + 15, y)
    ctx.closePath()
    ctx.fillStyle = '#228B22'
    ctx.fill()
    ctx.strokeStyle = '#006400'
    ctx.lineWidth = 1
    ctx.stroke()
  })
}

function drawPizza() {
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(canvas.width, canvas.height) * 0.4
  const slices = 8
  const sliceAngle = (2 * Math.PI) / slices
  const gapAngle = 0.02 // Adjust this value to increase/decrease the gap between slices

  // Draw individual slices
  for (let i = 0; i < slices; i++) {
    const startAngle = i * sliceAngle + gapAngle / 2
    const endAngle = (i + 1) * sliceAngle - gapAngle / 2

    // Draw sauce (now the outermost layer)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = '#B22222'
    ctx.fill()

    // Draw cheese
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius * 0.95, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = '#FFA500'
    ctx.fill()

    // Draw slice outline
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#8B4513'
    ctx.stroke()
  }

  // Draw pineapple slices
  drawPineappleSlices()
}

window.addEventListener('resize', resizeCanvas)
resizeCanvas()

// Function to check if connection is open
function isConnected() {
  return conn && conn.open
}

// Add click event listener to canvas
document
  .getElementById('pizzaCanvas')
  .addEventListener('click', function (event) {
    if (isConnected()) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      dropPineapple(x, y, true)
    } else {
      console.log('Not connected. Cannot drop pineapple.')
    }
  })
