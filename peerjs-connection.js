let peer
let conn

function setupPeerJS() {
  peer = new Peer()

  peer.on('open', (id) => {
    const statusElement = document.getElementById('status');
    statusElement.textContent = id
    document.getElementById('connectBtn').disabled = false
    
    statusElement.style.cursor = 'pointer';
    statusElement.title = 'Click to copy ID';
    statusElement.addEventListener('click', copyPeerIdToClipboard);
  })

  peer.on('connection', (connection) => {
    conn = connection
    setupConnection()
  })
}

function copyPeerIdToClipboard() {
  const peerId = document.getElementById('status').textContent;
  navigator.clipboard.writeText(peerId).then(() => {
    alert('Peer ID copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

function connect() {
  const peerId = document.getElementById('connectionBox').value
  conn = peer.connect(peerId)
  setupConnection()
}

function setupConnection() {
  conn.on('open', () => {
    updateConnectionStatus('Connected!')
    document.getElementById('connectBtn').disabled = true
    document.getElementById('connectionBox').value = ''
  })

  conn.on('data', (data) => {
    receivePineapple(data.xPercent, data.yPercent)
  })

  conn.on('close', () => {
    updateConnectionStatus('Disconnected')
    document.getElementById('connectBtn').disabled = false
  })
}

function updateConnectionStatus(status) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = status
  if (status === 'Connected!') {
    statusElement.style.color = 'green'
    statusElement.style.cursor = 'default';
    statusElement.title = '';
    statusElement.removeEventListener('click', copyPeerIdToClipboard);
  } else {
    statusElement.style.color = 'red'
  }
}

function sendPineapplePosition(xPercent, yPercent) {
  if (conn && conn.open) {
    conn.send({ xPercent, yPercent })
  }
}

document.getElementById('connectBtn').addEventListener('click', connect)
document.getElementById('connectionBox').addEventListener('input', function () {
  document.getElementById('connectBtn').disabled = this.value.length === 0
})

setupPeerJS()
