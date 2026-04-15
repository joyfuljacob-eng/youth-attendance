import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // 입력 폼을 위한 상태값들
  const [formData, setFormData] = useState({
    name: '',
    gender: '남',
    worship: '참석',
    cell: '참석',
    phone: '',
    birthday: '',
    note: ''
  });

  const icons = {
    cross: '✛', calendar: '🗓️', people: '👥', list: '📋', addUser: '👤₊', bell: '🔔'
  };

  // 입력값 변경 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 서버(구글 시트)로 데이터 전송하는 함수
  const handleSubmit = async (type) => {
    if (!formData.name) return alert("이름을 입력해주세요.");

    const attendanceData = {
      ...formData,
      date: new Date().toLocaleDateString('ko-KR'),
      // 메뉴 타입에 따라 참여 여부 강제 설정 가능
      worship: type === 'worship' ? '참석' : formData.worship,
      cell: type === 'cell' ? '참석' : formData.cell
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });

      if (response.ok) {
        alert(`${formData.name}님의 정보가 성공적으로 기록되었습니다!`);
        setFormData({ name: '', gender: '남', worship: '참석', cell: '참석', phone: '', birthday: '', note: '' });
      } else {
        throw new Error("전송 실패");
      }
    } catch (error) {
      alert("오류 발생: " + error.message);
    }
  };

  // --- 1. 홈 대시보드 ---
  const HomeDashboard = () => (
    <div style={styles.content}>
      <div style={styles.statsGrid}>
        {[{ color: '#007bff', label: '전체 청년', value: 0 }, { color: '#28a745', label: '오늘 출석', value: 0 }, { color: '#ffc107', label: '샘 그룹 수', value: 0 }, { color: '#a033ff', label: '새가족', value: 0 }].map((stat, idx) => (
          <div key={idx} style={styles.statCard}>
            <div style={{...styles.statValue, color: stat.color}}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={styles.actionGrid}>
        {[
          { key: 'worship', icon: icons.calendar, label: '예배 출석 체크' },
          { key: 'cell', icon: icons.people, label: '샘 출석 체크' },
          { key: 'members', icon: icons.list, label: '청년 명단' },
          { key: 'newcomers', icon: icons.addUser, label: '새가족 관리' },
          { key: 'notifications', icon: icons.bell, label: '알림 센터' }
        ].map((action, idx) => (
          <div key={idx} style={styles.actionCard} onClick={() => setActiveTab(action.key)}>
            <div style={styles.actionIcon}>{action.icon}</div>
            <div style={styles.actionLabel}>{action.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTitle}>학익교회 청년부 예배현황</div>
        <div style={styles.headerSub}>오늘도 주님과 동행하세요 🙏</div>
      </header>

      <div style={styles.blueCardWrapper}>
        <div style={styles.blueCard}>
          <div style={styles.blueCardMain}>
            <div style={styles.blueCardTitle}>청년부 예배 현황</div>
            <div style={styles.blueCardDate}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</div>
          </div>
          <div style={styles.blueCardIcon}><div style={styles.crossIconBg}>{icons.cross}</div></div>
        </div>
      </div>

      <main style={styles.main}>
        {activeTab === 'home' && <HomeDashboard />}
        
        {/* 예배 출석 체크 화면 */}
        {activeTab === 'worship' && (
          <div style={styles.card}>
            <h3>🗓️ 예배 출석 체크</h3>
            <input name="name" style={styles.input} placeholder="이름" value={formData.name} onChange={handleChange} />
            <button style={styles.primaryBtn} onClick={() => handleSubmit('worship')}>예배 참석 기록</button>
          </div>
        )}

        {/* 샘 출석 체크 화면 */}
        {activeTab === 'cell' && (
          <div style={styles.card}>
            <h3>👥 샘 출석 체크</h3>
            <input name="name" style={styles.input} placeholder="이름" value={formData.name} onChange={handleChange} />
            <button style={{...styles.primaryBtn, backgroundColor: '#28a745'}} onClick={() => handleSubmit('cell')}>샘 모임 참석 기록</button>
          </div>
        )}

        {/* 청년 명단 등록 화면 */}
        {activeTab === 'members' && (
          <div style={styles.card}>
            <h3>👤 청년 명단 등록</h3>
            <input name="name" style={styles.input} placeholder="이름" value={formData.name} onChange={handleChange} />
            <select name="gender" style={styles.input} value={formData.gender} onChange={handleChange}>
              <option value="남">남</option><option value="여">여</option>
            </select>
            <input name="phone" style={styles.input} placeholder="폰번호 (010-0000-0000)" value={formData.phone} onChange={handleChange} />
            <input name="birthday" type="date" style={styles.input} value={formData.birthday} onChange={handleChange} />
            <button style={{...styles.primaryBtn, backgroundColor: '#333'}} onClick={() => handleSubmit('member')}>명단에 추가</button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={styles.card}>
            <h3>🔔 알림 센터</h3>
            <div style={styles.alertBox}>🎂 <b>오늘 생일:</b> 김철수 청년</div>
          </div>
        )}
      </main>

      <nav style={styles.bottomNav}>
        {[
          { key: 'home', icon: '🏠', label: '홈' },
          { key: 'members', icon: '👤', label: '명단' },
          { key: 'worship', icon: '🗓️', label: '예배' },
          { key: 'cell', icon: '👥', label: '샘출석' },
          { key: 'newcomers', icon: '👤₊', label: '새가족' }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={activeTab === tab.key ? styles.activeNavTab : styles.navTab}>
            <div style={styles.navIcon}>{tab.icon}</div>
            <div style={styles.navLabel}>{tab.label}</div>
          </button>
        ))}
      </nav>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '70px', color: '#333' },
  header: { padding: '20px 20px 10px' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold' },
  headerSub: { fontSize: '14px', color: '#666', marginTop: '3px' },
  blueCardWrapper: { padding: '0 15px' },
  blueCard: { backgroundColor: '#007bff', color: 'white', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  blueCardMain: { textAlign: 'left' },
  blueCardTitle: { fontSize: '18px', fontWeight: 'bold' },
  blueCardDate: { fontSize: '13px', marginTop: '5px', opacity: 0.9 },
  blueCardIcon: { position: 'relative' },
  crossIconBg: { backgroundColor: 'rgba(255,255,255,0.2)', width: '40px', height: '40px', borderRadius: '5px', fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  main: { padding: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  statCard: { backgroundColor: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #ddd' },
  statValue: { fontSize: '22px', fontWeight: 'bold' },
  statLabel: { fontSize: '12px', color: '#666', marginTop: '3px' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  actionCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' },
  actionIcon: { fontSize: '20px' },
  actionLabel: { fontSize: '13px', fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' },
  primaryBtn: { width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  alertBox: { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', fontSize: '14px' },
  bottomNav: { display: 'flex', backgroundColor: 'white', borderTop: '1px solid #ddd', position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px' },
  navTab: { flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'center', color: '#666' },
  activeNavTab: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#007bff', fontWeight: 'bold' },
  navIcon: { fontSize: '18px', marginBottom: '3px' },
  navLabel: { fontSize: '10px' },
  placeholder: { textAlign: 'center', color: '#888', marginTop: '20px' }
};

export default App;