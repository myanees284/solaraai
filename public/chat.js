const socket = io();
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const typingIndicator = document.getElementById('typing-indicator');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage(msg, 'user');
  input.value = '';
  showTyping(true);
  socket.emit('user-message', msg);
});

socket.on('bot-message', (msg) => {
  showTyping(false);
  appendTypingMessage(msg);
});

function appendMessage(msg, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = type === 'user'
    ? 'https://i.pravatar.cc/30?img=3'
    : 'https://cdn-icons-png.flaticon.com/512/4712/4712106.png';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = msg;

  if (type === 'user') {
    div.appendChild(bubble);
    div.appendChild(avatar);
  } else {
    div.appendChild(avatar);
    div.appendChild(bubble);
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTypingMessage(text) {
  const div = document.createElement('div');
  div.className = `message bot`;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = 'https://cdn-icons-png.flaticon.com/512/4712/4712106.png';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  div.appendChild(avatar);
  div.appendChild(bubble);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  let i = 0;
  const speed = 20;

  function typeChar() {
    if (i < text.length) {
      bubble.textContent += text.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typeChar, speed);
    }
  }

  typeChar();
}

function showTyping(show = true) {
  typingIndicator.style.display = show ? 'block' : 'none';
}

themeToggle.addEventListener('change', () => {
  const isDark = document.body.classList.toggle('dark');
  themeIcon.textContent = isDark ? '🌙' : '🌞';
});

themeIcon.addEventListener('click', () => {
  themeToggle.checked = !themeToggle.checked;
  themeToggle.dispatchEvent(new Event('change'));
});
