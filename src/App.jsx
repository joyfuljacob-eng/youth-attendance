import React, { useState } from 'react';

function App() {
  // 1. 모든 입력 항목을 저장할 상자(State) 만들기
  const [name, setName] = useState('');
  const [gender, setGender] = useState('남');
  const [worship, setWorship] = useState('참석');
  const [cell, setCell] = useState('참석');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 2. 보낼 데이터 뭉치 만들기
    const attendanceData = {
      date: new Date().toLocaleDateString('ko-KR'),
      name,
      gender,
      worship,
      cell,
      phone,
      birthday,
      note
    };

    try {
      // 3. 실제 Vercel API로 전송하기 (이 부분이 마법의 연결고리입니다)
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        alert(`${name}님의 정보가 성공적으로 기록되었습니다!`);
        // 입력 칸 초기화 (선택 사항)
        setName('');
        setPhone('');
        setNote('');
      } else {
        throw new Error("서버 전송 실패");
      }
    } catch (error) {
      alert("전송 중 오류 발생: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center' }}>청년부 출석 체크</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <label>이름: <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
        
        <label>성별: 
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </label>

        <label>예배참여: 
          <select value={worship} onChange={(e) => setWorship(e.target.value)}>
            <option value="참석">참석</option>
            <option value="결석">결석</option>
          </select>
        </label>

        <label>샘참여: 
          <select value={cell} onChange={(e) => setCell(e.target.value)}>
            <option value="참석">참석</option>
            <option value="불참">불참</option>
          </select>
        </label>

        <label>폰번호: <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" /></label>
        
        <label>생일: <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} /></label>
        
        <label>비고: <br/>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows="3" />
        </label>

        <button type="submit" style={{ 
          padding: '15px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          기록하기
        </button>
      </form>
    </div>
  );
}

export default App;