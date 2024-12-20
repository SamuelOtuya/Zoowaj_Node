import io from 'socket.io-client';

const url1 = 'http://127.0.0.1:8000';
const url2 = 'https://capital-obviously-terrier.ngrok-free.app';

const socket = io(url2, {
  //   transports: ['websocket'],
  query: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY0ODE1ZDYyZmM2ODAxMjUzNjYyOGMiLCJlbWFpbCI6ImFsaUBhbGkuY29tIiwiaWF0IjoxNzM0NjcxMTYwLCJleHAiOjE3MzQ3NTc1NjB9.usA_nTduAINULqjG4FTGmH-GQyz6QisEL6VXVqLrqYo',
  },
});

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('load chat', (data) => {
  console.log('Chat data received:', data);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
