import React, { useState } from 'react';

function App() {
  // 현재 하단 메뉴 중 어떤 탭이 선택되었는지 저장하는 상자(State)
  const [activeTab, setActiveTab] = useState('home');

  // 아이콘 (폰트어썸 같은 외부 라이브러리 없이, 이미지와 유사한 이모지로 임시 대체했습니다.)
  const icons = {
    cross: '✛',     // 파란 카드 안의 십자가
    calendar: '🗓️',   // 예배 출석 체크
    people: '👥',     // 샘 출석 체크
    list: '📋',       // 청년 명단
    addUser: '👤₊'    // 새가족 관리
  };

  // 1. 실제 데이터가 들어갈 대시보드 요약 정보 (API 연결 전, 0으로 표시)
  const stats = {
    total: 0,
    attendance: 0,
    groups: 0,
    newcomers: 0
  };

  // --- 메인 홈 화면 (이미지 속 중앙 부분) ---
  const HomeDashboard = () => (
    <div style={styles.content}>
      {/* 📊 요약 숫자 카드 섹션 (2x2 그리드) */}
      <div style={styles.statsGrid}>
        {[
          { color: '#007bff', label: '전체 청년', value: stats.total },
          { color: '#28a745', label: '오늘 출석', value: stats.attendance },
          { color: '#ffc107', label: '샘 그룹 수', value: stats.groups },
          { color: '#a033ff', label: '새가족', value: stats.newcomers }
        ].map((stat, idx) => (
          <div key={idx} style={styles.statCard}>
            <div style={{...styles.statValue, color: stat.color}}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 🔗 주요 기능 버튼 섹션 (2x2 그리드) */}
      <div style={styles.actionGrid}>
        {[
          { icon: icons.calendar, label: '예배 출석 체크' },
          { icon: icons.people, label: '샘 출석 체크' },
          { icon: icons.list, label: '청년 명단' },
          { icon: icons.addUser, label: '새가족 관리' }
        ].map((action, idx) => (
          <div key={idx} style={styles.actionCard} onClick={() => alert(`${action.label} 화면으로 이동합니다.`)}>
            <div style={styles.actionIcon}>{action.icon}</div>
            <div style={styles.actionLabel}>{action.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* --- 상단 헤더 영역 --- */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>청년부 출석부</div>
        <div style={styles.headerSub}>오늘도 함께해요 🙏</div>
      </header>

      {/* --- 상단 파란색 날짜 카드 --- */}
      <div style={styles.blueCardWrapper}>
        <div style={styles.blueCard}>
          <div style={styles.blueCardMain}>
            <div style={styles.blueCardTitle}>청년부 출석 관리</div>
            <div style={styles.blueCardDate}>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</div>
          </div>
          <div style={styles.blueCardIcon}>
            <div style={styles.crossIconBg}>{icons.cross}</div>
          </div>
        </div>
      </div>

      {/* --- 메인 콘텐츠 영역 --- */}
      <main style={styles.main}>
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'members' && <div style={styles.placeholder}>👤 청년 명단 화면입니다.</div>}
        {activeTab === 'worship' && <div style={styles.placeholder}>🗓️ 예배 출석 화면입니다.</div>}
        {activeTab === 'cell' && <div style={styles.placeholder}>👥 샘 출석 화면입니다.</div>}
        {activeTab === 'newcomers' && <div style={styles.placeholder}>👤₊ 새가족 화면입니다.</div>}
      </main>

      {/* --- 하단 네비게이션 바 (메뉴 탭) --- */}
      <nav style={styles.bottomNav}>
        {[
          { key: 'home', icon: '🏠', label: '홈' },
          { key: 'members', icon: '👤', label: '청년 명단' },
          { key: 'worship', icon: '🗓️', label: '예배 출석' },
          { key: 'cell', icon: '👥', label: '샘 출석' },
          { key: 'newcomers', icon: '👤₊', label: '새가족' }
        ].map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setActiveTab(tab.key)} 
            style={activeTab === tab.key ? styles.activeNavTab : styles.navTab}
          >
            <div style={styles.navIcon}>{tab.icon}</div>
            <div style={styles.navLabel}>{tab.label}</div>
          </button>
        ))}
      </nav>
    </div>
  );
}

// --- 디자인 스타일 정의 (이미지를 참고하여 세밀하게 조정했습니다.) ---
const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '70px', color: '#333' },
  
  // 헤더 스타일
  header: { padding: '20px 20px 10px', textAlign: 'left', backgroundColor: '#f9fafb' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold' },
  headerSub: { fontSize: '14px', color: '#666', marginTop: '3px' },

  // 파란 카드 스타일
  blueCardWrapper: { padding: '0 15px' },
  blueCard: { backgroundColor: '#007bff', color: 'white', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  blueCardMain: { textAlign: 'left' },
  blueCardTitle: { fontSize: '18px', fontWeight: 'bold' },
  blueCardDate: { fontSize: '13px', marginTop: '5px', opacity: 0.9 },
  blueCardIcon: { position: 'relative' },
  crossIconBg: { backgroundColor: 'rgba(255,255,255,0.2)', width: '40px', height: '40px', borderRadius: '5px', fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' },

  // 메인 콘텐츠 스타일
  main: { padding: '20px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' },
  statCard: { backgroundColor: 'white', padding: '15px', borderRadius: '10px', textAlign: 'left', border: '1px solid #ddd' },
  statValue: { fontSize: '22px', fontWeight: 'bold' },
  statLabel: { fontSize: '12px', color: '#666', marginTop: '3px' },

  // 주요 기능 버튼 스타일
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  actionCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer', border: '1px solid #ddd', display: 'flex', flexDirection: 'column', gap: '10px' },
  actionIcon: { backgroundColor: 'white', fontSize: '20px' }, // 아이콘 배경을 이모지로 대체
  actionLabel: { fontSize: '13px', fontWeight: 'bold' },
  placeholder: { fontSize: '14px', textAlign: 'center', color: '#888', marginTop: '30px' },

  // 하단 네비게이션 바 스타일
  bottomNav: { display: 'flex', backgroundColor: 'white', borderTop: '1px solid #ddd', position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px' },
  navTab: { flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'center', color: '#666' },
  activeNavTab: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#007bff', fontWeight: 'bold' },
  navIcon: { fontSize: '18px', marginBottom: '3px' },
  navLabel: { fontSize: '10px' }
};

export default App;