const socket = io();

/* 접속 시 실행 */
socket.on('connect', async function () {
  // 서버에서 userId와 roomId 가져오기
  const { userId, roomId } = await fetchUserInfo();

  // 서버에 방 입장 알리기
  socket.emit('joinRoom', { userId, roomId });
});

/* 서버로부터 데이터 받기 */
socket.on('update', function (data) {
  const chat = document.getElementById('chat');
  const message = document.createElement('div');
  const node = document.createTextNode(`${data.userId}: ${data.message}`);
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

/* 유저 정보 가져오는 함수 */
async function fetchUserInfo() {
  const response = await fetch('/api/getUserInfo'); // API에서 유저 정보 가져오기
  return await response.json(); // { userId, roomId }
}
