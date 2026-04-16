import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ==================== 1. Supabase 연결 설정 ====================
// 아래 따옴표 안에 메모해둔 주소와 열쇠를 정확히 넣어주세요.
const SUPABASE_URL = 'https://mxrjnfqqastxrgkhbdsd.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cmpuZnFxYXN0eHJna2hiZHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTM1NjEsImV4cCI6MjA5MTgyOTU2MX0.-alP0q5kuysL0x3zH3Iw6QdGNu1eC1MdBR3bCAEx7Zo';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== UTILS ====================
const today = () => new Date().toISOString().split("T")[0];

// ==================== ICONS ====================
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    newuser: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ==================== MAIN APP ====================
export default function App() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activeNav, setActiveNav] = useState("home");
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기 (Read)
  const fetchData = async () => {
    setLoading(true);
    // 멤버 목록 가져오기
    const { data: memData } = await supabase.from('members').select('*').order('name');
    if (memData) setMembers(memData);

    // 출석 데이터 가져오기
    const { data: attData } = await supabase.from('attendance').select('*');
    if (attData) {
      const attObj = {};
      attData.forEach(row => {
        if (!attObj[row.date]) attObj[row.date] = {};
        attObj[row.date][row.member_id] = { present: row.present, note: row.note };
      });
      setAttendance(attObj);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // [실시간 기능] 데이터가 변하면 자동으로 다시 불러오기
    const memberSub = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(memberSub); };
  }, []);

  // 2. 출석 체크 저장 (Upsert)
  const toggleAttendance = async (date, memberId) => {
    const current = attendance[date]?.[memberId];
    const isPresent = current ? !current.present : true;

    const { error } = await supabase
      .from('attendance')
      .upsert({ 
        date, 
        member_id: memberId, 
        present: isPresent,
        note: current?.note || ""
      }, { onConflict: 'date, member_id' });

    if (error) alert("저장 실패: " + error.message);
  };

  // 3. 심방 메모 저장
  const updateNote = async (date, memberId) => {
    const currentNote = attendance[date]?.[memberId]?.note || "";
    const newNote = window.prompt("심방 메모를 입력하세요", currentNote);
    
    if (newNote !== null) {
      await supabase
        .from('attendance')
        .upsert({ 
          date, 
          member_id: memberId, 
          present: attendance[date]?.[memberId]?.present || false,
          note: newNote 
        }, { onConflict: 'date, member_id' });
    }
  };

  // 4. 새가족 수료 처리
  const graduateMember = async (memberId) => {
    const target = members.find(m => m.id === memberId);
    if (window.confirm(`${target.name} 청년을 정회원으로 수료 처리하시겠습니까?`)) {
      await supabase
        .from('members')
        .update({ is_new: false })
        .eq('id', memberId);
    }
  };

  if (loading) return <div className="loading">데이터를 불러오는 중...</div>;

  const pages = {
    home: <div className="empty-state">학익교회 청년부 사역지원</div>,
    members: (
      <div className="page-content">
        {members.filter(m => !m.is_new).map(m => (
          <div key={m.id} className="member-item">{m.name}</div>
        ))}
      </div>
    ),
    attendance: <AttendancePage members={members.filter(m => !m.is_new)} attendance={attendance} toggleAttendance={toggleAttendance} updateNote={updateNote} />,
    newmembers: <NewMembersPage newMembers={members.filter(m => m.is_new)} graduateMember={graduateMember} />,
  };

  return (
    <div className="app-wrapper">
      <style>{css}</style>
      <div className="app-header">학익교회 청년부 관리</div>
      <div className="page-content">{pages[activeNav]}</div>
      <div className="bottom-nav">
        {["home", "members", "attendance", "newmembers"].map(id => (
          <button key={id} className={`nav-item ${activeNav === id ? "active" : ""}`} onClick={() => setActiveNav(id)}>
            <Icon name={id === "newmembers" ? "newuser" : (id === "attendance" ? "calendar" : (id === "members" ? "users" : "home"))} size={22} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ==================== SUB-PAGES ====================
function AttendancePage({ members, attendance, toggleAttendance, updateNote }) {
  const [selDate, setSelDate] = useState(today());
  const dayAttendance = attendance[selDate] || {};

  return (
    <div>
      <input type="date" className="date-input-styled" value={selDate} onChange={e => setSelDate(e.target.value)} />
      {members.map(m => {
        const isPresent = dayAttendance[m.id]?.present;
        return (
          <div key={m.id} className="member-item">
            <div className="member-info" onClick={() => toggleAttendance(selDate, m.id)}>
              <div className="member-name">{m.name} {isPresent ? "✅" : "⚪"}</div>
              {dayAttendance[m.id]?.note && <div className="badge">📝 {dayAttendance[m.id].note}</div>}
            </div>
            <button className="btn-icon" onClick={() => updateNote(selDate, m.id)}><Icon name="edit" size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

function NewMembersPage({ newMembers, graduateMember }) {
  return (
    <div className="page-content">
      {newMembers.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>등록된 새가족이 없습니다.</p>}
      {newMembers.map(m => (
        <div key={m.id} className="member-item">
          <span>{m.name} ({m.edu_status}주차)</span>
          <button className="btn-sm" onClick={() => graduateMember(m.id)}>수료</button>
        </div>
      ))}
    </div>
  );
}

const css = `
  .app-wrapper { max-width: 430px; margin: 0 auto; min-height: 100vh; background: #f8fafc; padding-bottom: 70px; font-family: -apple-system, sans-serif; }
  .app-header { background: #fff; padding: 15px; text-align: center; font-weight: bold; border-bottom: 1px solid #e2e8f0; font-size: 18px; }
  .member-item { display: flex; align-items: center; justify-content: space-between; padding: 15px; background: #fff; margin: 8px 15px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .bottom-nav { position: fixed; bottom: 0; width: 100%; max-width: 430px; display: flex; background: #fff; border-top: 1px solid #e2e8f0; }
  .nav-item { flex: 1; padding: 18px; border: none; background: none; color: #94a3b8; cursor: pointer; }
  .nav-item.active { color: #2563eb; }
  .date-input-styled { width: calc(100% - 30px); margin: 15px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 16px; outline: none; }
  .badge { font-size: 12px; color: #3b82f6; background: #eff6ff; padding: 2px 6px; border-radius: 4px; margin-top: 4px; display: inline-block; }
  .loading { text-align: center; padding: 100px 20px; color: #64748b; }
  .btn-sm { padding: 6px 12px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; }
  .empty-state { padding: 100px 20px; text-align: center; color: #94a3b8; }
  .btn-icon { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 5px; }
`;