var socket = io();
let roomId, userId;

socket.on('connect', function() {
  // roomId will now be fetched from the URL
  const urlParams = new URLSearchParams(window.location.search);
  roomId = urlParams.get('roomId');
  userId = prompt('이름을 입력해주세요.', '');

  if (!userId || !roomId) {
    alert('이름과 방 ID는 필수입니다.');
    return;
  }

  socket.emit('joinRoom', { roomId, userId });
});

socket.on('loadMessages', function(messages) {
  const chat = document.getElementById('chat');
  chat.innerHTML = ''; 

  messages.forEach((msg) => {
    const message = document.createElement('div');
    const node = document.createTextNode(`${msg.userId}: ${msg.message}`);
    message.appendChild(node);
    chat.appendChild(message);
  });
});

socket.on('update', function(data) {
  const chat = document.getElementById('chat');
  const message = document.createElement('div');
  const node = document.createTextNode(`${data.name}: ${data.message}`);
  message.appendChild(node);
  chat.appendChild(message);
});

function sendMessage() {
  const message = document.getElementById('test').value;

  if (!message) {
    alert('메시지를 입력하세요.');
    return;
  }

  socket.emit('message', { roomId, userId, message });
  document.getElementById('test').value = ''; // 입력창 초기화
}
