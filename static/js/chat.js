var socket = io();
let roomId, userId;

// 접속되었을 때 실행
socket.on('connect', function() {
  userId = prompt('이름을 입력해주세요.', '');
  roomId = prompt('입장할 방 ID를 입력하세요.', '');

  if (!userId || !roomId) {
    alert('이름과 방 ID는 필수입니다.');
    return;
  }

  // 방에 참여
  socket.emit('joinRoom', { roomId, userId });
});

// 서버로부터 데이터 수신
socket.on('update', function(data) {
  const chat = document.getElementById('chat');
  const message = document.createElement('div');
  const node = document.createTextNode(`${data.name}: ${data.message}`);
  message.appendChild(node);
  chat.appendChild(message);
});

// 메시지 전송 함수
function sendMessage() {
  const message = document.getElementById('test').value;

  if (!message) {
    alert('메시지를 입력하세요.');
    return;
  }

  // 서버로 메시지 전달
  socket.emit('message', { roomId, userId, message });
  document.getElementById('test').value = ''; // 입력창 초기화
}
