import React, { useState } from 'react';

function App() {
  // 이전처럼 심플하게 이름만 입력받습니다.
  const [name, setName] = useState('');
  const [status, setStatus] = useState('출석');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 화면에는 안 보이지만, 시트의 다른 칸들을 채워줄 '기본값'들입니다.
    const attendanceData = {
      date: new Date().toLocaleDateString('ko-KR'),
      name: name,
      gender: "-",      // 기본값 설정
      worship: status,  // 선택한 상태(출석/지각 등)가 들어감
      cell: "-",        // 기본값 설정
      phone: "-",       // 기본값 설정
      birthday: "-",    // 기본값 설정
      note: ""          // 기본값 설정
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        alert(`${name}님의 기록이 시트에 저장되었습니다!`);
        setName(''); // 입력창 비우기
      } else {
        throw new Error("전송 실패");
      }
    } catch (error) {
      alert("오류 발생: " + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#333' }}>청년부 출석 체크</h1>
      <p style={{ color: '#666' }}>이름을 입력하고 버튼을 눌러주세요.</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <input 
          type="text" 
          placeholder="이름을 입력하세요" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ 
            padding: '12px', 
            width: '200px', 
            borderRadius: '5px', 
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
        <br /><br />
        
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: '10px', width: '225px', borderRadius: '5px', fontSize: '16px' }}
        >
          <option value="출석">출석</option>
          <option value="지각">지각</option>
          <option value="결석">결석</option>
        </select>
        <br /><br />
        
        <button type="submit" style={{ 
          padding: '12px 30px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          fontSize: '16px',
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