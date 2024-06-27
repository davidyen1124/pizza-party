let connection = new RTCPeerConnection();
let dataChannel;

function setupWebRTC() {
    dataChannel = connection.createDataChannel("pizzaChannel");
    dataChannel.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dropPineapple(data.x, data.y, false);
    };

    connection.onicecandidate = (event) => {
        if (event.candidate) {
            // Send the candidate to the other peer
            // In a real app, you'd send this over your signaling server
            console.log("New ICE candidate:", event.candidate);
        }
    };

    connection.createOffer().then(offer => {
        return connection.setLocalDescription(offer);
    }).then(() => {
        // Send the offer to the other peer
        // In a real app, you'd send this over your signaling server
        console.log("Offer:", connection.localDescription);
    });
}

function sendPineapplePosition(x, y) {
    if (dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(JSON.stringify({ x, y }));
    }
}

// In a real application, you'd need to implement the following:
// 1. A signaling mechanism to exchange offers, answers, and ICE candidates
// 2. A way to create an answer when receiving an offer
// 3. A way to add ICE candidates when receiving them from the other peer
