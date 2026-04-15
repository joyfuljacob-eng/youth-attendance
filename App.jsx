import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('attendance'); // 현재 화면 상태

  // 1. 출석 체크 화면 (예배 & 샘 모임)
  const AttendanceView = () => (
    <div style={styles.card}>
      <h3>📅 주일 출석 체크</h3>
      <input type="text" placeholder="이름 검색" style={styles.input} />
      <div style={styles.buttonGroup}>
        <button style={styles.primaryBtn}>예배 참석</button>
        <button style={styles.secondaryBtn}>샘 모임 참석</button>
      </div>
      <p style={styles.infoText}>* 오늘 날짜로 자동 기록됩니다.</p>
    </div>
  );

  // 2. 청년 명단 및 새가족 관리 화면
  const MemberView = () => (
    <div style={styles.card}>
      <h3>👤 청년 명단 등록</h3>
      <input type="text" placeholder="이름" style={styles.input} />
      <select style={styles.input}>
        <option>성별 선택</option>
        <option>남</option>
        <option>여</option>
      </select>
      <input type="tel" placeholder="전화번호" style={styles.input} />
      <input type="date" placeholder="생일" style={styles.input} />
      <input type="text" placeholder="소속 샘(조)" style={styles.input} />
      <label style={{display:'block', margin:'10px 0'}}>
        <input type="checkbox" /> 새가족 (4주 교육 대상)
      </label>
      <button style={styles.saveBtn}>명단에 추가하기</button>
    </div>
  );

  // 3. 알림 센터 (생일 & 장기결석)
  const AlertView = () => (
    <div style={styles.card}>
      <h3>🔔 주요 알림</h3>
      <div style={styles.alertBox}>🎂 <b>오늘 생일:</b> 김철수, 이영희</div>
      <div style={styles.alertBox}>🗓️ <b>이번달 생일:</b> 박민수 외 3명</div>
      <div style={{...styles.alertBox, backgroundColor:'#fff3f3'}}>
        ⚠️ <b>장기 결석(4주+):</b> 홍길동 (연락 필요)
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>📱 청년부 스마트 출석부</h2>
      </header>

      {/* 상단 탭 메뉴 */}
      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('attendance')} style={activeTab === 'attendance' ? styles.activeTab : styles.tab}>출석체크</button>
        <button onClick={() => setActiveTab('members')} style={activeTab === 'members' ? styles.activeTab : styles.tab}>명단관리</button>
        <button onClick={() => setActiveTab('alerts')} style={activeTab === 'alerts' ? styles.activeTab : styles.tab}>알림함</button>
      </nav>

      {/* 탭에 따른 화면 전환 */}
      <main style={styles.main}>
        {activeTab === 'attendance' && <AttendanceView />}
        {activeTab === 'members' && <MemberView />}
        {activeTab === 'alerts' && <AlertView />}
      </main>
    </div>
  );
}

// 디자인 스타일 정의
const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' },
  header: { backgroundColor: '#007bff', color: 'white', padding: '15px', textAlign: 'center' },
  nav: { display: 'flex', backgroundColor: 'white', borderBottom: '1px solid #ddd' },
  tab: { flex: 1, padding: '15px', border: 'none', background: 'none', cursor: 'pointer' },
  activeTab: { flex: 1, padding: '15px', border: 'none', borderBottom: '3px solid #007bff', color: '#007bff', fontWeight: 'bold' },
  main: { padding: '20px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  primaryBtn: { flex: 1, padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' },
  secondaryBtn: { flex: 1, padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' },
  saveBtn: { width: '100%', padding: '15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' },
  alertBox: { padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '10px' },
  infoText: { fontSize: '12px', color: '#888', marginTop: '10px' }
};

export default App;