let peer;
let conn;

function setupPeerJS() {
    peer = new Peer();
    
    peer.on('open', (id) => {
        document.getElementById('status').textContent = `Your ID: ${id}`;
        document.getElementById('connectBtn').disabled = false;
    });

    peer.on('connection', (connection) => {
        conn = connection;
        setupConnection();
    });
}

function connect() {
    const peerId = document.getElementById('connectionBox').value;
    conn = peer.connect(peerId);
    setupConnection();
}

function setupConnection() {
    conn.on('open', () => {
        updateConnectionStatus('Connected!');
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('connectionBox').value = '';
    });

    conn.on('data', (data) => {
        dropPineapple(data.x, data.y, false);
    });

    conn.on('close', () => {
        updateConnectionStatus('Disconnected');
        document.getElementById('connectBtn').disabled = false;
    });
}

function updateConnectionStatus(status) {
    document.getElementById('status').textContent = status;
    if (status === 'Connected!') {
        document.getElementById('status').style.color = 'green';
    } else {
        document.getElementById('status').style.color = 'red';
    }
}

function sendPineapplePosition(x, y) {
    if (conn && conn.open) {
        conn.send({ x, y });
    }
}

document.getElementById('connectBtn').addEventListener('click', connect);
document.getElementById('connectionBox').addEventListener('input', function() {
    document.getElementById('connectBtn').disabled = this.value.length === 0;
});

setupPeerJS();
