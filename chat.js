import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { Link, useParams } from "react-router-dom"; // useParams 추가

const socket = io('http://localhost:3000');

export default function Chat() {
  const { roomId } = useParams(); // roomId 가져오기
  const [messages, setMessages] = useState([
    { text: '거래가 시작됩니다.', sender: 'system' },
    { text: '9월 29일 시작 6개월 75,000원 결제 요청', sender: 'system' },
    { text: '결제하기 클릭', sender: 'system', type: 'button' },
  ]);
  const [message, setMessage] = useState('');

  // 소켓 연결 및 메시지 수신 처리
  useEffect(() => {
    socket.emit('joinRoom', roomId); // 방에 입장하는 이벤트 전송

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { text: msg, sender: 'system' }]);
    });

    return () => {
      socket.off('chat message');
      socket.emit('leaveRoom', { roomId }); // 방을 나갈 때 이벤트 전송
    };
  }, [roomId]);

  // 결제하기 버튼 클릭 시
  const handlePayment = () => {
    socket.emit('payment', roomId); // roomId와 함께 결제 이벤트 전송
  };

  // 메시지 전송
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { text: message, roomId }); // 메시지와 roomId 전송
      setMessages([...messages, { text: message, sender: 'me' }]);
      setMessage(''); // 입력 필드 초기화
    }
  };

  return (
    <div className="chat-container">
      <div className="ctitle">
        <Link to="/ottPost">
          <img className="cback" width="20" height="20" src="./image/back.png" />
        </Link>
        <span>채팅</span>
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.sender === 'me' ? 'my-message' : 'system-message'}`}
          >
            {msg.text}
            {msg.type === 'button' && (
              <button className="payment-button" onClick={handlePayment}>
                결제하기
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="message-input"
        />
        <button type="submit" className="send-button">전송</button>
      </form>
    </div>
  );
}
