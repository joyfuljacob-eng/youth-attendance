import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const icons = {
    cross: '✛',
    calendar: '🗓️',
    people: '👥',
    list: '📋',
    addUser: '👤₊',
    bell: '🔔'
  };

  const stats = {
    total: 0,
    attendance: 0,
    groups: 0,
    newcomers: 0
  };

  const HomeDashboard = () => (
    <div style={styles.content}>
      {/* 요약 숫자 카드 */}
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

      {/* 주요 기능 버튼 (알림 센터는 여기에만 유지) */}
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
          <div style={styles.blueCardIcon}>
            <div style={styles.crossIconBg}>{icons.cross}</div>
          </div>
        </div>
      </div>

      <main style={styles.main}>
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'members' && <div style={styles.placeholder}>👤 청년 명단 화면입니다.</div>}
        {activeTab === 'worship' && <div style={styles.placeholder}>🗓️ 예배 출석 화면입니다.</div>}
        {activeTab === 'cell' && <div style={styles.placeholder}>👥 샘 출석 화면입니다.</div>}
        {activeTab === 'newcomers' && <div style={styles.placeholder}>👤₊ 새가족 화면입니다.</div>}
        {activeTab === 'notifications' && (
          <div style={styles.card}>
            <h3 style={{marginBottom: '15px'}}>🔔 실시간 알림</h3>
            <div style={styles.alertBox}>🎂 <b>오늘 생일:</b> 김철수 청년</div>
            <div style={{...styles.alertBox, backgroundColor:'#fff3f3'}}>
              ⚠️ <b>장기 결석:</b> 4주 이상 결석자 확인 필요
            </div>
          </div>
        )}
      </main>

      {/* 하단 탭 메뉴: 알림을 빼고 '샘 출석'을 다시 넣었습니다. */}
      <nav style={styles.bottomNav}>
        {[
          { key: 'home', icon: '🏠', label: '홈' },
          { key: 'members', icon: '👤', label: '청년 명단' },
          { key: 'worship', icon: '🗓️', label: '예배 출석' },
          { key: 'cell', icon: '👥', label: '샘 출석' }, // 복구된 메뉴
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

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '70px', color: '#333' },
  header: { padding: '20px 20px 10px', textAlign: 'left' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold' },
  headerSub: { fontSize: '14px', color: '#666', marginTop: '3px' },
  blueCardWrapper: { padding: '0 15px' },
  blueCard: { backgroundColor: '#007bff', color: 'white', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
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
  placeholder: { fontSize: '14px', textAlign: 'center', color: '#888', marginTop: '30px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px' },
  alertBox: { padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', marginBottom: '10px', fontSize: '14px' },
  bottomNav: { display: 'flex', backgroundColor: 'white', borderTop: '1px solid #ddd', position: 'fixed', bottom: 0, left: 0, right: 0, height: '65px', zIndex: 100 },
  navTab: { flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'center', color: '#666' },
  activeNavTab: { flex: 1, padding: '10px', border: 'none', background: 'none', color: '#007bff', fontWeight: 'bold' },
  navIcon: { fontSize: '18px', marginBottom: '3px' },
  navLabel: { fontSize: '10px' }
};

export default App;