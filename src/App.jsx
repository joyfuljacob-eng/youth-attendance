import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ==================== 1. Supabase 연결 설정 ====================
const SUPABASE_URL = 'https://mxrjnfqqastxrgkhbdsd.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cmpuZnFxYXN0eHJna2hiZHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTM1NjEsImV4cCI6MjA5MTgyOTU2MX0.-alP0q5kuysL0x3zH3Iw6QdGNu1eC1MdBR3bCAEx7Zo';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const today = () => new Date().toISOString().split("T")[0];

// ==================== ICONS ====================
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    newuser: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
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
  const [newName, setNewName] = useState(""); // 이름 입력값 저장

  const fetchData = async () => {
    const { data: memData } = await supabase.from('members').select('*').order('name');
    if (memData) setMembers(memData);
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
    const sub = supabase.channel('db-changes').on('postgres_changes', { event: '*', schema: 'public' }, fetchData).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  // 청년 등록 함수
  const addMember = async () => {
    if (!newName.trim()) return alert("이름을 입력해주세요.");
    const { error } = await supabase.from('members').insert([{ name: newName, is_new: false }]);
    if (error) alert("등록 실패: " + error.message);
    else {
      setNewName("");
      alert(`${newName} 청년이 등록되었습니다.`);
    }
  };

  if (loading) return <div className="loading">데이터 연결 중...</div>;

  const pages = {
    home: (
      <div className="page-content">
        <div className="card">
          <h3>새 청년 등록</h3>
          <div className="input-group">
            <input 
              className="form-input" 
              placeholder="이름을 입력하세요" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
            />
            <button className="btn-primary" onClick={addMember}>등록</button>
          </div>
        </div>
        <div className="info-text">현재 등록된 청년: {members.length}명</div>
      </div>
    ),
    members: (
      <div className="page-content">
        {members.map(m => <div key={m.id} className="member-item">{m.name}</div>)}
      </div>
    ),
    attendance: <AttendancePage members={members} attendance={attendance} />,
    newmembers: <div className="empty-state">준비 중인 기능입니다.</div>,
  };

  return (
    <div className="app-wrapper">
      <style>{css}</style>
      <div className="app-header">학익교회 청년부 관리</div>
      <div className="page-content">{pages[activeNav]}</div>
      <div className="bottom-nav">
        {["home", "members", "attendance", "newmembers"].map(id => (
          <button key={id} className={`nav-item ${activeNav === id ? "active" : ""}`} onClick={() => setActiveNav(id)}>
            <Icon name={id === "newmembers" ? "plus" : (id === "attendance" ? "calendar" : (id === "members" ? "users" : "home"))} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ==================== ATTENDANCE PAGE ====================
function AttendancePage({ members, attendance }) {
  const [selDate, setSelDate] = useState(today());
  const dayAttendance = attendance[selDate] || {};

  const toggleAtt = async (mId) => {
    const isPresent = !dayAttendance[mId]?.present;
    await supabase.from('attendance').upsert({ date: selDate, member_id: mId, present: isPresent }, { onConflict: 'date, member_id' });
  };

  return (
    <div>
      <input type="date" className="date-input-styled" value={selDate} onChange={e => setSelDate(e.target.value)} />
      {members.map(m => (
        <div key={m.id} className="member-item" onClick={() => toggleAtt(m.id)}>
          <span>{m.name}</span>
          <span>{dayAttendance[m.id]?.present ? "✅" : "⚪"}</span>
        </div>
      ))}
    </div>
  );
}

const css = `
  .app-wrapper { max-width: 430px; margin: 0 auto; min-height: 100vh; background: #f8fafc; font-family: sans-serif; }
  .app-header { background: #fff; padding: 20px; text-align: center; font-weight: bold; border-bottom: 1px solid #e2e8f0; }
  .card { background: #fff; margin: 20px; padding: 20px; border-radius: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .input-group { display: flex; gap: 10px; margin-top: 10px; }
  .form-input { flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
  .btn-primary { padding: 10px 20px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: bold; }
  .member-item { display: flex; justify-content: space-between; padding: 15px; background: #fff; margin: 8px 15px; border-radius: 10px; border: 1px solid #e2e8f0; }
  .bottom-nav { position: fixed; bottom: 0; width: 100%; max-width: 430px; display: flex; background: #fff; border-top: 1px solid #e2e8f0; }
  .nav-item { flex: 1; padding: 20px; border: none; background: none; color: #94a3b8; }
  .nav-item.active { color: #2563eb; }
  .date-input-styled { width: calc(100% - 30px); margin: 15px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
  .info-text { text-align: center; color: #64748b; font-size: 14px; }
  .loading { text-align: center; margin-top: 100px; color: #64748b; }
`;