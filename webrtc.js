let peerConnection;
let dataChannel;
let isInitiator = false;

function setupWebRTC() {
    peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            if (isInitiator) {
                offerFullString += JSON.stringify(event.candidate) + '\n';
            } else {
                answerFullString += JSON.stringify(event.candidate) + '\n';
            }
        }
    };

    peerConnection.ondatachannel = event => {
        dataChannel = event.channel;
        setupDataChannel();
    };
}

function setupDataChannel() {
    dataChannel.onopen = () => {
        document.getElementById('status').textContent = 'Connected!';
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('joinBtn').disabled = true;
        document.getElementById('connectionBox').value = '';
    };
    dataChannel.onmessage = event => {
        const data = JSON.parse(event.data);
        dropPineapple(data.x, data.y, false);
    };
}

let offerFullString = '';
let answerFullString = '';

function connect() {
    isInitiator = true;
    setupWebRTC();
    dataChannel = peerConnection.createDataChannel("pizzaChannel");
    setupDataChannel();

    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            document.getElementById('status').textContent = 'Generating connection code...';
        });

    setTimeout(() => {
        const fullString = JSON.stringify(peerConnection.localDescription) + '\n' + offerFullString;
        document.getElementById('connectionBox').value = btoa(fullString);
        document.getElementById('status').textContent = 'Connection code generated. Send it to the other device.';
    }, 1000);
}

function join() {
    isInitiator = false;
    setupWebRTC();
    const fullString = atob(document.getElementById('connectionBox').value);
    const [descriptionString, ...iceCandidates] = fullString.split('\n');
    const offer = JSON.parse(descriptionString);

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => peerConnection.createAnswer())
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => {
            iceCandidates.forEach(candidate => {
                if (candidate) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
                }
            });
        })
        .then(() => {
            document.getElementById('status').textContent = 'Joining...';
        });

    setTimeout(() => {
        const fullAnswerString = JSON.stringify(peerConnection.localDescription) + '\n' + answerFullString;
        document.getElementById('connectionBox').value = btoa(fullAnswerString);
        document.getElementById('status').textContent = 'Answer generated. Send it back to the first device.';
    }, 1000);
}

function sendPineapplePosition(x, y) {
    if (dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(JSON.stringify({ x, y }));
    }
}

document.getElementById('connectBtn').addEventListener('click', connect);
document.getElementById('joinBtn').addEventListener('click', join);
document.getElementById('connectionBox').addEventListener('input', function() {
    document.getElementById('joinBtn').disabled = this.value.length === 0;
});
