require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  socket.on('user-message', async (msg) => {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: msg }] }],
        }
      );
      const botReply = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand that.';
      socket.emit('bot-message', botReply);
    } catch (err) {
      socket.emit('bot-message', 'Something went wrong.');
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`SolaraAI running on http://localhost:${PORT}`));
