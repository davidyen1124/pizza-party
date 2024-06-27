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
  pineappleSlices.push({ x, y })
  drawPineappleSlices()
  if (isLocal && typeof sendPineapplePosition === 'function') {
    sendPineapplePosition(x, y)
  }
}

function drawPineappleSlices() {
  pineappleSlices.forEach((slice) => {
    // Draw pineapple body
    ctx.beginPath()
    ctx.ellipse(slice.x, slice.y + 10, 15, 20, 0, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFF700'
    ctx.fill()
    ctx.strokeStyle = '#DAA520'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw pineapple pattern
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        ctx.beginPath()
        ctx.arc(slice.x + i * 6, slice.y + 10 + j * 8, 2, 0, 2 * Math.PI)
        ctx.fillStyle = '#DAA520'
        ctx.fill()
      }
    }

    // Draw pineapple crown
    ctx.beginPath()
    ctx.moveTo(slice.x - 15, slice.y)
    ctx.lineTo(slice.x - 10, slice.y - 15)
    ctx.lineTo(slice.x - 5, slice.y - 5)
    ctx.lineTo(slice.x, slice.y - 20)
    ctx.lineTo(slice.x + 5, slice.y - 5)
    ctx.lineTo(slice.x + 10, slice.y - 15)
    ctx.lineTo(slice.x + 15, slice.y)
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
  return conn && conn.open;
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
      showNotification('Not connected. Cannot drop pineapple.')
    }
  })

function showNotification(message) {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.style.position = 'fixed'
  notification.style.top = '20px'
  notification.style.left = '50%'
  notification.style.transform = 'translateX(-50%)'
  notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'
  notification.style.color = 'white'
  notification.style.padding = '10px'
  notification.style.borderRadius = '5px'
  notification.style.zIndex = '1000'
  document.body.appendChild(notification)
  
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}
