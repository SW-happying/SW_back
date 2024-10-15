const socket = io();

/* 접속 시 실행 */
socket.on('connect', function() {
  // 이름 입력받기
  let name = prompt('반갑습니다!', '');
  if (!name) {
    name = '익명';
  }

  // 서버에 새로운 유저가 방에 입장했다고 알리기
  socket.emit('joinRoom', { name, roomId });
});

/* 서버로부터 데이터 받기 */
socket.on('update', function(data) {
  const chat = document.getElementById('chat');
  const message = document.createElement('div');
  const node = document.createTextNode(`${data.name}: ${data.message}`);
  let className = '';

  switch (data.type) {
    case 'message':
      className = 'other';
      break;
    case 'connect':
      className = 'connect';
      break;
    case 'disconnect':
      className = 'disconnect';
      break;
  }

  message.classList.add(className);
  message.appendChild(node);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight; // 스크롤을 자동으로 아래로
});

/* 메시지 전송 함수 */
function send() {
  const message = document.getElementById('messageInput').value;
  document.getElementById('messageInput').value = '';

  const chat = document.getElementById('chat');
  const msg = document.createElement('div');
  const node = document.createTextNode(message);
  msg.classList.add('me');
  msg.appendChild(node);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  // 서버로 메시지 전송
  socket.emit('message', { type: 'message', message });
}
