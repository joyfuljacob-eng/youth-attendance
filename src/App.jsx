import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ==================== 1. Supabase 연결 설정 ====================
const SUPABASE_URL = 'https://mxrjnfqqastxrgkhbdsd.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cmpuZnFxYXN0eHJna2hiZHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTM1NjEsImV4cCI6MjA5MTgyOTU2MX0.-alP0q5kuysL0x3zH3Iw6QdGNu1eC1MdBR3bCAEx7Zo';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const today = () => new Date().toISOString().split("T")[0];


// ==================== STORAGE ====================
const STORAGE_KEYS = {
  members: "cya_members",
  newMembers: "cya_new_members",
  sams: "cya_sams",
  attendance: "cya_attendance",
  samAttendance: "cya_sam_attendance",
};

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

// ==================== ICONS ====================
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    group: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 17.5c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" />
        <circle cx="4" cy="10" r="2" />
        <path d="M2 19c0-2 1.79-3.5 4-3.5" />
        <circle cx="20" cy="10" r="2" />
        <path d="M22 19c0-2-1.79-3.5-4-3.5" />
      </>
    ),
    newuser: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    male: (
      <>
        <circle cx="10" cy="14" r="5" />
        <line x1="19" y1="5" x2="14.14" y2="9.86" />
        <polyline points="15 5 19 5 19 9" />
      </>
    ),
    female: (
      <>
        <circle cx="12" cy="8" r="5" />
        <line x1="12" y1="13" x2="12" y2="21" />
        <line x1="9" y1="18" x2="15" y2="18" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
    cake: (
      <>
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
        <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
        <path d="M2 21h20" />
        <path d="M7 8v2" /><path d="M12 8v2" /><path d="M17 8v2" />
        <path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ==================== UTILS ====================
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split("T")[0];

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, "0")}.${String(dt.getDate()).padStart(2, "0")}`;
};

const getDayLabel = (d) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date(d + "T00:00:00").getDay()];
};

const getAbsentWeeks = (memberId, attendance) => {
  const dates = Object.keys(attendance)
    .filter((d) => attendance[d]?.[memberId])
    .sort().reverse();
  if (dates.length === 0) return null;
  const lastDate = new Date(dates[0] + "T00:00:00");
  const now = new Date();
  return Math.floor((now - lastDate) / (7 * 24 * 60 * 60 * 1000));
};

// 오늘 생일인 멤버 (birthday 형식: MM/DD)
const getTodayBirthdays = (members) => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const todayMD = `${mm}/${dd}`;
  return members.filter((m) => m.birthday && m.birthday.trim() === todayMD);
};

// 이번달 생일자
const getThisMonthBirthdays = (members) => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = parseInt(now.getDate());
  return members
    .filter((m) => m.birthday && m.birthday.startsWith(mm + "/"))
    .map((m) => {
      const dayNum = parseInt(m.birthday.split("/")[1]);
      return { ...m, dayNum, isPast: dayNum < dd, isToday: dayNum === dd };
    })
    .sort((a, b) => a.dayNum - b.dayNum);
};

// ==================== STYLES ====================
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --primary: #2563EB; --primary-light: #EFF6FF; --primary-dark: #1D4ED8;
    --danger: #EF4444; --danger-light: #FEF2F2;
    --success: #10B981; --success-light: #ECFDF5;
    --warning: #F59E0B; --warning-light: #FFFBEB;
    --gray-50: #F8FAFC; --gray-100: #F1F5F9; --gray-200: #E2E8F0;
    --gray-300: #CBD5E1; --gray-400: #94A3B8; --gray-500: #64748B;
    --gray-600: #475569; --gray-700: #334155; --gray-800: #1E293B;
    --gray-900: #0F172A; --white: #FFFFFF;
    --radius: 12px; --radius-lg: 16px;
    --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  }
  html, body, #root { height: 100%; font-family: 'Noto Sans KR', sans-serif;
    background: var(--gray-50); color: var(--gray-800); -webkit-font-smoothing: antialiased; }
  .app-wrapper { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--white);
    display: flex; flex-direction: column; overflow: hidden; }

  /* Header */
  .app-header { background: var(--white); padding: 16px 20px 12px;
    border-bottom: 1px solid var(--gray-100); position: sticky; top: 0; z-index: 50; }
  .header-top { display: flex; align-items: center; gap: 10px; }
  .header-title-block { flex: 1; }
  .header-title { font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700;
    color: var(--gray-900); letter-spacing: -0.3px; }
  .header-sub { font-size: 12px; color: var(--gray-400); margin-top: 1px; }

  /* Bottom Nav */
  .bottom-nav { background: var(--white); border-top: 1px solid var(--gray-100);
    display: flex; padding: 8px 0 max(8px, env(safe-area-inset-bottom)); position: sticky; bottom: 0; z-index: 50; }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 4px 0; cursor: pointer; background: none; border: none; color: var(--gray-400);
    font-size: 10px; font-family: 'Noto Sans KR', sans-serif; transition: color 0.15s; }
  .nav-item.active { color: var(--primary); }

  .page-content { flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 24px; }

  /* Cards */
  .card { background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg); padding: 16px; margin-bottom: 12px; box-shadow: var(--shadow); }

  /* Buttons */
  .btn { border: none; border-radius: var(--radius); font-family: 'Noto Sans KR', sans-serif;
    font-weight: 500; cursor: pointer; display: inline-flex; align-items: center;
    justify-content: center; gap: 6px; transition: all 0.15s; white-space: nowrap; }
  .btn-primary { background: var(--primary); color: var(--white); padding: 12px 20px; font-size: 14px; width: 100%; }
  .btn-primary:hover { background: var(--primary-dark); }
  .btn-secondary { background: var(--gray-100); color: var(--gray-700); padding: 10px 16px; font-size: 13px; }
  .btn-secondary:hover { background: var(--gray-200); }
  .btn-danger { background: var(--danger-light); color: var(--danger); padding: 8px 12px; font-size: 12px; }
  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }
  .btn-icon { background: var(--primary-light); color: var(--primary); border: none; border-radius: 8px;
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
  .btn-icon:hover { background: #dbeafe; }
  .btn-icon.danger { background: var(--danger-light); color: var(--danger); }
  .btn-icon.danger:hover { background: #fee2e2; }

  /* Form */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 13px; font-weight: 500; color: var(--gray-600); margin-bottom: 6px; display: block; }
  .form-label .optional { font-size: 11px; color: var(--gray-400); font-weight: 400; margin-left: 4px; }
  .form-input { width: 100%; padding: 11px 14px; border: 1.5px solid var(--gray-200);
    border-radius: var(--radius); font-size: 14px; font-family: 'Noto Sans KR', sans-serif;
    color: var(--gray-800); background: var(--white); outline: none; transition: border-color 0.15s; }
  .form-input:focus { border-color: var(--primary); }
  .form-select { width: 100%; padding: 11px 14px; border: 1.5px solid var(--gray-200);
    border-radius: var(--radius); font-size: 14px; font-family: 'Noto Sans KR', sans-serif;
    color: var(--gray-800); background: var(--white); outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
  .form-select:focus { border-color: var(--primary); }
  .form-row { display: flex; gap: 10px; }
  .form-row .form-group { flex: 1; }
  .input-with-icon { position: relative; }
  .input-with-icon .input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--gray-400); pointer-events: none; }
  .input-with-icon .form-input { padding-left: 38px; }

  /* Gender Toggle */
  .gender-toggle { display: flex; gap: 8px; }
  .gender-btn { flex: 1; padding: 10px; border: 1.5px solid var(--gray-200); border-radius: var(--radius);
    background: var(--white); cursor: pointer; font-family: 'Noto Sans KR', sans-serif;
    font-size: 15px; font-weight: 700; color: var(--gray-500);
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; }
  .gender-btn.male.active { border-color: #3B82F6; background: #EFF6FF; color: #2563EB; }
  .gender-btn.female.active { border-color: #EC4899; background: #FDF2F8; color: #DB2777; }

  /* Member */
  .member-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px;
    border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 8px;
    background: var(--white); transition: all 0.15s; }
  .member-item:hover { border-color: var(--primary); background: var(--primary-light); }
  .member-avatar { width: 42px; height: 42px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex-shrink: 0; }
  .member-avatar.male { background: #DBEAFE; color: #1D4ED8; }
  .member-avatar.female { background: #FCE7F3; color: #9D174D; }
  .member-info { flex: 1; min-width: 0; }
  .member-name { font-size: 15px; font-weight: 600; color: var(--gray-800); }
  .member-meta { font-size: 12px; color: var(--gray-400); margin-top: 2px; }
  .member-actions { display: flex; gap: 6px; flex-shrink: 0; }

  /* Badges */
  .badge { display: inline-flex; align-items: center; padding: 2px 8px;
    border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-blue { background: var(--primary-light); color: var(--primary); }
  .badge-green { background: var(--success-light); color: var(--success); }
  .badge-red { background: var(--danger-light); color: var(--danger); }
  .badge-yellow { background: var(--warning-light); color: #D97706; }
  .badge-pink { background: #FDF2F8; color: #DB2777; }
  .badge-purple { background: #F5F3FF; color: #8B5CF6; }

  /* Attendance */
  .attendance-check-btn { width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid var(--gray-200); background: var(--white);
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
  .attendance-check-btn.checked { background: var(--success); border-color: var(--success); color: var(--white); }

  /* Date */
  .date-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .date-input-styled { flex: 1; padding: 10px 14px; border: 1.5px solid var(--gray-200);
    border-radius: var(--radius); font-size: 14px; font-family: 'Noto Sans KR', sans-serif;
    color: var(--gray-800); background: var(--white); outline: none; }
  .date-input-styled:focus { border-color: var(--primary); }

  /* Stats */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .stat-card { background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius); padding: 14px; text-align: center; }
  .stat-number { font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 700;
    color: var(--primary); line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: var(--gray-500); }

  /* Alerts */
  .alert-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px;
    border-radius: var(--radius); margin-bottom: 8px; }
  .alert-item.warn { background: var(--warning-light); border-left: 3px solid var(--warning); }
  .alert-item.danger { background: var(--danger-light); border-left: 3px solid var(--danger); }
  .alert-item.weekly { background: #FFF1F2; border-left: 3px solid #F43F5E; }
  .alert-text { flex: 1; }
  .alert-title { font-size: 13px; font-weight: 600; color: var(--gray-800); }
  .alert-sub { font-size: 12px; color: var(--gray-500); margin-top: 2px; }

  /* Birthday Banner */
  .birthday-banner { background: linear-gradient(135deg, #F97316 0%, #EF4444 100%);
    border-radius: var(--radius-lg); padding: 16px 18px; color: white; margin-bottom: 14px; }
  .birthday-banner-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .birthday-person { display: flex; align-items: center; gap: 10px; padding: 8px 10px;
    background: rgba(255,255,255,0.2); border-radius: 10px; margin-bottom: 6px; }
  .birthday-person:last-child { margin-bottom: 0; }
  .birthday-avatar { width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.3); display: flex; align-items: center;
    justify-content: center; font-weight: 700; font-size: 14px; }
  .birthday-name { font-size: 15px; font-weight: 700; }
  .birthday-detail { font-size: 12px; opacity: 0.85; margin-top: 1px; }

  /* Month Birthday */
  .month-birthday-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: var(--radius); margin-bottom: 6px; background: var(--gray-50); border: 1px solid var(--gray-100); }
  .month-birthday-item.today { background: #FFF7ED; border-color: #FED7AA; }
  .birthday-date-badge { width: 40px; height: 40px; border-radius: 10px; background: var(--gray-200);
    display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
    color: var(--gray-600); }
  .birthday-date-badge.today { background: #F97316; color: white; }
  .bday-month { font-size: 9px; font-weight: 600; opacity: 0.75; }
  .bday-day { font-size: 16px; font-weight: 800; line-height: 1.1; }

  /* Edu Weeks */
  .edu-weeks { display: flex; gap: 8px; margin-top: 8px; }
  .week-check { flex: 1; padding: 8px 4px; border-radius: 8px; text-align: center; cursor: pointer;
    font-size: 12px; font-weight: 600; background: var(--gray-100); color: var(--gray-400);
    transition: all 0.15s; border: none; font-family: 'Noto Sans KR', sans-serif; }
  .week-check.done { background: var(--success); color: var(--white); box-shadow: 0 2px 8px rgba(16,185,129,0.3); }

  /* Sam */
  .sam-card { background: var(--primary-light); border: 1px solid #BFDBFE; border-radius: var(--radius);
    padding: 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .sam-icon { width: 42px; height: 42px; background: var(--primary); border-radius: 10px;
    display: flex; align-items: center; justify-content: center; color: var(--white); flex-shrink: 0; }
  .sam-info { flex: 1; }
  .sam-name { font-size: 15px; font-weight: 600; color: var(--gray-800); }
  .sam-count { font-size: 12px; color: var(--gray-500); margin-top: 2px; }

  /* Search */
  .search-bar { position: relative; margin-bottom: 14px; }
  .search-bar input { width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid var(--gray-200);
    border-radius: var(--radius); font-size: 14px; font-family: 'Noto Sans KR', sans-serif;
    outline: none; background: var(--gray-50); }
  .search-bar input:focus { border-color: var(--primary); background: var(--white); }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-400); }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal-sheet { background: var(--white); border-radius: 20px 20px 0 0; width: 100%;
    max-width: 430px; max-height: 90vh; overflow-y: auto;
    padding: 20px 20px max(20px, env(safe-area-inset-bottom)); animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-handle { width: 40px; height: 4px; background: var(--gray-200); border-radius: 2px; margin: 0 auto 20px; }
  .modal-title { font-size: 18px; font-weight: 700; color: var(--gray-900); margin-bottom: 20px; }

  /* Table */
  .summary-table { width: 100%; border-collapse: collapse; }
  .summary-table th { font-size: 11px; font-weight: 600; color: var(--gray-500); text-align: center;
    padding: 6px 4px; border-bottom: 1px solid var(--gray-200); }
  .summary-table td { text-align: center; padding: 8px 4px; border-bottom: 1px solid var(--gray-100); font-size: 13px; }
  .summary-table td:first-child { text-align: left; font-weight: 500; }
  .dot-present { width: 20px; height: 20px; background: var(--success); border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 700; }
  .dot-absent { width: 20px; height: 20px; background: var(--gray-200); border-radius: 50%; display: inline-block; }

  /* Tabs */
  .tab-bar { display: flex; background: var(--gray-100); border-radius: 10px; padding: 3px; margin-bottom: 16px; }
  .tab-item { flex: 1; padding: 8px; border-radius: 8px; border: none; font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--gray-500); background: transparent; cursor: pointer; transition: all 0.15s; text-align: center; }
  .tab-item.active { background: var(--white); color: var(--primary); font-weight: 600; box-shadow: var(--shadow); }

  /* Misc */
  .empty-state { text-align: center; padding: 48px 20px; color: var(--gray-400); }
  .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state-text { font-size: 15px; font-weight: 500; margin-bottom: 6px; color: var(--gray-500); }
  .empty-state-sub { font-size: 13px; }

  .home-banner { background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%);
    border-radius: var(--radius-lg); padding: 20px; color: white; margin-bottom: 16px;
    position: relative; overflow: hidden; }
  .home-banner::after { content: '✝'; position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%); font-size: 64px; opacity: 0.1; }
  .home-banner-title { font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .home-banner-sub { font-size: 13px; opacity: 0.85; }

  .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .quick-action { background: var(--white); border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg); padding: 16px; display: flex; flex-direction: column;
    align-items: flex-start; gap: 8px; cursor: pointer; transition: all 0.15s; box-shadow: var(--shadow); }
  .quick-action:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .quick-action-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .quick-action-label { font-size: 13px; font-weight: 600; color: var(--gray-700); }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .section-title { font-size: 15px; font-weight: 700; color: var(--gray-800); }

  .progress-bar-wrap { background: var(--gray-200); border-radius: 999px; height: 6px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 999px; background: var(--success); transition: width 0.3s; }

  .phone-link { color: var(--primary); text-decoration: none; font-size: 12px; }
  .phone-link:hover { text-decoration: underline; }

  .info-hint { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px;
    padding: 12px 14px; margin-bottom: 16px; font-size: 13px; color: #1D4ED8; }
`;

