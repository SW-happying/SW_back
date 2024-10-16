var socket = io();

/* 접속 되었을 때 실행 */
socket.on('connect', function() {
  var name = prompt('이름을 입력해주세요.', '');
  var roomId = prompt('입장할 방 ID를 입력하세요.', '');

  if (!name || !roomId) {
    alert('이름과 방 ID는 필수입니다.');
    return;
  }

  // 서버에 새로운 유저가 방에 참여했다고 알림
  socket.emit('joinRoom', { roomId, userId: name });
});

/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
  var chat = document.getElementById('chat');
  var message = document.createElement('div');
  var node = document.createTextNode(`${data.name}: ${data.message}`);
  message.appendChild(node);
  chat.appendChild(message);
});

/* 메시지 전송 함수 */
function send() {
  var message = document.getElementById('test').value;
  var roomId = prompt('메시지를 보낼 방 ID를 입력하세요.', '');

  if (!message || !roomId) {
    alert('메시지와 방 ID는 필수입니다.');
    return;
  }

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', { roomId, userId: socket.name, message });
}
