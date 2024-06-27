let peerConnection;
let dataChannel;

function setupWebRTC() {
    peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log("New ICE candidate:", JSON.stringify(event.candidate));
        }
    };

    dataChannel = peerConnection.createDataChannel("pizzaChannel");
    dataChannel.onmessage = event => {
        const data = JSON.parse(event.data);
        dropPineapple(data.x, data.y, false);
    };

    peerConnection.ondatachannel = event => {
        dataChannel = event.channel;
        dataChannel.onmessage = event => {
            const data = JSON.parse(event.data);
            dropPineapple(data.x, data.y, false);
        };
    };
}

function createOffer() {
    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            console.log("Offer:", JSON.stringify(peerConnection.localDescription));
        });
}

function handleAnswer(answerString) {
    const answer = JSON.parse(answerString);
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleCandidate(candidateString) {
    const candidate = JSON.parse(candidateString);
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function sendPineapplePosition(x, y) {
    if (dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(JSON.stringify({ x, y }));
    }
}
