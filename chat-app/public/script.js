document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const loginContainer = document.getElementById('loginContainer');
    const chatContainer = document.getElementById('chatContainer');
    const usernameInput = document.getElementById('usernameInput');
    const loginButton = document.getElementById('loginButton');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const recordAudioButton = document.getElementById('recordAudioButton');
    const chatMessages = document.querySelector('.chat-messages');
    const chatUsername = document.getElementById('chatUsername');
    const contactsList = document.getElementById('contactsList');
    const videoCallButton = document.getElementById('videoCallButton');
    const endCallButton = document.getElementById('endCallButton');
    const callArea = document.getElementById('callArea');
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');

    let username = '';
    let localStream;
    let peerConnection;
    let remoteStream;
    let mediaRecorder;
    let audioChunks = [];
    
    const configuration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    loginButton.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            socket.emit('set username', username);
            chatUsername.textContent = username;
            loginContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
        } else {
            console.log('Username is empty');
        }
    });

    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            socket.emit('chat message', { message: messageText, sender: username, timestamp });
            messageInput.value = '';
        }
    });

    recordAudioButton.addEventListener('click', async () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordAudioButton.innerHTML = '<i class="fas fa-microphone"></i>';
        } else {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        audioChunks = [];
                        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            socket.emit('audio message', { audio: reader.result, sender: username, timestamp });
                        };
                        reader.readAsDataURL(audioBlob);
                    };
                    mediaRecorder.start();
                    recordAudioButton.innerHTML = '<i class="fas fa-stop"></i>';
                } else {
                    console.error('getUserMedia is not supported in this browser.');
                }
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        }
    });

    socket.on('chat message', (data) => {
        const { message, sender, timestamp } = data;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (sender === username) {
            messageElement.classList.add('sent');
        } else {
            messageElement.classList.add('received');
        }
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="sender">${sender}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <p>${message}</p>
            <div class="message-footer">
                <span class="status-seen ${sender === username ? 'seen' : 'unseen'}"></span>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('audio message', (data) => {
        const { audio, sender, timestamp } = data;
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        if (sender === username) {
            messageElement.classList.add('sent');
        } else {
            messageElement.classList.add('received');
        }
        const audioElement = `<audio controls><source src="${audio}" type="audio/wav"></audio>`;
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="sender">${sender}</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            ${audioElement}
            <div class="message-footer">
                <span class="status-seen ${sender === username ? 'seen' : 'unseen'}"></span>
            </div>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('update users', (users) => {
        contactsList.innerHTML = '';
        users.forEach(user => {
            if (user !== username) {
                const contactElement = document.createElement('li');
                contactElement.classList.add('contact');
                contactElement.innerHTML = `
                    <img src="./images/perfill.jpg" alt="Avatar">
                    <div class="contact-info">
                        <h4>${user}</h4>
                        <p>Conectado...</p>
                    </div>
                    <span class="status online"></span>
                `;
                contactsList.appendChild(contactElement);
            }
        });
    });

    videoCallButton.addEventListener('click', async () => {
        callArea.style.display = 'flex';
        console.log('Call button clicked');
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideo.srcObject = localStream;
                console.log('Local stream obtained');
                
                peerConnection = new RTCPeerConnection(configuration);
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('Sending ICE candidate');
                        socket.emit('new-ice-candidate', event.candidate);
                    }
                };

                peerConnection.ontrack = (event) => {
                    remoteStream = event.streams[0];
                    remoteVideo.srcObject = remoteStream;
                    console.log('Remote stream received');
                };

                localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                console.log('Offer created and set as local description');
                socket.emit('offer', offer);
            } else {
                console.error('getUserMedia is not supported in this browser.');
            }
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    });

    endCallButton.addEventListener('click', () => {
        console.log('Ending call');
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        callArea.style.display = 'none';
        remoteVideo.srcObject = null;
        localVideo.srcObject = null;
    });

    socket.on('offer', async (offer) => {
        console.log('Offer received');
        if (!peerConnection) {
            peerConnection = new RTCPeerConnection(configuration);
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate');
                    socket.emit('new-ice-candidate', event.candidate);
                }
            };

            peerConnection.ontrack = (event) => {
                remoteStream = event.streams[0];
                remoteVideo.srcObject = remoteStream;
                console.log('Remote stream received');
            };

            if (localStream) {
                localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            }
        }

        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        console.log('Answer created and set as local description');
        socket.emit('answer', answer);
    });

    socket.on('answer', async (answer) => {
        console.log('Answer received');
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('new-ice-candidate', async (candidate) => {
        console.log('New ICE candidate received');
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error adding received ICE candidate', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        callArea.style.display = 'none';
        remoteVideo.srcObject = null;
        localVideo.srcObject = null;
    });
});
y