// ==================== GENDER TOGGLE (공통 컴포넌트) ====================
function GenderToggle({ gender, setGender }) {
  return (
    <div className="form-group">
      <label className="form-label">성별</label>
      <div className="gender-toggle">
        <button className={`gender-btn male ${gender === "male" ? "active" : ""}`} onClick={() => setGender("male")}>
          <Icon name="male" size={16} color={gender === "male" ? "#2563EB" : "#94A3B8"} />
          남
        </button>
        <button className={`gender-btn female ${gender === "female" ? "active" : ""}`} onClick={() => setGender("female")}>
          <Icon name="female" size={16} color={gender === "female" ? "#DB2777" : "#94A3B8"} />
          여
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [members, setMembers] = useState(() => load(STORAGE_KEYS.members, []));
  const [newMembers, setNewMembers] = useState(() => load(STORAGE_KEYS.newMembers, []));
  const [sams, setSams] = useState(() => load(STORAGE_KEYS.sams, []));
  const [attendance, setAttendance] = useState(() => load(STORAGE_KEYS.attendance, {}));
  const [samAttendance, setSamAttendance] = useState(() => load(STORAGE_KEYS.samAttendance, {}));
  const [activeNav, setActiveNav] = useState("home");
  const [modal, setModal] = useState(null);

  useEffect(() => save(STORAGE_KEYS.members, members), [members]);
  useEffect(() => save(STORAGE_KEYS.newMembers, newMembers), [newMembers]);
  useEffect(() => save(STORAGE_KEYS.sams, sams), [sams]);
  useEffect(() => save(STORAGE_KEYS.attendance, attendance), [attendance]);
  useEffect(() => save(STORAGE_KEYS.samAttendance, samAttendance), [samAttendance]);

  const closeModal = () => setModal(null);

  const allPeople = [...members, ...newMembers];
  const todayBirthdays = getTodayBirthdays(allPeople);

  const navItems = [
    { id: "home", label: "홈", icon: "home" },
    { id: "members", label: "청년 명단", icon: "users" },
    { id: "attendance", label: "예배 출석", icon: "calendar" },
    { id: "sam", label: "샘 출석", icon: "group" },
    { id: "newmembers", label: "새가족", icon: "newuser" },
  ];

  const pageTitles = {
    home: { title: "학익교회 청년부 예배현황", sub: "오늘도 주님과 동행하세요 🙏" },
    members: { title: "청년 명단", sub: `전체 ${members.length}명` },
    attendance: { title: "예배 출석", sub: "주일예배 출석 체크" },
    sam: { title: "샘 모임", sub: "소그룹 출석 체크" },
    newmembers: { title: "새가족", sub: `등록 ${newMembers.length}명` },
  };

  const pages = {
    home: <HomePage members={members} newMembers={newMembers} sams={sams}
      attendance={attendance} setActiveNav={setActiveNav} todayBirthdays={todayBirthdays} />,
    members: <MembersPage members={members} setMembers={setMembers} sams={sams} setModal={setModal} />,
    attendance: <AttendancePage members={members} attendance={attendance}
      setAttendance={setAttendance} sams={sams} />,
    sam: <SamAttendancePage members={members} sams={sams} setSams={setSams}
      samAttendance={samAttendance} setSamAttendance={setSamAttendance} setModal={setModal} />,
    newmembers: <NewMembersPage newMembers={newMembers} setNewMembers={setNewMembers} setModal={setModal} />,
  };

  return (
    <>
      <style>{css}</style>
      <div className="app-wrapper">
        {/* Header */}
        <div className="app-header">
          <div className="header-top">
            <div className="header-title-block">
              <div className="header-title">{pageTitles[activeNav]?.title}</div>
              <div className="header-sub">{pageTitles[activeNav]?.sub}</div>
            </div>
            {/* 생일 알림 뱃지 */}
            {todayBirthdays.length > 0 && (
              <div style={{ position: "relative", marginRight: 4, cursor: "pointer" }}
                onClick={() => setActiveNav("home")}>
                <Icon name="cake" size={22} color="#F97316" />
                <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16,
                  background: "#EF4444", borderRadius: "50%", fontSize: 10, fontWeight: 700,
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {todayBirthdays.length}
                </div>
              </div>
            )}
            {activeNav === "members" && (
              <button className="btn-icon" onClick={() => setModal({ type: "addMember" })}>
                <Icon name="plus" size={16} />
              </button>
            )}
            {activeNav === "newmembers" && (
              <button className="btn-icon" onClick={() => setModal({ type: "addNewMember" })}>
                <Icon name="plus" size={16} />
              </button>
            )}
            {activeNav === "sam" && (
              <button className="btn-icon" onClick={() => setModal({ type: "addSam" })}>
                <Icon name="plus" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Pages */}
        <div className="page-content">{pages[activeNav]}</div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}>
              <Icon name={item.icon} size={22} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Modals */}
        {modal?.type === "addMember" && (
          <MemberFormModal sams={sams}
            onSave={(m) => { setMembers((p) => [...p, { ...m, id: uid() }]); closeModal(); }}
            onClose={closeModal} />
        )}
        {modal?.type === "editMember" && (
          <MemberFormModal sams={sams} initial={modal.member}
            onSave={(m) => { setMembers((p) => p.map((x) => x.id === modal.member.id ? { ...x, ...m } : x)); closeModal(); }}
            onClose={closeModal} />
        )}
        {modal?.type === "addSam" && (
          <AddSamModal onSave={(name) => { setSams((p) => [...p, { id: uid(), name }]); closeModal(); }} onClose={closeModal} />
        )}
        {modal?.type === "addNewMember" && (
          <NewMemberFormModal
            onSave={(m) => { setNewMembers((p) => [...p, { ...m, id: uid(), edu: [false, false, false, false] }]); closeModal(); }}
            onClose={closeModal} />
        )}
        {modal?.type === "editNewMember" && (
          <NewMemberFormModal initial={modal.member}
            onSave={(m) => { setNewMembers((p) => p.map((x) => x.id === modal.member.id ? { ...x, ...m } : x)); closeModal(); }}
            onClose={closeModal} />
        )}
      </div>
    </>
  );
}

