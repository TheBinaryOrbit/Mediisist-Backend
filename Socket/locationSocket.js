import { Server } from 'socket.io';


const user = {};

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('join', (data) => {
            const { sessionKey } = data;
            user[sessionKey] = socket.id;
            console.log(`User With ${sessionKey} joined with socket ID: ${socket.id}`);
        });


        socket.on('shareLocation', (data) => {
            const { sessionKey, lat , lng } = data;
            
            if (user[sessionKey]) {
                io.to(user[sessionKey]).emit('locationUpdate', { lat, lng });
                console.log(`Location shared with user ${sessionKey}:`, { lat, lng });
            } else {
                console.log(`User with session key ${sessionKey} not found`);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}