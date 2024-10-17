var socket = io();
let roomId, userId;

socket.on('connect', function() {
  // URL에서 roomId와 userId 추출
  const urlParams = window.location.pathname.split('/');
  roomId = urlParams[2];  // URL 경로에서 roomId 추출
  userId = urlParams[3];  // URL 경로에서 userId 추출

  if (!userId || !roomId) {
    alert('유효한 방 ID와 사용자 ID가 필요합니다.');
    return;
  }

  console.log('연결된 roomId:', roomId);  
  console.log('연결된 userId:', userId);  
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
  console.log('메시지 전송:', { roomId, userId, message }); 
  document.getElementById('test').value = ''; // 입력창 초기화
}