// ==================== HOME PAGE ====================
function HomePage({ members, newMembers, sams, attendance, setActiveNav, todayBirthdays }) {
  const todayStr = today();
  const todayAttendance = attendance[todayStr] || {};
  const presentToday = Object.values(todayAttendance).filter(Boolean).length;

  const allPeople = [...members, ...newMembers];
  const thisMonthBirthdays = getThisMonthBirthdays(allPeople);

  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");

  const alerts = members.map((m) => {
    const weeks = getAbsentWeeks(m.id, attendance);
    if (weeks !== null && weeks >= 4) return { member: m, weeks };
    return null;
  }).filter(Boolean).sort((a, b) => b.weeks - a.weeks);

  return (
    <div>
      <div className="home-banner">
        <div className="home-banner-title">청년부 예배 현황</div>
        <div className="home-banner-sub">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </div>
      </div>

      {/* 오늘 생일 배너 */}
      {todayBirthdays.length > 0 && (
        <div className="birthday-banner">
          <div className="birthday-banner-title">🎂 오늘의 생일자</div>
          {todayBirthdays.map((m) => (
            <div key={m.id} className="birthday-person">
              <div className="birthday-avatar">{m.name.charAt(0)}</div>
              <div>
                <div className="birthday-name">🎉 {m.name}</div>
                <div className="birthday-detail">
                  {m.gender === "male" ? "남" : "여"}
                  {m.birthYear && ` · ${m.birthYear}년생`}
                  {m.phone && ` · ${m.phone}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 통계 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{members.length}</div>
          <div className="stat-label">전체 청년</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: "#10B981" }}>{presentToday}</div>
          <div className="stat-label">오늘 출석</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: "#F59E0B" }}>{sams.length}</div>
          <div className="stat-label">샘 그룹 수</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: "#8B5CF6" }}>{newMembers.length}</div>
          <div className="stat-label">새가족</div>
        </div>
      </div>

      {/* 바로가기 */}
      <div className="quick-grid">
        <button className="quick-action" onClick={() => setActiveNav("attendance")}>
          <div className="quick-action-icon" style={{ background: "#EFF6FF" }}>
            <Icon name="calendar" size={20} color="#2563EB" />
          </div>
          <div className="quick-action-label">예배 출석 체크</div>
        </button>
        <button className="quick-action" onClick={() => setActiveNav("sam")}>
          <div className="quick-action-icon" style={{ background: "#ECFDF5" }}>
            <Icon name="group" size={20} color="#10B981" />
          </div>
          <div className="quick-action-label">샘 출석 체크</div>
        </button>
        <button className="quick-action" onClick={() => setActiveNav("members")}>
          <div className="quick-action-icon" style={{ background: "#FDF2F8" }}>
            <Icon name="users" size={20} color="#DB2777" />
          </div>
          <div className="quick-action-label">청년 명단</div>
        </button>
        <button className="quick-action" onClick={() => setActiveNav("newmembers")}>
          <div className="quick-action-icon" style={{ background: "#FFFBEB" }}>
            <Icon name="newuser" size={20} color="#D97706" />
          </div>
          <div className="quick-action-label">새가족 관리</div>
        </button>
      </div>

      {/* 이번달 생일자 */}
      {thisMonthBirthdays.length > 0 && (
        <>
          <div className="section-header">
            <div className="section-title">🎂 {parseInt(mm)}월 생일자</div>
            <span className="badge badge-yellow">{thisMonthBirthdays.length}명</span>
          </div>
          {thisMonthBirthdays.map((m) => (
            <div key={m.id} className={`month-birthday-item ${m.isToday ? "today" : ""}`}>
              <div className={`birthday-date-badge ${m.isToday ? "today" : ""}`}>
                <span className="bday-month">{mm}월</span>
                <span className="bday-day">{m.dayNum}</span>
              </div>
              <div className={`member-avatar ${m.gender}`} style={{ width: 34, height: 34, fontSize: 13 }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
                  {m.name} {m.isToday && "🎉"}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>
                  {m.gender === "male" ? "남" : "여"}
                  {m.birthYear && ` · ${m.birthYear}년생`}
                  {m.isToday && <span style={{ color: "#F97316", fontWeight: 600 }}> · 오늘!</span>}
                  {m.isPast && !m.isToday && <span style={{ color: "#CBD5E1" }}> · 지남</span>}
                </div>
              </div>
              {m.phone && (
                <a href={`tel:${m.phone}`} style={{ flexShrink: 0, color: "#2563EB" }}>
                  <Icon name="phone" size={18} />
                </a>
              )}
            </div>
          ))}
          <div style={{ marginBottom: 16 }} />
        </>
      )}

      {/* 장기결석 알림 */}
      {alerts.length > 0 && (
        <>
          <div className="section-header">
            <div className="section-title">⚠️ 장기 결석 알림</div>
            <span className="badge badge-red">{alerts.length}명</span>
          </div>
          {alerts.map(({ member, weeks }) => (
            <div key={member.id} className={`alert-item ${weeks >= 8 ? "weekly" : "warn"}`}>
              <div style={{ marginTop: 1 }}>
                <Icon name="bell" size={16} color={weeks >= 8 ? "#EF4444" : "#F59E0B"} />
              </div>
              <div className="alert-text">
                <div className="alert-title">{member.name}</div>
                <div className="alert-sub">
                  {weeks >= 8 ? `🔴 ${weeks}주째 결석 — 매주 확인 필요` : `🟡 ${weeks}주째 결석 — 연락 필요`}
                  {member.phone && (
                    <> · <a href={`tel:${member.phone}`} className="phone-link">{member.phone}</a></>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ==================== MEMBERS PAGE ====================
function MembersPage({ members, setMembers, sams, setModal }) {
  const [search, setSearch] = useState("");
  const [filterSam, setFilterSam] = useState("all");

  const filtered = members.filter((m) => {
    const matchSearch = m.name.includes(search) || (m.phone || "").includes(search);
    const matchSam = filterSam === "all" || m.samId === filterSam;
    return matchSearch && matchSam;
  });

  const deleteMember = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) setMembers((p) => p.filter((m) => m.id !== id));
  };

  const getSamName = (samId) => sams.find((s) => s.id === samId)?.name || "";

  return (
    <div>
      <div className="search-bar">
        <span className="search-icon"><Icon name="users" size={16} /></span>
        <input placeholder="이름 또는 전화번호 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        <button className={`btn btn-sm ${filterSam === "all" ? "btn-primary" : "btn-secondary"}`}
          style={{ whiteSpace: "nowrap", padding: "6px 14px" }} onClick={() => setFilterSam("all")}>전체</button>
        {sams.map((s) => (
          <button key={s.id} className={`btn btn-sm ${filterSam === s.id ? "btn-primary" : "btn-secondary"}`}
            style={{ whiteSpace: "nowrap", padding: "6px 14px" }} onClick={() => setFilterSam(s.id)}>
            {s.name}샘
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-text">청년이 없습니다</div>
          <div className="empty-state-sub">우측 상단 + 버튼으로 등록하세요</div>
        </div>
      ) : (
        filtered.map((m) => (
          <div key={m.id} className="member-item">
            <div className={`member-avatar ${m.gender}`}>{m.name.charAt(0)}</div>
            <div className="member-info">
              <div className="member-name">{m.name}</div>
              <div className="member-meta">
                <span className={`badge ${m.gender === "male" ? "badge-blue" : "badge-pink"}`} style={{ marginRight: 4 }}>
                  {m.gender === "male" ? "남" : "여"}
                </span>
                {getSamName(m.samId) && <span className="badge badge-green">{getSamName(m.samId)}샘</span>}
                {m.birthYear && <span style={{ marginLeft: 4 }}>· {m.birthYear}년생</span>}
                {m.birthday && <span style={{ marginLeft: 4 }}>· 🎂{m.birthday}</span>}
              </div>
              {m.phone && (
                <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="phone" size={11} color="#94A3B8" />
                  <a href={`tel:${m.phone}`} className="phone-link">{m.phone}</a>
                </div>
              )}
            </div>
            <div className="member-actions">
              <button className="btn-icon" onClick={() => setModal({ type: "editMember", member: m })}>
                <Icon name="edit" size={14} />
              </button>
              <button className="btn-icon danger" onClick={() => deleteMember(m.id)}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ==================== ATTENDANCE PAGE ====================
function AttendancePage({ members, attendance, setAttendance, sams }) {
  const [selectedDate, setSelectedDate] = useState(today());
  const [tab, setTab] = useState("check");
  const [filterSam, setFilterSam] = useState("all");

  const dayAttendance = attendance[selectedDate] || {};
  const toggle = (memberId) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedDate]: { ...(prev[selectedDate] || {}), [memberId]: !prev[selectedDate]?.[memberId] },
    }));
  };
  const filteredMembers = filterSam === "all" ? members : members.filter((m) => m.samId === filterSam);
  const presentCount = filteredMembers.filter((m) => dayAttendance[m.id]).length;
  const allDates = Object.keys(attendance).sort().reverse().slice(0, 5);
  const getSamName = (samId) => sams.find((s) => s.id === samId)?.name || "";

  return (
    <div>
      <div className="tab-bar">
        <button className={`tab-item ${tab === "check" ? "active" : ""}`} onClick={() => setTab("check")}>출석 체크</button>
        <button className={`tab-item ${tab === "summary" ? "active" : ""}`} onClick={() => setTab("summary")}>출석 현황</button>
      </div>
      {tab === "check" ? (
        <>
          <div className="date-row">
            <input type="date" className="date-input-styled" value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#10B981" }}>{presentCount}</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>/ {filteredMembers.length}명</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
            <button className={`btn btn-sm ${filterSam === "all" ? "btn-primary" : "btn-secondary"}`}
              style={{ whiteSpace: "nowrap", padding: "6px 14px" }} onClick={() => setFilterSam("all")}>전체</button>
            {sams.map((s) => (
              <button key={s.id} className={`btn btn-sm ${filterSam === s.id ? "btn-primary" : "btn-secondary"}`}
                style={{ whiteSpace: "nowrap", padding: "6px 14px" }} onClick={() => setFilterSam(s.id)}>
                {s.name}샘
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>{formatDate(selectedDate)} ({getDayLabel(selectedDate)})</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm"
                onClick={() => { const all = {}; filteredMembers.forEach((m) => (all[m.id] = true));
                  setAttendance((prev) => ({ ...prev, [selectedDate]: { ...(prev[selectedDate] || {}), ...all } })); }}>
                전체 출석
              </button>
              <button className="btn btn-danger btn-sm"
                onClick={() => { const all = {}; filteredMembers.forEach((m) => (all[m.id] = false));
                  setAttendance((prev) => ({ ...prev, [selectedDate]: { ...(prev[selectedDate] || {}), ...all } })); }}>
                전체 결석
              </button>
            </div>
          </div>
          {filteredMembers.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">등록된 청년이 없습니다</div></div>
          ) : (
            filteredMembers.map((m) => {
              const isPresent = !!dayAttendance[m.id];
              const absentWeeks = getAbsentWeeks(m.id, attendance);
              return (
                <div key={m.id} className="member-item" style={{ cursor: "pointer" }} onClick={() => toggle(m.id)}>
                  <div className={`member-avatar ${m.gender}`}>{m.name.charAt(0)}</div>
                  <div className="member-info">
                    <div className="member-name">{m.name}</div>
                    <div className="member-meta">
                      {getSamName(m.samId) && <span className="badge badge-green" style={{ marginRight: 4 }}>{getSamName(m.samId)}샘</span>}
                      {absentWeeks !== null && absentWeeks >= 4 && !isPresent && (
                        <span className={`badge ${absentWeeks >= 8 ? "badge-red" : "badge-yellow"}`}>{absentWeeks}주 결석</span>
                      )}
                    </div>
                  </div>
                  <button className={`attendance-check-btn ${isPresent ? "checked" : ""}`}
                    onClick={(e) => { e.stopPropagation(); toggle(m.id); }}>
                    {isPresent && <Icon name="check" size={14} />}
                  </button>
                </div>
              );
            })
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>최근 5주 출석 현황</div>
          {allDates.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-text">출석 기록이 없습니다</div></div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    {allDates.map((d) => (
                      <th key={d}>{formatDate(d).slice(5)}<br /><span style={{ fontWeight: 400 }}>({getDayLabel(d)})</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      {allDates.map((d) => (
                        <td key={d}>{attendance[d]?.[m.id] ? <span className="dot-present">✓</span> : <span className="dot-absent" />}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ==================== SAM ATTENDANCE PAGE ====================
function SamAttendancePage({ members, sams, setSams, samAttendance, setSamAttendance, setModal }) {
  const [selectedDate, setSelectedDate] = useState(today());
  const [selectedSam, setSelectedSam] = useState(null);
  const [tab, setTab] = useState("check");

  useEffect(() => { if (sams.length > 0 && !selectedSam) setSelectedSam(sams[0].id); }, [sams]);

  const samMembers = members.filter((m) => m.samId === selectedSam);
  const dayKey = `${selectedSam}_${selectedDate}`;
  const dayAttendance = samAttendance[dayKey] || {};
  const toggle = (memberId) => {
    setSamAttendance((prev) => ({ ...prev, [dayKey]: { ...(prev[dayKey] || {}), [memberId]: !prev[dayKey]?.[memberId] } }));
  };
  const deleteSam = (id) => {
    if (confirm("샘을 삭제하시겠습니까?")) {
      setSams((p) => p.filter((s) => s.id !== id));
      if (selectedSam === id) setSelectedSam(sams.find((s) => s.id !== id)?.id || null);
    }
  };
  const presentCount = samMembers.filter((m) => dayAttendance[m.id]).length;
  const allDates = [...new Set(
    Object.keys(samAttendance).filter((k) => k.startsWith((selectedSam || "") + "_"))
      .map((k) => k.replace((selectedSam || "") + "_", ""))
  )].sort().reverse().slice(0, 5);

  return (
    <div>
      {sams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <div className="empty-state-text">샘 그룹이 없습니다</div>
          <div className="empty-state-sub">상단 + 버튼으로 샘을 추가하세요</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
            {sams.map((s) => (
              <button key={s.id} className={`btn btn-sm ${selectedSam === s.id ? "btn-primary" : "btn-secondary"}`}
                style={{ whiteSpace: "nowrap", padding: "6px 14px" }} onClick={() => setSelectedSam(s.id)}>
                {s.name}샘
              </button>
            ))}
          </div>
          {selectedSam && (
            <>
              <div className="sam-card">
                <div className="sam-icon"><Icon name="group" size={20} color="white" /></div>
                <div className="sam-info">
                  <div className="sam-name">{sams.find((s) => s.id === selectedSam)?.name}샘</div>
                  <div className="sam-count">구성원 {samMembers.length}명</div>
                </div>
                <button className="btn-icon danger" onClick={() => deleteSam(selectedSam)}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
              <div className="tab-bar">
                <button className={`tab-item ${tab === "check" ? "active" : ""}`} onClick={() => setTab("check")}>출석 체크</button>
                <button className={`tab-item ${tab === "summary" ? "active" : ""}`} onClick={() => setTab("summary")}>출석 현황</button>
              </div>
              {tab === "check" ? (
                <>
                  <div className="date-row">
                    <input type="date" className="date-input-styled" value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)} />
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#10B981" }}>{presentCount}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>/ {samMembers.length}명</div>
                    </div>
                  </div>
                  {samMembers.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">👤</div>
                      <div className="empty-state-text">배정된 청년이 없습니다</div>
                      <div className="empty-state-sub">청년 명단에서 샘을 배정해주세요</div>
                    </div>
                  ) : (
                    samMembers.map((m) => (
                      <div key={m.id} className="member-item" style={{ cursor: "pointer" }} onClick={() => toggle(m.id)}>
                        <div className={`member-avatar ${m.gender}`}>{m.name.charAt(0)}</div>
                        <div className="member-info">
                          <div className="member-name">{m.name}</div>
                          <div className="member-meta">
                            {m.gender === "male" ? "남" : "여"}
                            {m.birthYear && ` · ${m.birthYear}년생`}
                            {m.phone && (
                              <> · <a href={`tel:${m.phone}`} className="phone-link"
                                onClick={(e) => e.stopPropagation()}>{m.phone}</a></>
                            )}
                          </div>
                        </div>
                        <button className={`attendance-check-btn ${dayAttendance[m.id] ? "checked" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggle(m.id); }}>
                          {dayAttendance[m.id] && <Icon name="check" size={14} />}
                        </button>
                      </div>
                    ))
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>최근 5회 출석 현황</div>
                  {allDates.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-text">출석 기록이 없습니다</div></div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table className="summary-table">
                        <thead>
                          <tr>
                            <th>이름</th>
                            {allDates.map((d) => <th key={d}>{formatDate(d).slice(5)}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {samMembers.map((m) => (
                            <tr key={m.id}>
                              <td>{m.name}</td>
                              {allDates.map((d) => {
                                const k = `${selectedSam}_${d}`;
                                return <td key={d}>{samAttendance[k]?.[m.id] ? <span className="dot-present">✓</span> : <span className="dot-absent" />}</td>;
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ==================== NEW MEMBERS PAGE ====================
function NewMembersPage({ newMembers, setNewMembers, setModal }) {
  const [search, setSearch] = useState("");
  const filtered = newMembers.filter((m) => m.name.includes(search));

  const toggleEdu = (id, week) => {
    setNewMembers((prev) => prev.map((m) => {
      if (m.id !== id) return m;
      const edu = [...m.edu]; edu[week] = !edu[week]; return { ...m, edu };
    }));
  };
  const deleteMember = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) setNewMembers((p) => p.filter((m) => m.id !== id));
  };

  return (
    <div>
      <div className="search-bar">
        <span className="search-icon"><Icon name="users" size={16} /></span>
        <input placeholder="이름으로 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌟</div>
          <div className="empty-state-text">새가족이 없습니다</div>
          <div className="empty-state-sub">우측 상단 + 버튼으로 등록하세요</div>
        </div>
      ) : (
        filtered.map((m) => {
          const eduDone = m.edu.filter(Boolean).length;
          return (
            <div key={m.id} className="card" style={{ padding: "14px 14px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div className={`member-avatar ${m.gender}`} style={{ width: 38, height: 38, fontSize: 14 }}>
                  {m.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>
                    <span className={`badge ${m.gender === "male" ? "badge-blue" : "badge-pink"}`} style={{ marginRight: 4 }}>
                      {m.gender === "male" ? "남" : "여"}
                    </span>
                    {m.birthYear && `${m.birthYear}년생`}
                    {m.birthday && ` · 🎂${m.birthday}`}
                  </div>
                  {m.phone && (
                    <div style={{ fontSize: 12, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="phone" size={11} color="#94A3B8" />
                      <a href={`tel:${m.phone}`} className="phone-link">{m.phone}</a>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn-icon" onClick={() => setModal({ type: "editNewMember", member: m })}>
                    <Icon name="edit" size={14} />
                  </button>
                  <button className="btn-icon danger" onClick={() => deleteMember(m.id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                새가족 교육 ({eduDone}/4주 완료)
                <div className="progress-bar-wrap" style={{ marginTop: 4 }}>
                  <div className="progress-bar-fill" style={{ width: `${(eduDone / 4) * 100}%` }} />
                </div>
              </div>
              <div className="edu-weeks">
                {["1주차", "2주차", "3주차", "4주차"].map((label, i) => (
                  <button key={i} className={`week-check ${m.edu[i] ? "done" : ""}`} onClick={() => toggleEdu(m.id, i)}>
                    {m.edu[i] ? "✓" : ""}<br /><span style={{ fontSize: 11 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ==================== MODALS ====================
function MemberFormModal({ sams, initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [gender, setGender] = useState(initial?.gender || "male");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [birthYear, setBirthYear] = useState(initial?.birthYear || "");
  const [birthday, setBirthday] = useState(initial?.birthday || "");
  const [samId, setSamId] = useState(initial?.samId || "");

  const submit = () => {
    if (!name.trim()) { alert("이름을 입력해주세요"); return; }
    onSave({ name: name.trim(), gender, phone: phone.trim(), birthYear, birthday, samId });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">{initial ? "청년 정보 수정" : "청년 등록"}</div>

        <div className="form-group">
          <label className="form-label">이름 <span style={{ color: "#EF4444" }}>*</span></label>
          <input className="form-input" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <GenderToggle gender={gender} setGender={setGender} />

        <div className="form-group">
          <label className="form-label">전화번호 <span className="optional">(선택)</span></label>
          <div className="input-with-icon">
            <span className="input-icon"><Icon name="phone" size={15} /></span>
            <input className="form-input" type="tel" placeholder="010-0000-0000"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">출생년도 <span className="optional">(선택)</span></label>
            <input className="form-input" placeholder="예) 1998" type="number"
              value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">생일 <span className="optional">(선택)</span></label>
            <input className="form-input" placeholder="MM/DD 예)03/15"
              value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">샘 배정 <span className="optional">(선택)</span></label>
          <select className="form-select" value={samId} onChange={(e) => setSamId(e.target.value)}>
            <option value="">샘 선택</option>
            {sams.map((s) => <option key={s.id} value={s.id}>{s.name}샘</option>)}
          </select>
        </div>

        <button className="btn btn-primary" onClick={submit}>
          <Icon name="check" size={16} color="white" />
          {initial ? "수정 완료" : "등록하기"}
        </button>
      </div>
    </div>
  );
}

function AddSamModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const submit = () => { if (!name.trim()) { alert("샘 이름을 입력해주세요"); return; } onSave(name.trim()); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">새 샘 추가</div>
        <div className="form-group">
          <label className="form-label">샘 이름</label>
          <input className="form-input" placeholder="예) 한나, 다윗, 요셉..." value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={submit}>
          <Icon name="plus" size={16} color="white" />샘 추가하기
        </button>
      </div>
    </div>
  );
}

function NewMemberFormModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [gender, setGender] = useState(initial?.gender || "male");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [birthYear, setBirthYear] = useState(initial?.birthYear || "");
  const [birthday, setBirthday] = useState(initial?.birthday || "");

  const submit = () => {
    if (!name.trim()) { alert("이름을 입력해주세요"); return; }
    onSave({ name: name.trim(), gender, phone: phone.trim(), birthYear, birthday, edu: initial?.edu || [false, false, false, false] });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">{initial ? "새가족 정보 수정" : "새가족 등록"}</div>

        <div className="form-group">
          <label className="form-label">이름 <span style={{ color: "#EF4444" }}>*</span></label>
          <input className="form-input" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <GenderToggle gender={gender} setGender={setGender} />

        <div className="form-group">
          <label className="form-label">전화번호 <span className="optional">(선택)</span></label>
          <div className="input-with-icon">
            <span className="input-icon"><Icon name="phone" size={15} /></span>
            <input className="form-input" type="tel" placeholder="010-0000-0000"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">출생년도 <span className="optional">(선택)</span></label>
            <input className="form-input" placeholder="예) 1998" type="number"
              value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">생일 <span className="optional">(선택)</span></label>
            <input className="form-input" placeholder="MM/DD 예)03/15"
              value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
        </div>

        <div className="info-hint">
          💡 새가족 교육 4주 이수 체크는 등록 후 명단에서 직접 체크할 수 있습니다
        </div>

        <button className="btn btn-primary" onClick={submit}>
          <Icon name="check" size={16} color="white" />
          {initial ? "수정 완료" : "등록하기"}
        </button>
      </div>
    </div>
  );
}
