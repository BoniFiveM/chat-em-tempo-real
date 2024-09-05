const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = new Set(); // Track online users

app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

// Quando um usuário se conecta
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new user joining
    socket.on('set username', (username) => {
        socket.username = username;
        users.add(username); // Adiciona o novo usuário ao conjunto
        io.emit('update users', Array.from(users)); // Atualiza a lista de usuários para todos
        socket.broadcast.emit('chat message', {
            message: `${username} has joined the chat`,
            sender: 'System',
            timestamp: new Date().toLocaleTimeString()
        });
    });

    // Handle chat messages
    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    // Handle delete message
    socket.on('delete message', (messageId) => {
        io.emit('delete message', messageId);
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        if (socket.username) {
            users.delete(socket.username); // Remove o usuário do conjunto
            io.emit('update users', Array.from(users)); // Atualiza a lista de usuários para todos
            io.emit('chat message', {
                message: `${socket.username} has left the chat`,
                sender: 'System',
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
