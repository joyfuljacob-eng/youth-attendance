import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "./supabaseClient";

// ==================== ICONS ====================
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
    check: <polyline points="20 6 9 17 4 12" />,
    plus: (<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>),
    trash: (<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
    edit: (<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>),
    calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
    bell: (<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>),
    group: (<><circle cx="12" cy="8" r="3" /><path d="M6.5 17.5c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5" /><circle cx="4" cy="10" r="2" /><path d="M2 19c0-2 1.79-3.5 4-3.5" /><circle cx="20" cy="10" r="2" /><path d="M22 19c0-2-1.79-3.5-4-3.5" /></>),
    newuser: (<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></>),
    male: (<><circle cx="10" cy="14" r="5" /><line x1="19" y1="5" x2="14.14" y2="9.86" /><polyline points="15 5 19 5 19 9" /></>),
    female: (<><circle cx="12" cy="8" r="5" /><line x1="12" y1="13" x2="12" y2="21" /><line x1="9" y1="18" x2="15" y2="18" /></>),
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
    cake: (<><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v2" /><path d="M12 8v2" /><path d="M17 8v2" /><path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" /></>),
    refresh: (<><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>),
    shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>),
    assign: (<><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /><line x1="18" y1="11" x2="18" y2="17" /><line x1="15" y1="14" x2="21" y2="14" /></>),
    logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>),
    lock: (<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
    eye: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>),
    eyeoff: (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>),
    key: (<><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>),
    note: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>),
    pray: (<><path d="M12 2L8 7H4l3 3-1 5 6-3 6 3-1-5 3-3h-4z" /></>),
    back: (<polyline points="15 18 9 12 15 6" />),
    bullhorn: (<><path d="M3 9v6h4l5 5V4L7 9H3z" /><path d="M18 8a6 6 0 0 1 0 8" /></>),
    prayhand: (<><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
    contact: (<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></>),
    more: (<><circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ==================== UTILS ====================
const today = () => new Date().toISOString().split("T")[0];
const formatDate = (d) => { if (!d) return ""; const dt = new Date(d + "T00:00:00"); return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,"0")}.${String(dt.getDate()).padStart(2,"0")}`; };
const getDayLabel = (d) => { const days=["일","월","화","수","목","금","토"]; return days[new Date(d+"T00:00:00").getDay()]; };
const sortByName = (arr) => [...arr].sort((a, b) => a.name.localeCompare(b.name, "ko"));

// 생일 값 정규화 (저장 시 MM/DD 형식으로 변환)
const normalizeBirthday = (val) => {
  if(!val) return "";
  const parts = val.split("\/");
  if(parts.length !== 2) return val;
  const mm = parts[0].padStart(2,"0");
  const dd = parts[1].padStart(2,"0");
  if(!mm || !dd || mm==="00" || dd==="00") return "";
  return `${mm}/${dd}`;
};
const getAbsentWeeks = (memberId, list) => {
  const recs = list.filter(a => a.member_id === memberId && a.status === true).sort((a,b) => b.date.localeCompare(a.date));
  if (!recs.length) return null;
  return Math.floor((new Date() - new Date(recs[0].date + "T00:00:00")) / (7*24*60*60*1000));
};
const getTodayBirthdays = (members) => {
  const now = new Date();
  const md = `${String(now.getMonth()+1).padStart(2,"0")}/${String(now.getDate()).padStart(2,"0")}`;
  return members.filter(m => m.birthday && m.birthday.trim() === md);
};
const getThisMonthBirthdays = (members) => {
  const now = new Date(); const mm = String(now.getMonth()+1).padStart(2,"0"); const dd = now.getDate();
  return members.filter(m => m.birthday && m.birthday.startsWith(mm+"/"))
    .map(m => ({...m, dayNum: parseInt(m.birthday.split("/")[1]), isPast: parseInt(m.birthday.split("/")[1])<dd, isToday: parseInt(m.birthday.split("/")[1])===dd}))
    .sort((a,b) => a.dayNum - b.dayNum);
};

// 관리자 여부 판단 (youth 계정은 조회자)
const isAdmin = (email) => email && !email.startsWith("youth@");

// 새가족 메모 권한
// 작성 가능: leader0, leader1, leader2
// 열람만: leader3~7 (관리자)
// 접근불가: youth
const canWriteNewMemberMemo = (email) => {
  if(!email) return false;
  const id = email.replace("@hiyouth.com","");
  return ["leader0","leader1","leader2"].includes(id);
};
const canReadNewMemberMemo = (email) => {
  if(!email) return false;
  return isAdmin(email); // 모든 관리자 열람 가능 (youth 제외)
};

// 나눔 기록 권한
// 전체열람: leader0, leader1 (목사님)
// 본인것만: leader3~7 (샘장)
// 접근불가: leader2 (회장), youth
const canViewAllNotes = (email) => {
  if (!email) return false;
  const id = email.replace("@hiyouth.com", "");
  return id === "leader0" || id === "leader1";
};
const canViewOwnNotes = (email) => {
  if (!email) return false;
  const id = email.replace("@hiyouth.com", "");
  return ["leader3","leader4","leader5","leader6","leader7"].includes(id);
};
const canWriteNotes = (email) => canViewAllNotes(email) || canViewOwnNotes(email);

// ==================== STYLES ====================
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{--primary:#2563EB;--primary-light:#EFF6FF;--primary-dark:#1D4ED8;--danger:#EF4444;--danger-light:#FEF2F2;--success:#10B981;--success-light:#ECFDF5;--warning:#F59E0B;--warning-light:#FFFBEB;--military:#6B7280;--military-light:#F3F4F6;--gray-50:#F8FAFC;--gray-100:#F1F5F9;--gray-200:#E2E8F0;--gray-300:#CBD5E1;--gray-400:#94A3B8;--gray-500:#64748B;--gray-600:#475569;--gray-700:#334155;--gray-800:#1E293B;--gray-900:#0F172A;--white:#FFFFFF;--radius:12px;--radius-lg:16px;--shadow:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.06);--shadow-md:0 4px 6px rgba(0,0,0,0.07),0 2px 4px rgba(0,0,0,0.06);}
  html,body,#root{height:100%;font-family:'Noto Sans KR',sans-serif;background:var(--gray-50);color:var(--gray-800);-webkit-font-smoothing:antialiased;}
  .app-wrapper{max-width:430px;margin:0 auto;height:100vh;background:var(--white);display:flex;flex-direction:column;overflow:hidden;position:relative;}
  .app-header{background:var(--white);padding:16px 20px 10px;border-bottom:1px solid var(--gray-100);position:sticky;top:0;z-index:50;flex-shrink:0;}
  .header-top{display:flex;align-items:center;gap:10px;}
  .header-filter{padding:8px 0 4px;}
  .header-title-block{flex:1;}
  .header-title{font-family:'Montserrat',sans-serif;font-size:18px;font-weight:700;color:var(--gray-900);letter-spacing:-0.3px;}
  .header-sub{font-size:12px;color:var(--gray-400);margin-top:1px;}
  .bottom-nav{background:var(--white);border-top:1px solid var(--gray-100);display:flex;padding:8px 0 max(8px,env(safe-area-inset-bottom));flex-shrink:0;z-index:50;}
  .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 0;cursor:pointer;background:none;border:none;color:var(--gray-400);font-size:10px;font-family:'Noto Sans KR',sans-serif;transition:color 0.15s;}
  .nav-item.active{color:var(--primary);}
  .page-content{flex:1;overflow-y:auto;padding:16px;padding-bottom:24px;-webkit-overflow-scrolling:touch;}
  .card{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:16px;margin-bottom:12px;box-shadow:var(--shadow);}
  .btn{border:none;border-radius:var(--radius);font-family:'Noto Sans KR',sans-serif;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;white-space:nowrap;}
  .btn-primary{background:var(--primary);color:var(--white);padding:12px 20px;font-size:14px;width:100%;}
  .btn-primary:hover{background:var(--primary-dark);}
  .btn-primary:disabled{background:var(--gray-300);cursor:not-allowed;}
  .btn-secondary{background:var(--gray-100);color:var(--gray-700);padding:10px 16px;font-size:13px;}
  .btn-secondary:hover{background:var(--gray-200);}
  .btn-danger{background:var(--danger-light);color:var(--danger);padding:8px 12px;font-size:12px;}
  .btn-sm{padding:6px 12px !important;font-size:12px !important;border-radius:8px;width:auto !important;min-width:0 !important;line-height:1.4;}
  .btn-icon{background:var(--primary-light);color:var(--primary);border:none;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.15s;flex-shrink:0;}
  .btn-icon:hover{background:#dbeafe;}
  .btn-icon.danger{background:var(--danger-light);color:var(--danger);}
  .btn-icon.danger:hover{background:#fee2e2;}
  .form-group{margin-bottom:16px;}
  .form-label{font-size:13px;font-weight:500;color:var(--gray-600);margin-bottom:6px;display:block;}
  .form-label .optional{font-size:11px;color:var(--gray-400);font-weight:400;margin-left:4px;}
  .form-input{width:100%;padding:11px 14px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:14px;font-family:'Noto Sans KR',sans-serif;color:var(--gray-800);background:var(--white);outline:none;transition:border-color 0.15s;}
  .form-input:focus{border-color:var(--primary);}
  .form-select{width:100%;padding:11px 14px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:14px;font-family:'Noto Sans KR',sans-serif;color:var(--gray-800);background:var(--white);outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px;}
  .form-select:focus{border-color:var(--primary);}
  .form-row{display:flex;gap:10px;}
  .form-row .form-group{flex:1;}
  .input-with-icon{position:relative;}
  .input-with-icon .input-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--gray-400);pointer-events:none;}
  .input-with-icon .form-input{padding-left:38px;}
  .input-with-icon .input-icon-right{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--gray-400);cursor:pointer;background:none;border:none;padding:0;display:flex;align-items:center;}
  .input-with-icon .form-input.has-right-icon{padding-right:42px;}
  .gender-toggle{display:flex;gap:8px;}
  .gender-btn{flex:1;padding:10px;border:1.5px solid var(--gray-200);border-radius:var(--radius);background:var(--white);cursor:pointer;font-family:'Noto Sans KR',sans-serif;font-size:15px;font-weight:700;color:var(--gray-500);display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;}
  .gender-btn.male.active{border-color:#3B82F6;background:#EFF6FF;color:#2563EB;}
  .gender-btn.female.active{border-color:#EC4899;background:#FDF2F8;color:#DB2777;}
  .member-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border:1px solid var(--gray-200);border-radius:var(--radius);margin-bottom:6px;background:var(--white);transition:all 0.15s;}
  .member-item:hover{border-color:var(--primary);background:var(--primary-light);}
  .member-item.military-item{background:var(--military-light);border-color:var(--gray-300);}
  .member-item.military-item:hover{border-color:var(--military);background:#E5E7EB;}
  .member-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;}
  .member-avatar.male{background:#DBEAFE;color:#1D4ED8;}
  .member-avatar.female{background:#FCE7F3;color:#9D174D;}
  .member-avatar.military-av{background:#D1D5DB;color:#4B5563;}
  .member-info{flex:1;min-width:0;}
  .member-name{font-size:15px;font-weight:600;color:var(--gray-800);}
  .member-name.military-name{color:var(--gray-500);}
  .member-meta{font-size:12px;color:var(--gray-400);margin-top:2px;}
  .member-actions{display:flex;gap:6px;flex-shrink:0;}
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;}
  .badge-blue{background:var(--primary-light);color:var(--primary);}
  .badge-green{background:var(--success-light);color:var(--success);}
  .badge-red{background:var(--danger-light);color:var(--danger);}
  .badge-yellow{background:var(--warning-light);color:#D97706;}
  .badge-pink{background:#FDF2F8;color:#DB2777;}
  .badge-military{background:#D1D5DB;color:#374151;}
  .badge-viewer{background:#F0FDF4;color:#166534;}
  .attendance-check-btn{width:36px;height:36px;border-radius:50%;border:2px solid var(--gray-200);background:var(--white);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;flex-shrink:0;}
  .attendance-check-btn.checked{background:var(--success);border-color:var(--success);color:var(--white);}
  .attendance-check-btn.military-skip{background:var(--military-light);border-color:var(--gray-300);cursor:default;font-size:14px;}
  .date-row{display:flex;align-items:center;gap:10px;margin-bottom:16px;}
  .date-input-styled{flex:1;padding:10px 14px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:14px;font-family:'Noto Sans KR',sans-serif;color:var(--gray-800);background:var(--white);outline:none;}
  .date-input-styled:focus{border-color:var(--primary);}
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
  .stat-card{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius);padding:10px;text-align:center;}
  .stat-number{font-family:'Montserrat',sans-serif;font-size:24px;font-weight:700;color:var(--primary);line-height:1;margin-bottom:2px;}
  .stat-label{font-size:11px;color:var(--gray-500);}
  .alert-item{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:var(--radius);margin-bottom:8px;}
  .alert-item.warn{background:var(--warning-light);border-left:3px solid var(--warning);}
  .alert-item.danger{background:var(--danger-light);border-left:3px solid var(--danger);}
  .alert-item.weekly{background:#FFF1F2;border-left:3px solid #F43F5E;}
  .alert-text{flex:1;}
  .alert-title{font-size:13px;font-weight:600;color:var(--gray-800);}
  .alert-sub{font-size:12px;color:var(--gray-500);margin-top:2px;}
  .birthday-banner{background:linear-gradient(135deg,#F97316 0%,#EF4444 100%);border-radius:var(--radius-lg);padding:16px 18px;color:white;margin-bottom:14px;}
  .birthday-banner-title{font-size:14px;font-weight:700;margin-bottom:8px;}
  .birthday-person{display:flex;align-items:center;gap:10px;padding:8px 10px;background:rgba(255,255,255,0.2);border-radius:10px;margin-bottom:6px;}
  .birthday-person:last-child{margin-bottom:0;}
  .birthday-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;}
  .birthday-name{font-size:15px;font-weight:700;}
  .birthday-detail{font-size:12px;opacity:0.85;margin-top:1px;}
  .month-birthday-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--radius);margin-bottom:6px;background:var(--gray-50);border:1px solid var(--gray-100);}
  .month-birthday-item.today{background:#FFF7ED;border-color:#FED7AA;}
  .birthday-date-badge{width:40px;height:40px;border-radius:10px;background:var(--gray-200);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;color:var(--gray-600);}
  .birthday-date-badge.today{background:#F97316;color:white;}
  .bday-month{font-size:9px;font-weight:600;opacity:0.75;}
  .bday-day{font-size:16px;font-weight:800;line-height:1.1;}
  .edu-weeks{display:flex;gap:8px;margin-top:8px;}
  .week-check{flex:1;padding:8px 4px;border-radius:8px;text-align:center;cursor:pointer;font-size:12px;font-weight:600;background:var(--gray-100);color:var(--gray-400);transition:all 0.15s;border:none;font-family:'Noto Sans KR',sans-serif;}
  .week-check.done{background:var(--success);color:var(--white);box-shadow:0 2px 8px rgba(16,185,129,0.3);}
  .sam-card{background:var(--primary-light);border:1px solid #BFDBFE;border-radius:var(--radius);padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:8px;}
  .sam-icon{width:42px;height:42px;background:var(--primary);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--white);flex-shrink:0;}
  .sam-info{flex:1;}
  .sam-name{font-size:15px;font-weight:600;color:var(--gray-800);}
  .sam-count{font-size:12px;color:var(--gray-500);margin-top:2px;}
  .search-bar{position:relative;margin-bottom:14px;}
  .search-bar input{width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--gray-200);border-radius:var(--radius);font-size:14px;font-family:'Noto Sans KR',sans-serif;outline:none;background:var(--gray-50);}
  .search-bar input:focus{border-color:var(--primary);background:var(--white);}
  .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--gray-400);}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
  .modal-sheet{background:var(--white);border-radius:20px 20px 0 0;width:100%;max-width:430px;max-height:85vh;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:20px 20px max(32px,env(safe-area-inset-bottom));animation:slideUp 0.25s ease;display:flex;flex-direction:column;}
  .modal-sheet-scroll{flex:1;overflow-y:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch;}
  .modal-sheet-footer{padding:8px 0 max(20px,env(safe-area-inset-bottom));background:var(--white);flex-shrink:0;border-top:1px solid var(--gray-100);margin:0 -20px;padding-left:20px;padding-right:20px;}
  .modal-sheet.has-footer{padding-bottom:0;overflow:hidden;}
  .modal-sheet.has-footer .modal-sheet-scroll{overflow-y:auto;flex:1;}
  @keyframes slideUp{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
  .modal-handle{width:40px;height:4px;background:var(--gray-200);border-radius:2px;margin:0 auto 20px;}
  .modal-title{font-size:18px;font-weight:700;color:var(--gray-900);margin-bottom:20px;}
  .summary-table{width:100%;border-collapse:collapse;}
  .summary-table th{font-size:11px;font-weight:600;color:var(--gray-500);text-align:center;padding:6px 4px;border-bottom:1px solid var(--gray-200);}
  .summary-table td{text-align:center;padding:8px 4px;border-bottom:1px solid var(--gray-100);font-size:13px;}
  .summary-table td:first-child{text-align:left;font-weight:500;}
  .dot-present{width:20px;height:20px;background:var(--success);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700;}
  .dot-absent{width:20px;height:20px;background:var(--gray-200);border-radius:50%;display:inline-block;}
  .dot-military{width:20px;height:20px;background:#D1D5DB;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;}
  .tab-bar{display:flex;background:var(--gray-100);border-radius:10px;padding:3px;margin-bottom:16px;}
  .tab-item{flex:1;padding:8px;border-radius:8px;border:none;font-family:'Noto Sans KR',sans-serif;font-size:13px;font-weight:500;color:var(--gray-500);background:transparent;cursor:pointer;transition:all 0.15s;text-align:center;}
  .tab-item.active{background:var(--white);color:var(--primary);font-weight:600;box-shadow:var(--shadow);}
  .empty-state{text-align:center;padding:48px 20px;color:var(--gray-400);}
  .empty-state-icon{font-size:48px;margin-bottom:12px;}
  .empty-state-text{font-size:15px;font-weight:500;margin-bottom:6px;color:var(--gray-500);}
  .empty-state-sub{font-size:13px;}
  .home-banner{background:linear-gradient(135deg,#1D4ED8 0%,#2563EB 50%,#3B82F6 100%);border-radius:var(--radius-lg);padding:20px;color:white;margin-bottom:16px;position:relative;overflow:hidden;}
  .home-banner::after{content:'✝';position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:64px;opacity:0.1;}
  .home-banner-title{font-family:'Montserrat',sans-serif;font-size:20px;font-weight:800;margin-bottom:4px;}
  .home-banner-sub{font-size:13px;opacity:0.85;}
  .quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
  .quick-action{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius);padding:10px 12px;display:flex;flex-direction:row;align-items:center;gap:10px;cursor:pointer;transition:all 0.15s;box-shadow:var(--shadow);}
  .quick-action:hover{transform:translateY(-1px);box-shadow:var(--shadow-md);}
  .quick-action-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .quick-action-label{font-size:12px;font-weight:600;color:var(--gray-700);text-align:left;}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .section-title{font-size:15px;font-weight:700;color:var(--gray-800);}
  .progress-bar-wrap{background:var(--gray-200);border-radius:999px;height:6px;overflow:hidden;}
  .progress-bar-fill{height:100%;border-radius:999px;background:var(--success);transition:width 0.3s;}
  .phone-link{color:var(--primary);text-decoration:none;font-size:12px;}
  .phone-link:hover{text-decoration:underline;}
  .info-hint{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:12px 14px;margin-bottom:16px;font-size:13px;color:#1D4ED8;}
  .military-banner{background:linear-gradient(135deg,#4B5563 0%,#6B7280 100%);border-radius:var(--radius-lg);padding:14px 16px;color:white;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
  .military-banner-text{font-size:13px;font-weight:600;}
  .military-banner-sub{font-size:11px;opacity:0.8;margin-top:2px;}
  .military-divider{display:flex;align-items:center;gap:8px;margin:10px 0 8px;}
  .military-divider-line{flex:1;height:1px;background:var(--gray-200);}
  .military-divider-text{font-size:11px;color:var(--gray-400);font-weight:500;white-space:nowrap;}
  .assign-btn{background:linear-gradient(135deg,#059669,#10B981);color:white;border:none;border-radius:var(--radius);padding:10px 14px;font-size:13px;font-weight:600;font-family:'Noto Sans KR',sans-serif;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.15s;width:100%;justify-content:center;margin-top:10px;}
  .assign-btn:hover{opacity:0.9;}
  .loading-overlay{position:fixed;inset:0;background:rgba(255,255,255,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:999;gap:12px;}
  .spinner{width:36px;height:36px;border:3px solid var(--gray-200);border-top-color:var(--primary);border-radius:50%;animation:spin 0.8s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .loading-text{font-size:14px;color:var(--gray-500);}
  .military-toggle{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border:1.5px solid var(--gray-200);border-radius:var(--radius);margin-bottom:16px;cursor:pointer;transition:all 0.15s;}
  .military-toggle.active{border-color:#6B7280;background:#F3F4F6;}
  .military-toggle-label{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--gray-700);}
  .toggle-switch{width:44px;height:24px;background:var(--gray-200);border-radius:999px;position:relative;transition:background 0.2s;}
  .toggle-switch.on{background:#6B7280;}
  .toggle-knob{width:20px;height:20px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
  .toggle-switch.on .toggle-knob{transform:translateX(20px);}
  /* 나눔 기록 */
  .detail-page{position:fixed;inset:0;background:var(--white);z-index:100;display:flex;flex-direction:column;max-width:430px;margin:0 auto;}
  .detail-header{background:var(--white);padding:14px 16px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;gap:10px;flex-shrink:0;}
  .detail-header-title{font-size:16px;font-weight:700;color:var(--gray-900);flex:1;}
  .detail-content{flex:1;overflow-y:auto;padding:16px;padding-bottom:80px;}
  .member-profile-card{background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:var(--radius-lg);padding:18px;color:white;margin-bottom:16px;display:flex;align-items:center;gap:14px;}
  .member-profile-avatar{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;flex-shrink:0;}
  .member-profile-name{font-size:20px;font-weight:800;margin-bottom:4px;}
  .member-profile-meta{font-size:12px;opacity:0.85;}
  .note-card{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:14px;margin-bottom:10px;box-shadow:var(--shadow);}
  .note-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
  .note-date{font-size:13px;font-weight:700;color:var(--gray-800);}
  .note-method{font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;}
  .note-method.face{background:#DBEAFE;color:#1D4ED8;}
  .note-method.phone{background:#DCFCE7;color:#166534;}
  .note-method.chat{background:#FEF9C3;color:#854D0E;}
  .note-section{margin-bottom:8px;}
  .note-section-label{font-size:11px;font-weight:600;color:var(--gray-400);margin-bottom:3px;text-transform:uppercase;letter-spacing:0.3px;}
  .note-section-text{font-size:13px;color:var(--gray-700);line-height:1.6;white-space:pre-wrap;}
  .note-author{font-size:11px;color:var(--gray-400);margin-top:8px;text-align:right;}
  .note-prayer{background:#FDF2F8;border-left:3px solid #EC4899;border-radius:0 8px 8px 0;padding:8px 10px;margin-top:6px;}
  .note-prayer-text{font-size:13px;color:#9D174D;line-height:1.6;white-space:pre-wrap;}
  .fab{position:fixed;bottom:max(80px,calc(env(safe-area-inset-bottom)+80px));right:calc(50% - 215px + 16px);width:52px;height:52px;background:var(--primary);border-radius:50%;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,0.4);z-index:101;transition:transform 0.15s;}
  .fab:hover{transform:scale(1.05);}
  /* 더보기/공지/기도/결석 */
  .more-page-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;}
  .more-page-btn{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:16px 12px;display:flex;flex-direction:column;align-items:flex-start;gap:8px;cursor:pointer;transition:all 0.15s;box-shadow:var(--shadow);width:100%;}
  .more-page-btn:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);}
  .more-page-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;}
  .more-page-label{font-size:13px;font-weight:700;color:var(--gray-800);}
  .more-page-sub{font-size:11px;color:var(--gray-400);margin-top:1px;}
  .notice-card{background:var(--white);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:14px;margin-bottom:10px;box-shadow:var(--shadow);}
  .notice-card.schedule{border-left:3px solid #8B5CF6;}
  .notice-card.notice{border-left:3px solid var(--primary);}
  .notice-title{font-size:14px;font-weight:700;color:var(--gray-800);margin-bottom:4px;}
  .notice-content{font-size:13px;color:var(--gray-600);margin-top:8px;line-height:1.6;white-space:pre-wrap;}
  .prayer-card{background:var(--white);border:1px solid var(--gray-200);border-left:3px solid #DB2777;border-radius:var(--radius-lg);padding:14px;margin-bottom:10px;box-shadow:var(--shadow);}
  .prayer-card.answered{background:#F0FDF4;border-color:#A7F3D0;border-left-color:#10B981;opacity:0.85;}
  .prayer-member{font-size:13px;font-weight:700;color:var(--gray-800);margin-bottom:4px;}
  .prayer-content{font-size:13px;color:var(--gray-700);line-height:1.6;}
  .prayer-meta{font-size:11px;color:var(--gray-400);margin-top:8px;display:flex;align-items:center;justify-content:space-between;gap:6px;}
  .contact-done-btn{background:#ECFDF5;color:#10B981;border:1px solid #A7F3D0;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:600;font-family:'Noto Sans KR',sans-serif;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.15s;}
  .contact-done-btn:hover{background:#D1FAE5;}
  .contact-done-badge{background:#ECFDF5;color:#10B981;border-radius:20px;padding:2px 8px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;gap:3px;}
  /* 새가족 메모 */
  .member-item.inactive-item{background:#FFF7ED;border-color:#FED7AA;opacity:0.85;}
  .member-item.inactive-item:hover{border-color:#F97316;background:#FFEDD5;}
  .badge-inactive{background:#FEF3C7;color:#D97706;}
  .btn-restore{background:#ECFDF5;color:#10B981;border:1px solid #A7F3D0;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:600;font-family:'Noto Sans KR',sans-serif;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.15s;}
  .btn-restore:hover{background:#D1FAE5;}
  .btn-permanent-delete{background:#FEF2F2;color:#EF4444;border:1px solid #FECACA;border-radius:8px;padding:5px 10px;font-size:12px;font-weight:600;font-family:'Noto Sans KR',sans-serif;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.15s;}
  .btn-permanent-delete:hover{background:#FEE2E2;}
  .memo-btn{background:#F5F3FF;border:1px solid #DDD6FE;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;color:#7C3AED;font-family:'Noto Sans KR',sans-serif;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all 0.15s;width:100%;justify-content:center;margin-top:8px;}
  .memo-btn:hover{background:#EDE9FE;}
  .memo-card{background:#FAFAFA;border:1px solid var(--gray-200);border-radius:var(--radius);padding:12px;margin-bottom:8px;}
  .memo-date{font-size:11px;font-weight:600;color:var(--gray-500);margin-bottom:4px;display:flex;align-items:center;justify-content:space-between;}
  .memo-content{font-size:13px;color:var(--gray-800);line-height:1.6;white-space:pre-wrap;}
  .memo-author{font-size:11px;color:var(--gray-400);margin-top:5px;text-align:right;}
  /* 생일자 2열 그리드 */
  .birthday-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
  .birthday-grid-card{background:var(--gray-50);border:1px solid var(--gray-100);border-radius:var(--radius);padding:10px;display:flex;align-items:center;gap:8px;}
  .birthday-grid-card.today{background:#FFF7ED;border-color:#FED7AA;}
  .birthday-grid-badge{width:34px;height:34px;border-radius:8px;background:var(--gray-200);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;color:var(--gray-600);}
  .birthday-grid-badge.today{background:#F97316;color:white;}
  .birthday-grid-month{font-size:8px;font-weight:600;opacity:0.75;}
  .birthday-grid-day{font-size:14px;font-weight:800;line-height:1.1;}
  .birthday-grid-name{font-size:13px;font-weight:600;color:#1E293B;}
  .birthday-grid-sub{font-size:11px;color:#94A3B8;margin-top:1px;}
  /* 로그인 화면 */
  .login-wrapper{min-height:100vh;background:linear-gradient(135deg,#1D4ED8 0%,#2563EB 60%,#3B82F6 100%);display:flex;align-items:center;justify-content:center;padding:20px;}
  .login-box{background:white;border-radius:24px;padding:32px 28px;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.15);}
  .login-logo{text-align:center;margin-bottom:28px;}
  .login-logo-icon{width:72px;height:72px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:32px;}
  .login-title{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:800;color:var(--gray-900);margin-bottom:4px;}
  .login-sub{font-size:13px;color:var(--gray-400);}
  .login-error{background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:10px 14px;font-size:13px;color:#DC2626;margin-bottom:16px;text-align:center;}
  .login-btn{background:linear-gradient(135deg,#1D4ED8,#2563EB);color:white;border:none;border-radius:var(--radius);padding:13px 20px;font-size:15px;font-weight:600;font-family:'Noto Sans KR',sans-serif;cursor:pointer;width:100%;transition:all 0.15s;margin-top:4px;}
  .login-btn:hover{opacity:0.92;}
  .login-btn:disabled{opacity:0.6;cursor:not-allowed;}
  .login-domain{font-size:13px;color:var(--gray-400);background:var(--gray-50);border:1.5px solid var(--gray-200);border-radius:var(--radius);padding:11px 14px;white-space:nowrap;}
  .viewer-notice{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:10px 14px;font-size:12px;color:#166534;margin-top:16px;text-align:center;}
  /* 비번 변경 */
  .pw-change-box{background:var(--gray-50);border:1px solid var(--gray-200);border-radius:var(--radius-lg);padding:16px;margin-bottom:12px;}
  .pw-change-title{font-size:14px;font-weight:600;color:var(--gray-700);margin-bottom:12px;display:flex;align-items:center;gap:6px;}
`;

function GenderToggle({ gender, setGender }) {
  return (
    <div className="form-group">
      <label className="form-label">성별</label>
      <div className="gender-toggle">
        <button className={`gender-btn male ${gender==="male"?"active":""}`} onClick={()=>setGender("male")}>
          <Icon name="male" size={16} color={gender==="male"?"#2563EB":"#94A3B8"} />남
        </button>
        <button className={`gender-btn female ${gender==="female"?"active":""}`} onClick={()=>setGender("female")}>
          <Icon name="female" size={16} color={gender==="female"?"#DB2777":"#94A3B8"} />여
        </button>
      </div>
    </div>
  );
}

// 월/일 분리 생일 입력 컴포넌트
function BirthdayInput({ value, onChange }) {
  // value: "MM/DD" 형식
  const month = value ? value.split("/")[0] || "" : "";
  const day   = value ? value.split("/")[1] || "" : "";

  const monthRef = useRef();
  const dayRef   = useRef();

  const handleMonth = (e) => {
    const v = e.target.value.replace(/[^0-9]/g,"").slice(0,2);
    const m = parseInt(v);
    // 유효성: 1~12
    if(v !== "" && m > 12) return;
    const newVal = v && day ? `${v}/${day}` : v ? `${v}/` : "";
    onChange(v && day ? `${v}/${day}` : v);
    // 2자리 입력 완료 또는 2 이상 첫 자리면 일 칸으로 이동
    if(v.length === 2 || (v.length === 1 && parseInt(v) > 1)) {
      dayRef.current?.focus();
    }
  };

  const handleDay = (e) => {
    const v = e.target.value.replace(/[^0-9]/g,"").slice(0,2);
    const d = parseInt(v);
    if(v !== "" && d > 31) return;
    onChange(month && v ? `${month}/${v}` : month ? month : "");
  };

  const handleMonthKeyDown = (e) => {
    if(e.key === "/" || e.key === "." || e.key === "-") {
      e.preventDefault();
      dayRef.current?.focus();
    }
  };

  const handleDayKeyDown = (e) => {
    if(e.key === "Backspace" && !day) {
      monthRef.current?.focus();
    }
  };

  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{flex:1,position:"relative"}}>
        <input
          ref={monthRef}
          className="form-input"
          type="number"
          placeholder="월"
          value={month}
          onChange={handleMonth}
          onKeyDown={handleMonthKeyDown}
          min="1" max="12"
          style={{textAlign:"center",paddingLeft:8,paddingRight:8}}
        />
      </div>
      <span style={{color:"var(--gray-400)",fontWeight:600,fontSize:16,flexShrink:0}}>/</span>
      <div style={{flex:1,position:"relative"}}>
        <input
          ref={dayRef}
          className="form-input"
          type="number"
          placeholder="일"
          value={day}
          onChange={handleDay}
          onKeyDown={handleDayKeyDown}
          min="1" max="31"
          style={{textAlign:"center",paddingLeft:8,paddingRight:8}}
        />
      </div>
    </div>
  );
}

// ==================== 로그인 화면 ====================
function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId.trim()) { setError("아이디를 입력해주세요"); return; }
    if (!password.trim()) { setError("비밀번호를 입력해주세요"); return; }
    setError(""); setLoading(true);
    const email = `${userId.trim().toLowerCase()}@hiyouth.com`;
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다");
    } else {
      onLogin(data.user);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="login-wrapper">
      <style>{css}</style>
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-icon">✝</div>
          <div className="login-title">학익교회 청년부</div>
          <div className="login-sub">예배 & 샘모임 관리 시스템</div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">아이디</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input className="form-input" placeholder="예) leader0, youth" value={userId}
              onChange={e=>setUserId(e.target.value)} onKeyDown={handleKeyDown}
              style={{flex:1}} autoCapitalize="none" autoCorrect="off"/>
            <div className="login-domain">@hiyouth.com</div>
          </div>
        </div>
        <div className="form-group" style={{marginBottom:20}}>
          <label className="form-label">비밀번호</label>
          <div className="input-with-icon">
            <span className="input-icon"><Icon name="lock" size={15}/></span>
            <input className={`form-input has-right-icon`} type={showPw?"text":"password"}
              placeholder="비밀번호 입력" value={password}
              onChange={e=>setPassword(e.target.value)} onKeyDown={handleKeyDown}
              style={{paddingLeft:38}}/>
            <button className="input-icon-right" onClick={()=>setShowPw(!showPw)} type="button">
              <Icon name={showPw?"eyeoff":"eye"} size={16}/>
            </button>
          </div>
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
        <div className="viewer-notice">
          👀 조회 전용 계정: <strong>youth</strong> / hiyouth2026
        </div>
      </div>
    </div>
  );
}

// ==================== 비밀번호 변경 모달 ====================
function ChangePasswordModal({ onClose }) {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setError("");
    if (!current || !newPw || !confirm) { setError("모든 항목을 입력해주세요"); return; }
    if (newPw.length < 6) { setError("새 비밀번호는 6자리 이상이어야 합니다"); return; }
    if (newPw !== confirm) { setError("새 비밀번호가 일치하지 않습니다"); return; }
    setLoading(true);
    // 현재 비번 확인을 위해 재로그인
    const { data: { user } } = await supabase.auth.getUser();
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (signInErr) { setError("현재 비밀번호가 올바르지 않습니다"); setLoading(false); return; }
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (updateErr) { setError("비밀번호 변경에 실패했습니다"); }
    else { setSuccess(true); setTimeout(()=>onClose(), 1500); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">🔑 비밀번호 변경</div>
        {success ? (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:600,color:"#10B981"}}>비밀번호가 변경되었습니다!</div>
          </div>
        ) : (
          <>
            {error && <div className="login-error" style={{marginBottom:16}}>{error}</div>}
            <div className="form-group">
              <label className="form-label">현재 비밀번호</label>
              <div className="input-with-icon">
                <span className="input-icon"><Icon name="lock" size={15}/></span>
                <input className="form-input has-right-icon" type={showCurrent?"text":"password"}
                  placeholder="현재 비밀번호" value={current} onChange={e=>setCurrent(e.target.value)} style={{paddingLeft:38}}/>
                <button className="input-icon-right" onClick={()=>setShowCurrent(!showCurrent)} type="button">
                  <Icon name={showCurrent?"eyeoff":"eye"} size={16}/>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">새 비밀번호 <span className="optional">(6자리 이상)</span></label>
              <div className="input-with-icon">
                <span className="input-icon"><Icon name="key" size={15}/></span>
                <input className="form-input has-right-icon" type={showNew?"text":"password"}
                  placeholder="새 비밀번호" value={newPw} onChange={e=>setNewPw(e.target.value)} style={{paddingLeft:38}}/>
                <button className="input-icon-right" onClick={()=>setShowNew(!showNew)} type="button">
                  <Icon name={showNew?"eyeoff":"eye"} size={16}/>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">새 비밀번호 확인</label>
              <div className="input-with-icon">
                <span className="input-icon"><Icon name="key" size={15}/></span>
                <input className="form-input" type="password" placeholder="새 비밀번호 재입력"
                  value={confirm} onChange={e=>setConfirm(e.target.value)} style={{paddingLeft:38}}/>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleChange} disabled={loading}>
              <Icon name="check" size={16} color="white"/>
              {loading ? "변경 중..." : "비밀번호 변경"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [newMembers, setNewMembers] = useState([]);
  const [sams, setSams] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [samAttendanceList, setSamAttendanceList] = useState([]);
  const [activeNav, setActiveNav] = useState("home");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [noteCountMap, setNoteCountMap] = useState({});
  const [recentNotes, setRecentNotes] = useState([]);
  const [notices, setNotices] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [absenceContacts, setAbsenceContacts] = useState([]);
  const [newMemberMemos, setNewMemberMemos] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [eventGuests, setEventGuests] = useState([]);
  const [filterBar, setFilterBar] = useState(null); // 헤더에 표시할 필터바
  // 청년명단/예배참석/샘별참석 필터 상태 — App 레벨에서 관리해야 헤더에 안정적으로 반영
  const [membersTab, setMembersTab] = useState("active");
  const [membersFilterSam, setMembersFilterSam] = useState("all");
  const [attendanceTab, setAttendanceTab] = useState("check");
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceFilterSam, setAttendanceFilterSam] = useState("all");
  const [samSelected, setSamSelected] = useState(null);
  const [samTab, setSamTab] = useState("check");

  // 로그인 상태 확인
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const admin = user ? isAdmin(user.email) : false;

  const fetchAll = async () => {
    setLoading(true);
    const [m,nm,s,a,sa] = await Promise.all([
      supabase.from("members").select("*").order("created_at"),
      supabase.from("new_members").select("*").order("created_at"),
      supabase.from("sams").select("*").order("created_at"),
      supabase.from("attendance").select("*"),
      supabase.from("sam_attendance").select("*"),
    ]);
    if(m.data) setMembers(m.data);
    if(nm.data) setNewMembers(nm.data);
    if(s.data) setSams(s.data);
    if(a.data) setAttendanceList(a.data);
    if(sa.data) setSamAttendanceList(sa.data);

    // 나눔 기록 건수 및 최근 기록 fetch
    // noteCountMap은 전체 건수 (명단 뱃지용)
    const { data: notesData } = await supabase
      .from("pastoral_notes")
      .select("id, member_id, date, author_email")
      .order("date", { ascending: false });
    if(notesData) {
      const countMap = {};
      notesData.forEach(n => { countMap[n.member_id] = (countMap[n.member_id]||0)+1; });
      setNoteCountMap(countMap);

      // recentNotes는 권한에 따라 필터링
      // leader0, leader1 → 전체 / leader3~7 → 본인 작성만
      const userEmailNow = (await supabase.auth.getUser()).data.user?.email || "";
      if(canViewAllNotes(userEmailNow)) {
        setRecentNotes(notesData.slice(0,5));
      } else if(canViewOwnNotes(userEmailNow)) {
        setRecentNotes(notesData.filter(n=>n.author_email===userEmailNow).slice(0,5));
      } else {
        setRecentNotes([]);
      }
    }
    const [noticesRes,prayersRes,absenceRes,memosRes,eventsRes,participantsRes,guestsRes] = await Promise.all([
      supabase.from("notices").select("*").order("created_at",{ascending:false}),
      supabase.from("prayers").select("*").order("created_at",{ascending:false}),
      supabase.from("absence_contacts").select("*").order("contact_date",{ascending:false}),
      supabase.from("new_member_memos").select("*").order("date",{ascending:false}),
      supabase.from("events").select("*").order("event_date",{ascending:false}),
      supabase.from("event_participants").select("*"),
      supabase.from("event_guests").select("*"),
    ]);
    if(noticesRes.data) setNotices(noticesRes.data);
    if(prayersRes.data) setPrayers(prayersRes.data);
    if(absenceRes.data) setAbsenceContacts(absenceRes.data);
    if(memosRes.data) setNewMemberMemos(memosRes.data);
    if(eventsRes.data) setEvents(eventsRes.data);
    if(participantsRes.data) setEventParticipants(participantsRes.data);
    if(guestsRes.data) setEventGuests(guestsRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;
    await supabase.auth.signOut();
  };

  // nav 변경 시 filterBar 초기화
  const handleNavChange = (nav) => {
    setFilterBar(null);
    setActiveNav(nav);
  };
  const todayBirthdays = getTodayBirthdays([...members,...newMembers]);

  const saveMember = async (m) => { setSaving(true); await supabase.from("members").insert([{name:m.name,gender:m.gender,phone:m.phone,birth_year:m.birthYear,birthday:m.birthday,sam_id:m.samId||null,military:m.military||false,is_active:true}]); await fetchAll(); setSaving(false); closeModal(); };
  const updateMember = async (id,m) => { setSaving(true); await supabase.from("members").update({name:m.name,gender:m.gender,phone:m.phone,birth_year:m.birthYear,birthday:m.birthday,sam_id:m.samId||null,military:m.military||false}).eq("id",id); await fetchAll(); setSaving(false); closeModal(); };
  const deleteMember = async (id) => { if(!window.confirm("정말 삭제하시겠습니까?")) return; setSaving(true); await supabase.from("members").delete().eq("id",id); await fetchAll(); setSaving(false); };
  // 비활성 처리
  const inactivateMember = async (id, reason) => {
    setSaving(true);
    await supabase.from("members").update({is_active:false, inactive_reason:reason, inactive_at:today()}).eq("id",id);
    await fetchAll(); setSaving(false); closeModal();
  };
  // 비활성 → 복구
  const restoreMember = async (id) => {
    if(!window.confirm("해당 청년을 다시 활성화하시겠습니까?")) return;
    setSaving(true);
    await supabase.from("members").update({is_active:true, inactive_reason:null, inactive_at:null}).eq("id",id);
    await fetchAll(); setSaving(false);
  };
  // 완전 삭제 (비활성 탭에서만)
  const permanentDeleteMember = async (m) => {
    if(!window.confirm(`⚠️ 완전 삭제 확인\n\n${m.name} 님의 모든 데이터가\n영구적으로 삭제됩니다.\n\n삭제 후 복구가 불가능합니다.\n정말 삭제하시겠습니까?`)) return;
    setSaving(true);
    await supabase.from("members").delete().eq("id",m.id);
    await fetchAll(); setSaving(false);
  };
  const saveSam = async (name) => { setSaving(true); await supabase.from("sams").insert([{name}]); await fetchAll(); setSaving(false); closeModal(); };
  const deleteSam = async (id) => { if(!window.confirm("샘을 삭제하시겠습니까?")) return; setSaving(true); await supabase.from("sams").delete().eq("id",id); await fetchAll(); setSaving(false); };
  const toggleAttendance = async (memberId, date) => { const ex=attendanceList.find(a=>a.member_id===memberId&&a.date===date); setSaving(true); if(ex){await supabase.from("attendance").update({status:!ex.status}).eq("id",ex.id);}else{await supabase.from("attendance").insert([{member_id:memberId,date,status:true}]);} const {data}=await supabase.from("attendance").select("*"); if(data)setAttendanceList(data); setSaving(false); };
  const setAllAttendance = async (memberIds,date,status) => { setSaving(true); for(const memberId of memberIds){const ex=attendanceList.find(a=>a.member_id===memberId&&a.date===date); if(ex){await supabase.from("attendance").update({status}).eq("id",ex.id);}else{await supabase.from("attendance").insert([{member_id:memberId,date,status}]);}} const {data}=await supabase.from("attendance").select("*"); if(data)setAttendanceList(data); setSaving(false); };
  const toggleSamAttendance = async (memberId,samId,date) => { const ex=samAttendanceList.find(a=>a.member_id===memberId&&a.sam_id===samId&&a.date===date); setSaving(true); if(ex){await supabase.from("sam_attendance").update({status:!ex.status}).eq("id",ex.id);}else{await supabase.from("sam_attendance").insert([{member_id:memberId,sam_id:samId,date,status:true}]);} const {data}=await supabase.from("sam_attendance").select("*"); if(data)setSamAttendanceList(data); setSaving(false); };
  const saveNewMember = async (m) => {
    setSaving(true);
    await supabase.from("new_members").insert([{
      name:m.name, gender:m.gender, phone:m.phone,
      birth_year:m.birthYear, birthday:m.birthday,
      week1:false, week2:false, week3:false, week4:false,
      registered_at: m.registeredAt || today(),
    }]);
    await fetchAll(); setSaving(false); closeModal();
  };
  const updateNewMember = async (id,m) => { setSaving(true); await supabase.from("new_members").update({name:m.name,gender:m.gender,phone:m.phone,birth_year:m.birthYear,birthday:m.birthday,registered_at:m.registeredAt||today()}).eq("id",id); await fetchAll(); setSaving(false); closeModal(); };
  const deleteNewMember = async (id) => { if(!window.confirm("정말 삭제하시겠습니까?")) return; setSaving(true); await supabase.from("new_members").delete().eq("id",id); await fetchAll(); setSaving(false); };
  const toggleEdu = async (id, weekIdx) => {
    const member = newMembers.find(m=>m.id===id); if(!member) return;
    const key = `week${weekIdx+1}`;
    const newVal = !member[key];
    setSaving(true);
    const updateData = { [key]: newVal };
    // 4주차를 완료 체크할 때 edu_completed_at 자동 기록
    // 4주차를 해제할 때는 날짜 초기화
    if (weekIdx === 3) {
      updateData.edu_completed_at = newVal ? today() : null;
    }
    await supabase.from("new_members").update(updateData).eq("id", id);
    const {data} = await supabase.from("new_members").select("*").order("created_at");
    if(data) setNewMembers(data);
    setSaving(false);
  };
  const assignNewMemberToSam = async (newMember, samId) => {
    setSaving(true);
    await supabase.from("members").insert([{
      name: newMember.name, gender: newMember.gender,
      phone: newMember.phone, birth_year: newMember.birth_year,
      birthday: newMember.birthday, sam_id: samId||null, military: false,
      assigned_at: today(), // 샘 배정 날짜 자동 기록
      new_member_registered_at: newMember.registered_at||null, // 새가족 등록일 이력 보존
    }]);
    await supabase.from("new_members").delete().eq("id", newMember.id);
    await fetchAll(); setSaving(false); closeModal();
  };

  // 로그인 로딩 중
  if (authLoading) {
    return (
      <>
        <style>{css}</style>
        <div className="loading-overlay"><div className="spinner"/><div className="loading-text">로딩 중...</div></div>
      </>
    );
  }

  // 로그인 안 된 경우
  if (!user) return <LoginPage onLogin={setUser} />;

  const userId = user.email.replace("@hiyouth.com", "");

  const navItems = [
    {id:"home",label:"홈",icon:"home"},
    {id:"members",label:"청년 명단",icon:"users"},
    {id:"attendance",label:"예배참석",icon:"calendar"},
    {id:"sam",label:"샘별참석",icon:"group"},
    {id:"more",label:"더보기",icon:"more"},
  ];
  const pageTitles = {
    home:{title:"학익교회 청년부 예배현황",sub:"오늘도 주님을 예배합니다 🙏"},
    members:{title:"청년 명단",sub:`전체 ${members.length}명 · 군복무 ${members.filter(m=>m.military).length}명`},
    attendance:{title:"예배참석",sub:"주일예배 참석 체크"},
    sam:{title:"샘별참석",sub:"소그룹 참석 체크"},
    more:{title:"더보기",sub:"추가 기능 메뉴"},
    notices:{title:"공지 · 일정",sub:"청년부 소식"},
    prayers:{title:"기도제목",sub:"함께 기도해요 🙏"},
    absenceContact:{title:"결석자 연락",sub:"장기결석 연락 관리"},
    newmembers:{title:"새가족",sub:`등록 ${newMembers.length}명`},
    allNotes:{title:"나눔 기록 전체",sub:"전체 나눔 기록 목록"},
    excel:{title:"엑셀 내보내기",sub:"데이터 다운로드"},
    events:{title:"수련회 · 행사",sub:"행사 참가 관리"},
  };

  const pages = {
    home:<HomePage members={members} newMembers={newMembers} sams={sams} attendanceList={attendanceList} samAttendanceList={samAttendanceList} setActiveNav={handleNavChange} todayBirthdays={todayBirthdays} userEmail={user?.email} recentNotes={recentNotes} onSelectMember={setSelectedMember} notices={notices} />,
    members:<MembersPage members={members} sams={sams} setModal={setModal} onDelete={deleteMember} onInactivate={(id,reason)=>inactivateMember(id,reason)} onRestore={restoreMember} onPermanentDelete={permanentDeleteMember} admin={admin} userEmail={user?.email} onSelectMember={setSelectedMember} noteCountMap={noteCountMap} activeTab={membersTab} filterSam={membersFilterSam} />,
    attendance:<AttendancePage members={members} sams={sams} attendanceList={attendanceList} onToggle={toggleAttendance} onSetAll={setAllAttendance} admin={admin} tab={attendanceTab} selectedDate={attendanceDate} filterSam={attendanceFilterSam} />,
    sam:<SamAttendancePage members={members} sams={sams} samAttendanceList={samAttendanceList} onToggle={toggleSamAttendance} onDeleteSam={deleteSam} admin={admin} selectedSam={samSelected} setSelectedSam={setSamSelected} tab={samTab} />,
    more:<MorePage setActiveNav={setActiveNav} admin={admin} userEmail={user?.email} newMembersCount={newMembers.length} noticesCount={notices.filter(n=>!(n.category==="schedule"&&n.event_date&&n.event_date<today())).length} prayersCount={prayers.filter(p=>!p.is_answered).length} />,
    notices:<NoticePage notices={notices} admin={admin} userEmail={user?.email} onRefresh={fetchAll} setModal={setModal} />,
    prayers:<PrayerPage prayers={prayers} members={members} admin={admin} userEmail={user?.email} onRefresh={fetchAll} setModal={setModal} />,
    absenceContact:<AbsenceContactPage members={members} attendanceList={attendanceList} absenceContacts={absenceContacts} admin={admin} userEmail={user?.email} onRefresh={fetchAll} />,
    newmembers:<NewMembersPage newMembers={newMembers} sams={sams} setModal={setModal} onDelete={deleteNewMember} onToggleEdu={toggleEdu} onAssign={(nm)=>setModal({type:"assignSam",newMember:nm})} admin={admin} userEmail={user?.email} newMemberMemos={newMemberMemos} onRefresh={fetchAll} />,
    allNotes:<AllNotesPage members={members} sams={sams} userEmail={user?.email} onSelectMember={setSelectedMember} />,
    excel:<ExcelExportPage members={members} sams={sams} attendanceList={attendanceList} samAttendanceList={samAttendanceList} newMembers={newMembers} admin={admin} />,
    events:<EventsPage events={events} eventParticipants={eventParticipants} eventGuests={eventGuests} members={members} sams={sams} userEmail={user?.email} admin={admin} onRefresh={fetchAll} setActiveNav={setActiveNav} />,
  };

  return (
    <>
      <style>{css}</style>
      {(loading||saving) && <div className="loading-overlay"><div className="spinner"/><div className="loading-text">{loading?"데이터 불러오는 중...":"저장 중..."}</div></div>}
      <div className="app-wrapper">
        <div className="app-header">
          <div className="header-top">
            <div className="header-title-block">
              <div className="header-title">{pageTitles[activeNav]?.title}</div>
              <div className="header-sub">{pageTitles[activeNav]?.sub}</div>
            </div>
            {todayBirthdays.length>0 && (
              <div style={{position:"relative",marginRight:4,cursor:"pointer"}} onClick={()=>handleNavChange("home")}>
                <Icon name="cake" size={22} color="#F97316"/>
                <div style={{position:"absolute",top:-4,right:-4,width:16,height:16,background:"#EF4444",borderRadius:"50%",fontSize:10,fontWeight:700,color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>{todayBirthdays.length}</div>
              </div>
            )}
            <button className="btn-icon" style={{background:"transparent"}} onClick={fetchAll}><Icon name="refresh" size={16} color="#94A3B8"/></button>
            {admin && activeNav==="members" && <button className="btn-icon" onClick={()=>setModal({type:"addMember"})}><Icon name="plus" size={16}/></button>}
            {admin && activeNav==="newmembers" && <button className="btn-icon" onClick={()=>setModal({type:"addNewMember"})}><Icon name="plus" size={16}/></button>}
            {admin && activeNav==="sam" && <button className="btn-icon" onClick={()=>setModal({type:"addSam"})}><Icon name="plus" size={16}/></button>}
            {admin && activeNav==="notices" && <button className="btn-icon" onClick={()=>setModal({type:"addNotice"})}><Icon name="plus" size={16}/></button>}
            {admin && activeNav==="prayers" && <button className="btn-icon" onClick={()=>setModal({type:"addPrayer"})}><Icon name="plus" size={16}/></button>}
            {(activeNav==="notices"||activeNav==="prayers"||activeNav==="absenceContact"||activeNav==="newmembers"||activeNav==="allNotes"||activeNav==="excel"||activeNav==="events") && (
              <button className="btn-icon" style={{background:"var(--gray-100)",color:"var(--gray-600)"}} onClick={()=>handleNavChange(activeNav==="allNotes"?"home":"more")}>
                <Icon name="back" size={16}/>
              </button>
            )}
            <button className="btn-icon" style={{background:"transparent"}} onClick={()=>setModal({type:"myAccount"})} title={userId}>
              <div style={{width:28,height:28,borderRadius:"50%",background:admin?"#DBEAFE":"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:admin?"#1D4ED8":"#166534"}}>
                {userId.charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
          {/* 헤더 하단 필터바 — 청년명단/예배참석/샘별참석 */}
          {activeNav==="members"&&(
            <div className="header-filter">
              <div className="tab-bar" style={{marginBottom:membersTab==="active"?6:0}}>
                <button className={`tab-item ${membersTab==="active"?"active":""}`} onClick={()=>setMembersTab("active")}>일반 ({sortByName(members.filter(m=>m.is_active!==false&&!m.military)).length}명)</button>
                <button className={`tab-item ${membersTab==="military"?"active":""}`} onClick={()=>setMembersTab("military")}>🪖 군복무 ({members.filter(m=>m.is_active!==false&&m.military).length}명)</button>
                <button className={`tab-item ${membersTab==="inactive"?"active":""}`} onClick={()=>setMembersTab("inactive")}>🚪 비활성 ({members.filter(m=>m.is_active===false).length}명)</button>
              </div>
              {membersTab==="active"&&(
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
                  <button className={`btn btn-sm ${membersFilterSam==="all"?"btn-primary":"btn-secondary"}`} style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setMembersFilterSam("all")}>전체 ({members.filter(m=>m.is_active!==false&&!m.military).length}명)</button>
                  {sams.map(s=>{
                    const total=members.filter(m=>m.sam_id===s.id&&m.is_active!==false).length;
                    const mil=members.filter(m=>m.sam_id===s.id&&m.military&&m.is_active!==false).length;
                    return(<button key={s.id} className={`btn btn-sm ${membersFilterSam===s.id?"btn-primary":"btn-secondary"}`} style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setMembersFilterSam(s.id)}>{s.name}샘 ({total}명{mil>0?` 🪖${mil}`:""})</button>);
                  })}
                  {members.filter(m=>!m.sam_id&&m.is_active!==false&&!m.military).length>0&&(
                    <button className={`btn btn-sm ${membersFilterSam==="unassigned"?"btn-primary":"btn-secondary"}`}
                      style={{whiteSpace:"nowrap",flexShrink:0,background:membersFilterSam==="unassigned"?"#EA580C":"var(--gray-100)",color:membersFilterSam==="unassigned"?"white":"#C2410C"}}
                      onClick={()=>setMembersFilterSam("unassigned")}>⚠️ 미지정 ({members.filter(m=>!m.sam_id&&m.is_active!==false&&!m.military).length}명)</button>
                  )}
                </div>
              )}
            </div>
          )}
          {activeNav==="attendance"&&(
            <div className="header-filter">
              <div className="tab-bar" style={{marginBottom:attendanceTab==="check"?6:0}}>
                <button className={`tab-item ${attendanceTab==="check"?"active":""}`} onClick={()=>setAttendanceTab("check")}>출석 체크</button>
                <button className={`tab-item ${attendanceTab==="summary"?"active":""}`} onClick={()=>setAttendanceTab("summary")}>출석 현황</button>
              </div>
              {attendanceTab==="check"&&(
                <>
                  <div className="date-row" style={{marginBottom:6}}>
                    <input type="date" className="date-input-styled" value={attendanceDate} onChange={e=>setAttendanceDate(e.target.value)}/>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:18,fontWeight:700,color:"#10B981"}}>{attendanceList.filter(a=>a.date===attendanceDate&&a.status&&(attendanceFilterSam==="all"||members.find(m=>m.id===a.member_id)?.sam_id===attendanceFilterSam)).length}</div>
                      <div style={{fontSize:11,color:"#94A3B8"}}>/ {members.filter(m=>!m.military&&m.is_active!==false&&(attendanceFilterSam==="all"||m.sam_id===attendanceFilterSam)).length}명</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
                    <button className={`btn btn-sm ${attendanceFilterSam==="all"?"btn-primary":"btn-secondary"}`} style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setAttendanceFilterSam("all")}>전체</button>
                    {sams.map(s=><button key={s.id} className={`btn btn-sm ${attendanceFilterSam===s.id?"btn-primary":"btn-secondary"}`} style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setAttendanceFilterSam(s.id)}>{s.name}샘</button>)}
                  </div>
                </>
              )}
            </div>
          )}
          {activeNav==="sam"&&sams.length>0&&(
            <div className="header-filter">
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:samSelected?6:0}}>
                {sams.map(s=><button key={s.id} className={`btn btn-sm ${samSelected===s.id?"btn-primary":"btn-secondary"}`} style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setSamSelected(s.id)}>{s.name}샘</button>)}
              </div>
              {samSelected&&(
                <div className="tab-bar" style={{marginBottom:0}}>
                  <button className={`tab-item ${samTab==="check"?"active":""}`} onClick={()=>setSamTab("check")}>출석 체크</button>
                  <button className={`tab-item ${samTab==="summary"?"active":""}`} onClick={()=>setSamTab("summary")}>출석 현황</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="page-content">{pages[activeNav]}</div>
        <div className="bottom-nav">
          {navItems.map(item=>(
            <button key={item.id} className={`nav-item ${activeNav===item.id?"active":""}`} onClick={()=>handleNavChange(item.id)}>
              <Icon name={item.icon} size={22}/>{item.label}
            </button>
          ))}
        </div>
        {/* 모달들 */}
        {admin && modal?.type==="addMember" && <MemberFormModal sams={sams} onSave={saveMember} onClose={closeModal}/>}
        {admin && modal?.type==="editMember" && <MemberFormModal sams={sams} initial={modal.member} onSave={m=>updateMember(modal.member.id,m)} onClose={closeModal}/>}
        {admin && modal?.type==="inactivateMember" && <InactivateModal member={modal.member} onSave={(reason)=>inactivateMember(modal.member.id,reason)} onClose={closeModal}/>}
        {admin && modal?.type==="addSam" && <AddSamModal onSave={saveSam} onClose={closeModal}/>}
        {admin && modal?.type==="addNewMember" && <NewMemberFormModal onSave={saveNewMember} onClose={closeModal}/>}
        {admin && modal?.type==="editNewMember" && <NewMemberFormModal initial={modal.member} onSave={m=>updateNewMember(modal.member.id,m)} onClose={closeModal}/>}
        {admin && modal?.type==="assignSam" && <AssignSamModal sams={sams} newMember={modal.newMember} onAssign={assignNewMemberToSam} onClose={closeModal}/>}
        {admin && modal?.type==="addNotice" && <NoticeFormModal userEmail={user?.email} onSave={async(d)=>{await supabase.from("notices").insert([d]);await fetchAll();closeModal();}} onClose={closeModal}/>}
        {admin && modal?.type==="editNotice" && <NoticeFormModal initial={modal.notice} userEmail={user?.email} onSave={async(d)=>{await supabase.from("notices").update(d).eq("id",modal.notice.id);await fetchAll();closeModal();}} onClose={closeModal}/>}
        {admin && modal?.type==="addPrayer" && <PrayerFormModal members={members} userEmail={user?.email} onSave={async(d)=>{await supabase.from("prayers").insert([d]);await fetchAll();closeModal();}} onClose={closeModal}/>}
        {admin && modal?.type==="editPrayer" && <PrayerFormModal members={members} initial={modal.prayer} userEmail={user?.email} onSave={async(d)=>{await supabase.from("prayers").update({content:d.content,member_id:d.member_id}).eq("id",modal.prayer.id);await fetchAll();closeModal();}} onClose={closeModal}/>}
        {modal?.type==="changePw" && <ChangePasswordModal onClose={closeModal}/>}
      </div>
      {/* 청년 상세 페이지 (나눔 기록) */}
      {selectedMember && (
        <MemberDetailPage
          member={selectedMember}
          sams={sams}
          userEmail={user?.email}
          onClose={()=>setSelectedMember(null)}
        />
      )}
      {/* 내 계정 모달 — app-wrapper 밖에서 렌더링 (overflow:hidden 영향 제거) */}
      {modal?.type==="myAccount" && (
        <MyAccountModal userId={userId} admin={admin} onChangePw={()=>setModal({type:"changePw"})} onLogout={handleLogout} onClose={closeModal}/>
      )}
    </>
  );
}

// ==================== 내 계정 모달 ====================
function MyAccountModal({ userId, admin, onChangePw, onLogout, onClose }) {
  return createPortal(
    <>
      <div style={{position:"fixed",inset:0,zIndex:9998}} onClick={onClose}/>
      <div style={{
        position:"fixed",top:64,right:12,zIndex:9999,
        background:"#ffffff",borderRadius:16,
        boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
        padding:"20px 16px 16px",width:220,
        border:"1px solid #E2E8F0",
      }}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:admin?"#DBEAFE":"#DCFCE7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:admin?"#1D4ED8":"#166534",margin:"0 auto 8px"}}>
            {userId.charAt(0).toUpperCase()}
          </div>
          <div style={{fontSize:15,fontWeight:700,color:"#1E293B"}}>{userId}</div>
          <div style={{marginTop:6}}>
            <span style={{display:"inline-flex",alignItems:"center",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:admin?"#EFF6FF":"#F0FDF4",color:admin?"#2563EB":"#166534"}}>
              {admin?"👑 관리자":"👀 조회 전용"}
            </span>
          </div>
        </div>
        {admin && (
          <button onClick={onChangePw} style={{width:"100%",marginBottom:8,padding:"10px",borderRadius:10,border:"1px solid #E2E8F0",background:"#F8FAFC",color:"#374151",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans KR',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Icon name="key" size={15}/>비밀번호 변경
          </button>
        )}
        <button onClick={()=>{onClose();onLogout();}} style={{width:"100%",padding:"10px",borderRadius:10,border:"none",background:"#FEF2F2",color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans KR',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <Icon name="logout" size={15} color="#EF4444"/>로그아웃
        </button>
      </div>
    </>,
    document.body
  );
}

// ==================== HOME PAGE ====================
function HomePage({members,newMembers,sams,attendanceList,samAttendanceList,setActiveNav,todayBirthdays,userEmail,recentNotes,onSelectMember,notices}){
  const allPeople=[...members,...newMembers];
  const thisMonthBirthdays=getThisMonthBirthdays(allPeople);
  const now=new Date(); const mm=String(now.getMonth()+1).padStart(2,"0");
  const militaryCount=members.filter(m=>m.military).length;
  const alerts=members.filter(m=>!m.military).map(m=>{const w=getAbsentWeeks(m.id,attendanceList);return(w!==null&&w>=4)?{member:m,weeks:w}:null;}).filter(Boolean).sort((a,b)=>b.weeks-a.weeks);
  const showNotes = canWriteNotes(userEmail) || canViewAllNotes(userEmail);
  const authorLabel = (email) => email?.replace("@hiyouth.com","") || "";

  // 공지/일정
  const todayDate = today();
  const upcomingSchedules = (notices||[]).filter(n=>n.category==="schedule"&&(!n.event_date||n.event_date>=todayDate)).sort((a,b)=>(a.event_date||"9999").localeCompare(b.event_date||"9999")).slice(0,3);
  const recentNotices = (notices||[]).filter(n=>n.category==="notice").slice(0,2);
  const homeNotices = [...upcomingSchedules,...recentNotices].slice(0,4);

  // 예배참석현황 — 일요일만 + 실제 출석(status=true) 있는 날짜만, 최근 4주
  const isSunday = (d) => new Date(d+"T00:00:00").getDay() === 0;
  const sundayDates = [...new Set(
    attendanceList
      .filter(a => a.status===true && isSunday(a.date))
      .map(a=>a.date)
  )].sort().reverse().slice(0,4);

  const activeMembers = members.filter(m=>!m.military);
  const totalActive = activeMembers.length;

  // 샘별참석현황 — 최근 4주 일요일 평균
  const samAttendanceStats = sams.map(s=>{
    const samMembers = activeMembers.filter(m=>m.sam_id===s.id);
    const total = samMembers.length;
    if(total===0) return {sam:s, avg:0, total:0};
    // 해당 샘의 일요일 출석 기록만
    const samSundayDates = [...new Set(
      samAttendanceList
        .filter(a=>a.sam_id===s.id && a.status===true && isSunday(a.date))
        .map(a=>a.date)
    )].sort().reverse().slice(0,4);
    if(samSundayDates.length===0) return {sam:s, avg:0, total};
    const counts = samSundayDates.map(d=>
      samAttendanceList.filter(a=>a.sam_id===s.id&&a.date===d&&a.status===true).length
    );
    const avg = Math.round(counts.reduce((a,b)=>a+b,0)/counts.length);
    return {sam:s, avg, total, dates:samSundayDates};
  });

  return(
    <div>
      <div className="home-banner">
        <div className="home-banner-title">청년부 예배 & 샘모임</div>
        <div className="home-banner-sub">{new Date().toLocaleDateString("ko-KR",{year:"numeric",month:"long",day:"numeric",weekday:"long"})}</div>
      </div>
      {todayBirthdays.length>0&&(<div className="birthday-banner"><div className="birthday-banner-title">🎂 오늘의 생일자</div>{todayBirthdays.map(m=>(<div key={m.id} className="birthday-person"><div className="birthday-avatar">{m.name.charAt(0)}</div><div><div className="birthday-name">🎉 {m.name}</div><div className="birthday-detail">{m.gender==="male"?"남":"여"}{m.birth_year&&` · ${m.birth_year}년생`}{m.phone&&` · ${m.phone}`}</div></div></div>))}</div>)}
      {militaryCount>0&&(<div className="military-banner"><Icon name="shield" size={22} color="white"/><div><div className="military-banner-text">🪖 군복무 중 {militaryCount}명</div><div className="military-banner-sub">참석 카운트에서 제외됩니다</div></div></div>)}

      {/* 통계 카드 3개 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
        <div className="stat-card"><div className="stat-number">{members.length}</div><div className="stat-label">전체 청년</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:"#F59E0B"}}>{sams.length}</div><div className="stat-label">샘 그룹 수</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:"#8B5CF6"}}>{newMembers.length}</div><div className="stat-label">새가족</div></div>
      </div>

      {/* 바로가기 버튼 */}
      <div className="quick-grid">
        <button className="quick-action" onClick={()=>setActiveNav("attendance")}><div className="quick-action-icon" style={{background:"#EFF6FF"}}><Icon name="calendar" size={17} color="#2563EB"/></div><div className="quick-action-label">예배참석 체크</div></button>
        <button className="quick-action" onClick={()=>setActiveNav("sam")}><div className="quick-action-icon" style={{background:"#ECFDF5"}}><Icon name="group" size={17} color="#10B981"/></div><div className="quick-action-label">샘별참석 체크</div></button>
        <button className="quick-action" onClick={()=>setActiveNav("members")}><div className="quick-action-icon" style={{background:"#FDF2F8"}}><Icon name="users" size={17} color="#DB2777"/></div><div className="quick-action-label">청년 명단</div></button>
        <button className="quick-action" onClick={()=>setActiveNav("newmembers")}><div className="quick-action-icon" style={{background:"#FFFBEB"}}><Icon name="newuser" size={17} color="#D97706"/></div><div className="quick-action-label">새가족 관리</div></button>
      </div>

      {/* 공지/일정 */}
      {homeNotices.length>0&&(
        <>
          <div className="section-header">
            <div className="section-title">📢 공지 · 일정</div>
            <button className="btn btn-secondary btn-sm" onClick={()=>setActiveNav("notices")}>전체보기 →</button>
          </div>
          <div style={{background:"var(--white)",border:"1px solid var(--gray-200)",borderRadius:"var(--radius-lg)",overflow:"hidden",marginBottom:14,boxShadow:"var(--shadow)"}}>
            {homeNotices.map((n,idx)=>{
              const isSchedule=n.category==="schedule";
              const bg=isSchedule?"#F5F3FF":"#EFF6FF";
              const color=isSchedule?"#7C3AED":"#2563EB";
              const label=isSchedule?"📅 일정":"📢 공지";
              return(
                <div key={n.id} onClick={()=>setActiveNav("notices")}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:idx<homeNotices.length-1?"1px solid var(--gray-100)":"none",borderLeft:`3px solid ${color}`,transition:"background 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--gray-50)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{background:bg,color,borderRadius:20,padding:"2px 7px",fontSize:10,fontWeight:700,flexShrink:0}}>{label}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--gray-800)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</div>
                    {isSchedule&&n.event_date&&<div style={{fontSize:11,color:"var(--gray-400)",marginTop:1}}>{formatDate(n.event_date)}</div>}
                  </div>
                  <div style={{color:"var(--gray-300)",flexShrink:0,fontSize:16}}>›</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 예배참석현황 */}
      <div className="section-header">
        <div className="section-title">📊 예배참석현황</div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setActiveNav("attendance")}>자세히 →</button>
      </div>
      {sundayDates.length===0?(
        <div style={{background:"var(--gray-50)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14,textAlign:"center",fontSize:13,color:"var(--gray-400)"}}>참석 기록이 없습니다</div>
      ):(
        <div style={{background:"var(--white)",border:"1px solid var(--gray-200)",borderRadius:"var(--radius-lg)",padding:"14px",marginBottom:14,boxShadow:"var(--shadow)"}}>
          {sundayDates.map(d=>{
            const count=attendanceList.filter(a=>a.date===d&&a.status===true).length;
            const pct=totalActive>0?Math.round(count/totalActive*100):0;
            return(
              <div key={d} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--gray-600)"}}>{formatDate(d)} (일)</span>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--primary)"}}>{count}<span style={{fontSize:11,color:"var(--gray-400)",fontWeight:400}}>/{totalActive}명</span></span>
                </div>
                <div style={{background:"var(--gray-100)",borderRadius:999,height:8,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:999,background:"var(--primary)",width:`${pct}%`,transition:"width 0.3s"}}/>
                </div>
              </div>
            );
          })}
          <div style={{fontSize:11,color:"var(--gray-400)",marginTop:4,textAlign:"right"}}>군복무 {militaryCount}명 제외</div>
        </div>
      )}

      {/* 샘별참석현황 */}
      <div className="section-header">
        <div className="section-title">🌱 샘별참석현황</div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setActiveNav("sam")}>자세히 →</button>
      </div>
      {samAttendanceStats.length===0?(
        <div style={{background:"var(--gray-50)",borderRadius:"var(--radius)",padding:"16px",marginBottom:14,textAlign:"center",fontSize:13,color:"var(--gray-400)"}}>참석 기록이 없습니다</div>
      ):(
        <div style={{background:"var(--white)",border:"1px solid var(--gray-200)",borderRadius:"var(--radius-lg)",padding:"14px",marginBottom:14,boxShadow:"var(--shadow)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {samAttendanceStats.map(({sam,avg,total})=>(
              <div key={sam.id} style={{background:"var(--gray-50)",borderRadius:"var(--radius)",padding:"8px 10px"}}>
                <div style={{fontSize:11,fontWeight:600,color:"var(--gray-500)",marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sam.name}샘</div>
                <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                  <span style={{fontSize:20,fontWeight:800,color:"#10B981",fontFamily:"'Montserrat',sans-serif"}}>{avg}</span>
                  <span style={{fontSize:11,color:"var(--gray-400)"}}>/{total}명</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"var(--gray-400)",marginTop:8,textAlign:"right"}}>최근 4주 평균 · 군복무 제외</div>
        </div>
      )}

      {/* 샘별 인원수 */}
      {sams.length>0&&(
        <>
          <div className="section-header"><div className="section-title">🌱 샘별 인원 현황</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:16}}>
            {sams.map(s=>{
              const total=members.filter(m=>m.sam_id===s.id).length;
              const active=members.filter(m=>m.sam_id===s.id&&!m.military).length;
              const mil=members.filter(m=>m.sam_id===s.id&&m.military).length;
              return(
                <div key={s.id} style={{background:"var(--primary-light)",border:"1px solid #BFDBFE",borderRadius:"var(--radius)",padding:"8px 10px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--primary)",marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}샘</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                    <span style={{fontSize:20,fontWeight:800,color:"var(--gray-900)",fontFamily:"'Montserrat',sans-serif",lineHeight:1}}>{total}</span>
                    <span style={{fontSize:11,color:"var(--gray-500)"}}>명</span>
                  </div>
                  {mil>0&&<div style={{fontSize:10,color:"#6B7280",marginTop:2}}>일반 {active} · 🪖{mil}</div>}
                  {mil===0&&<div style={{fontSize:10,color:"var(--gray-400)",marginTop:2}}>전원 재적</div>}
                </div>
              );
            })}
            {/* 샘 미지정 카드 */}
            {(()=>{
              const unassigned=members.filter(m=>!m.sam_id);
              const unassignedActive=unassigned.filter(m=>!m.military).length;
              const unassignedMil=unassigned.filter(m=>m.military).length;
              if(unassigned.length===0) return null;
              return(
                <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:"var(--radius)",padding:"8px 10px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#C2410C",marginBottom:2}}>미지정</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:2}}>
                    <span style={{fontSize:20,fontWeight:800,color:"var(--gray-900)",fontFamily:"'Montserrat',sans-serif",lineHeight:1}}>{unassigned.length}</span>
                    <span style={{fontSize:11,color:"var(--gray-500)"}}>명</span>
                  </div>
                  {unassignedMil>0&&<div style={{fontSize:10,color:"#6B7280",marginTop:2}}>일반 {unassignedActive} · 🪖{unassignedMil}</div>}
                  {unassignedMil===0&&<div style={{fontSize:10,color:"#F97316",marginTop:2}}>샘 배정 필요</div>}
                </div>
              );
            })()}
          </div>
        </>
      )}
      {thisMonthBirthdays.length>0&&(
        <>
          <div className="section-header"><div className="section-title">🎂 {parseInt(mm)}월 생일자</div><span className="badge badge-yellow">{thisMonthBirthdays.length}명</span></div>
          <div className="birthday-grid">
            {thisMonthBirthdays.map(m=>(
              <div key={m.id} className={`birthday-grid-card ${m.isToday?"today":""}`}>
                <div className={`birthday-grid-badge ${m.isToday?"today":""}`}>
                  <span className="birthday-grid-month">{mm}월</span>
                  <span className="birthday-grid-day">{m.dayNum}</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="birthday-grid-name" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {m.name}{m.isToday&&" 🎉"}
                  </div>
                  <div className="birthday-grid-sub">
                    {m.gender==="male"?"남":"여"}{m.birth_year&&` · ${m.birth_year}`}
                    {m.isToday&&<span style={{color:"#F97316",fontWeight:600}}> 오늘!</span>}
                  </div>
                </div>
                {m.phone&&<a href={`tel:${m.phone}`} style={{flexShrink:0,color:"#2563EB"}}><Icon name="phone" size={14}/></a>}
              </div>
            ))}
          </div>
        </>
      )}
      {alerts.length>0&&(<><div className="section-header"><div className="section-title">⚠️ 장기 결석 알림</div><span className="badge badge-red">{alerts.length}명</span></div>{alerts.map(({member,weeks})=>(<div key={member.id} className={`alert-item ${weeks>=8?"weekly":"warn"}`}><div style={{marginTop:1}}><Icon name="bell" size={16} color={weeks>=8?"#EF4444":"#F59E0B"}/></div><div className="alert-text"><div className="alert-title">{member.name}</div><div className="alert-sub">{weeks>=8?`🔴 ${weeks}주째 결석 — 매주 확인 필요`:`🟡 ${weeks}주째 결석 — 연락 필요`}{member.phone&&<> · <a href={`tel:${member.phone}`} className="phone-link">{member.phone}</a></>}</div></div></div>))}</>)}

      {/* 최근 나눔 기록 — 나눔 권한 있는 사람만 표시 */}
      {showNotes && recentNotes.length > 0 && (
        <>
          <div className="section-header">
            <div className="section-title">📝 최근 나눔 기록</div>
            <button className="btn btn-secondary btn-sm" onClick={()=>setActiveNav("allNotes")}>
              전체보기 →
            </button>
          </div>
          <div style={{background:"var(--white)",border:"1px solid var(--gray-200)",borderRadius:"var(--radius-lg)",overflow:"hidden",marginBottom:16,boxShadow:"var(--shadow)"}}>
            {recentNotes.map((note, idx) => {
              const member = members.find(m => m.id === note.member_id);
              if (!member) return null;
              return (
                <div key={note.id}
                  onClick={() => onSelectMember(member)}
                  style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"11px 14px",
                    borderBottom: idx < recentNotes.length-1 ? "1px solid var(--gray-100)" : "none",
                    cursor:"pointer",
                    transition:"background 0.15s",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div className={`member-avatar ${member.gender}`} style={{width:34,height:34,fontSize:13,flexShrink:0}}>
                    {member.military ? "🪖" : member.name.charAt(0)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:"var(--gray-800)"}}>{member.name}</div>
                    <div style={{fontSize:12,color:"var(--gray-400)",marginTop:1}}>
                      {formatDate(note.date)} · 👤 {authorLabel(note.author_email)}
                    </div>
                  </div>
                  <div style={{color:"var(--gray-300)",flexShrink:0,fontSize:16}}>›</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ==================== MEMBERS PAGE ====================
function MembersPage({members,sams,setModal,onDelete,onInactivate,onRestore,onPermanentDelete,admin,userEmail,onSelectMember,noteCountMap,activeTab,filterSam}){
  const [search,setSearch]=useState("");

  const activeMembers = sortByName(members.filter(m=>(m.is_active!==false)&&!m.military));
  const militaryList = sortByName(members.filter(m=>(m.is_active!==false)&&m.military));
  const inactiveList = sortByName(members.filter(m=>m.is_active===false));

  const filtered = (() => {
    const ms = (m) => m.name.includes(search)||(m.phone||"").includes(search);
    if(activeTab==="military") return militaryList.filter(ms);
    if(activeTab==="inactive") return inactiveList.filter(ms);
    // active 탭
    const base = activeMembers.filter(ms);
    if(filterSam==="all") return base;
    if(filterSam==="unassigned") return members.filter(m=>(m.is_active!==false)&&!m.sam_id&&ms(m));
    // 특정 샘 선택 — 일반 + 해당 샘 군복무자
    return members.filter(m=>(m.is_active!==false)&&m.sam_id===filterSam&&ms(m));
  })();

  const militaryInSam = activeTab==="active" && filterSam!=="all"
    ? filtered.filter(m=>m.military) : [];
  const normalInSam = sortByName(activeTab==="active"
    ? filtered.filter(m=>!m.military) : filtered);

  const getSamName=samId=>sams.find(s=>s.id===samId)?.name||"";

  const renderMemberCard = (m, isInactive=false) => {
    const noteAccess = canWriteNotes(userEmail);
    return(
      <div key={m.id} className={`member-item ${m.military?"military-item":""} ${isInactive?"inactive-item":""}`}
        style={{cursor:(!isInactive&&noteAccess)?"pointer":"default"}}
        onClick={()=>(!isInactive&&noteAccess)&&onSelectMember(m)}>
        <div className={`member-avatar ${m.military?"military-av":m.gender}`}>
          {m.military?"🪖":m.name.charAt(0)}
        </div>
        <div className="member-info">
          <div className="member-name" style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span className={m.military?"military-name":""}>{m.name}</span>
            {!isInactive&&noteAccess&&<span style={{fontSize:10,color:"var(--gray-400)"}}>📝</span>}
            {!isInactive&&noteCountMap[m.id]>0&&(
              <span style={{background:"#EDE9FE",color:"#7C3AED",borderRadius:20,padding:"1px 7px",fontSize:11,fontWeight:700}}>
                📝 {noteCountMap[m.id]}건
              </span>
            )}
          </div>
          <div className="member-meta">
            {m.military
              ? <span className="badge badge-military">🪖 군복무 중</span>
              : <span className={`badge ${m.gender==="male"?"badge-blue":"badge-pink"}`}>{m.gender==="male"?"남":"여"}</span>
            }
            {getSamName(m.sam_id)&&<span className="badge badge-green" style={{marginLeft:4}}>{getSamName(m.sam_id)}샘</span>}
            {m.birth_year&&<span style={{marginLeft:4}}>· {m.birth_year}년생</span>}
            {m.birthday&&<span style={{marginLeft:4}}>· 🎂{m.birthday}</span>}
            {isInactive&&m.inactive_reason&&<span className="badge badge-inactive" style={{marginLeft:4}}>🚪 {m.inactive_reason}</span>}
          </div>
          {m.phone&&<div style={{marginTop:3,display:"flex",alignItems:"center",gap:4}}><Icon name="phone" size={11} color="#94A3B8"/><a href={`tel:${m.phone}`} className="phone-link" onClick={e=>e.stopPropagation()}>{m.phone}</a></div>}
          {isInactive&&m.inactive_at&&<div style={{fontSize:11,color:"var(--gray-400)",marginTop:3}}>비활성 처리일: {formatDate(m.inactive_at)}</div>}
          {!isInactive&&(m.new_member_registered_at||m.assigned_at)&&(
            <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
              {m.new_member_registered_at&&<span style={{fontSize:10,background:"#EFF6FF",color:"#2563EB",borderRadius:6,padding:"2px 6px"}}>📅 새가족 {formatDate(m.new_member_registered_at)}</span>}
              {m.assigned_at&&<span style={{fontSize:10,background:"#ECFDF5",color:"#10B981",borderRadius:6,padding:"2px 6px"}}>🌱 샘배정 {formatDate(m.assigned_at)}</span>}
            </div>
          )}
        </div>
        <div className="member-actions">
          {isInactive ? (
            // 비활성 탭 — 복구 + 완전삭제
            <>
              <button className="btn-restore" onClick={e=>{e.stopPropagation();onRestore(m.id);}}>
                <Icon name="refresh" size={12}/>복구
              </button>
              <button className="btn-permanent-delete" onClick={e=>{e.stopPropagation();onPermanentDelete(m);}}>
                <Icon name="trash" size={12}/>삭제
              </button>
            </>
          ) : admin ? (
            // 일반/군복무 탭 — 수정 + 비활성처리
            <>
              <button className="btn-icon" onClick={e=>{e.stopPropagation();setModal({type:"editMember",member:m});}}><Icon name="edit" size={14}/></button>
              <button className="btn-icon" style={{background:"#FFF7ED",color:"#F97316"}} title="비활성 처리"
                onClick={e=>{e.stopPropagation();setModal({type:"inactivateMember",member:m});}}>
                <Icon name="logout" size={14}/>
              </button>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  return(
    <div>
      <div className="search-bar" style={{marginBottom:8}}><span className="search-icon"><Icon name="users" size={16}/></span><input placeholder="이름 또는 전화번호 검색..." value={search} onChange={e=>setSearch(e.target.value)}/></div>

      {/* 비활성 탭 안내 */}
      {activeTab==="inactive"&&inactiveList.length>0&&(
        <div className="info-hint" style={{marginBottom:12}}>
          🚪 비활성 청년은 출석/통계에서 제외됩니다. 복구하거나 완전 삭제할 수 있어요.
        </div>
      )}

      {/* 목록 */}
      {filtered.length===0?(
        <div className="empty-state">
          <div className="empty-state-icon">{activeTab==="inactive"?"🚪":activeTab==="military"?"🪖":"👥"}</div>
          <div className="empty-state-text">
            {activeTab==="inactive"?"비활성 청년이 없습니다":activeTab==="military"?"군복무 청년이 없습니다":"청년이 없습니다"}
          </div>
        </div>
      ):(
        <>
          {/* 일반/군복무 탭 */}
          {activeTab!=="inactive"&&(
            <>
              {normalInSam.map(m=>renderMemberCard(m,false))}
              {militaryInSam.length>0&&(
                <>
                  <div className="military-divider">
                    <div className="military-divider-line"/>
                    <div className="military-divider-text">🪖 군복무 중</div>
                    <div className="military-divider-line"/>
                  </div>
                  {militaryInSam.map(m=>renderMemberCard(m,false))}
                </>
              )}
            </>
          )}
          {/* 비활성 탭 */}
          {activeTab==="inactive"&&filtered.map(m=>renderMemberCard(m,true))}
        </>
      )}
    </div>
  );
}

// ==================== ATTENDANCE PAGE ====================
function AttendancePage({members,sams,attendanceList,onToggle,onSetAll,admin,tab,selectedDate,filterSam}){
  const activeMembers=sortByName(members.filter(m=>!m.military&&m.is_active!==false));
  const filteredMembers=filterSam==="all"?activeMembers:activeMembers.filter(m=>m.sam_id===filterSam);
  const isPresent=memberId=>!!attendanceList.find(a=>a.member_id===memberId&&a.date===selectedDate&&a.status);
  const presentCount=filteredMembers.filter(m=>isPresent(m.id)).length;
  const allDates=[...new Set(
    attendanceList
      .filter(a=>a.status===true && new Date(a.date+"T00:00:00").getDay()===0)
      .map(a=>a.date)
  )].sort().reverse().slice(0,5);
  const getSamName=samId=>sams.find(s=>s.id===samId)?.name||"";
  return(
    <div>
      {tab==="check"?(
        <>
          {admin&&(<div style={{marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,color:"#64748B"}}>{formatDate(selectedDate)} ({getDayLabel(selectedDate)})</span><div style={{display:"flex",gap:8}}><button className="btn btn-secondary btn-sm" onClick={()=>onSetAll(filteredMembers.map(m=>m.id),selectedDate,true)}>전체 출석</button><button className="btn btn-danger btn-sm" onClick={()=>onSetAll(filteredMembers.map(m=>m.id),selectedDate,false)}>전체 결석</button></div></div>)}
          {!admin&&(<div style={{marginBottom:8}}><span style={{fontSize:13,color:"#64748B"}}>{formatDate(selectedDate)} ({getDayLabel(selectedDate)})</span></div>)}
          {filteredMembers.length===0?(<div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">등록된 청년이 없습니다</div></div>):(
            filteredMembers.map(m=>{
              const present=isPresent(m.id);
              const absentWeeks=getAbsentWeeks(m.id,attendanceList);
              return(
                <div key={m.id} className="member-item" style={{cursor:admin?"pointer":"default"}} onClick={()=>admin&&onToggle(m.id,selectedDate)}>
                  <div className={`member-avatar ${m.gender}`}>{m.name.charAt(0)}</div>
                  <div className="member-info">
                    <div className="member-name">{m.name}</div>
                    <div className="member-meta">
                      {getSamName(m.sam_id)&&<span className="badge badge-green" style={{marginRight:4}}>{getSamName(m.sam_id)}샘</span>}
                      {absentWeeks!==null&&absentWeeks>=4&&!present&&<span className={`badge ${absentWeeks>=8?"badge-red":"badge-yellow"}`}>{absentWeeks}주 결석</span>}
                    </div>
                  </div>
                  <button className={`attendance-check-btn ${present?"checked":""}`} style={{cursor:admin?"pointer":"default"}} onClick={e=>{e.stopPropagation();admin&&onToggle(m.id,selectedDate);}}>
                    {present&&<Icon name="check" size={14}/>}
                  </button>
                </div>
              );
            })
          )}
        </>
      ):(
        <>
          <div style={{fontSize:13,color:"#64748B",marginBottom:12}}>최근 5주 참석 현황 (군복무 제외)</div>
          {allDates.length===0?(<div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-text">참석 기록이 없습니다</div></div>):(
            <div style={{overflowX:"auto"}}><table className="summary-table"><thead><tr><th>이름</th>{allDates.map(d=><th key={d}>{formatDate(d).slice(5)}<br/><span style={{fontWeight:400}}>({getDayLabel(d)})</span></th>)}</tr></thead><tbody>{sortByName(members.filter(m=>!m.military)).map(m=><tr key={m.id}><td>{m.name}</td>{allDates.map(d=>{const rec=attendanceList.find(a=>a.member_id===m.id&&a.date===d);return<td key={d}>{rec?.status?<span className="dot-present">✓</span>:<span className="dot-absent"/>}</td>;})}</tr>)}</tbody></table></div>
          )}
        </>
      )}
    </div>
  );
}

// ==================== SAM ATTENDANCE PAGE ====================
function SamAttendancePage({members,sams,samAttendanceList,onToggle,onDeleteSam,admin,selectedSam,setSelectedSam,tab}){
  const [selectedDate,setSelectedDate]=useState(today());
  useEffect(()=>{if(sams.length>0&&!selectedSam)setSelectedSam(sams[0].id);},[sams]);
  const allSamMembers=members.filter(m=>m.sam_id===selectedSam);
  const activeMembers=sortByName(allSamMembers.filter(m=>!m.military&&m.is_active!==false));
  const militaryMembers=sortByName(allSamMembers.filter(m=>m.military));
  const isPresent=memberId=>!!samAttendanceList.find(a=>a.member_id===memberId&&a.sam_id===selectedSam&&a.date===selectedDate&&a.status);
  const presentCount=activeMembers.filter(m=>isPresent(m.id)).length;
  const allDates=[...new Set(
    samAttendanceList
      .filter(a=>a.sam_id===selectedSam && a.status===true && new Date(a.date+"T00:00:00").getDay()===0)
      .map(a=>a.date)
  )].sort().reverse().slice(0,5);
  return(
    <div>
      {sams.length===0?(<div className="empty-state"><div className="empty-state-icon">🌱</div><div className="empty-state-text">샘 그룹이 없습니다</div></div>):(
        <>
          {selectedSam&&(
            <>
              <div className="sam-card">
                <div className="sam-icon"><Icon name="group" size={20} color="white"/></div>
                <div className="sam-info"><div className="sam-name">{sams.find(s=>s.id===selectedSam)?.name}샘</div><div className="sam-count">구성원 {activeMembers.length}명{militaryMembers.length>0&&<span style={{marginLeft:6,color:"#6B7280"}}>· 군복무 {militaryMembers.length}명</span>}</div></div>
                {admin&&<button className="btn-icon danger" onClick={()=>onDeleteSam(selectedSam)}><Icon name="trash" size={14}/></button>}
              </div>
              {tab==="check"?(
                <>
                  <div className="date-row">
                    <input type="date" className="date-input-styled" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}/>
                    <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:18,fontWeight:700,color:"#10B981"}}>{presentCount}</div><div style={{fontSize:11,color:"#94A3B8"}}>/ {activeMembers.length}명</div></div>
                  </div>
                  {allSamMembers.length===0?(<div className="empty-state"><div className="empty-state-icon">👤</div><div className="empty-state-text">배정된 청년이 없습니다</div></div>):(
                    <>
                      {activeMembers.map(m=>{
                        const present=isPresent(m.id);
                        return(
                          <div key={m.id} className="member-item" style={{cursor:admin?"pointer":"default"}} onClick={()=>admin&&onToggle(m.id,selectedSam,selectedDate)}>
                            <div className={`member-avatar ${m.gender}`}>{m.name.charAt(0)}</div>
                            <div className="member-info">
                              <div className="member-name">{m.name}</div>
                              <div className="member-meta"><span className="badge badge-green">{sams.find(s=>s.id===selectedSam)?.name}샘</span></div>
                            </div>
                            <button className={`attendance-check-btn ${present?"checked":""}`} style={{cursor:admin?"pointer":"default"}} onClick={e=>{e.stopPropagation();admin&&onToggle(m.id,selectedSam,selectedDate);}}>
                              {present&&<Icon name="check" size={14}/>}
                            </button>
                          </div>
                        );
                      })}
                      {militaryMembers.length>0&&(
                        <>
                          <div className="military-divider"><div className="military-divider-line"/><div className="military-divider-text">🪖 군복무 중</div><div className="military-divider-line"/></div>
                          {militaryMembers.map(m=>(
                            <div key={m.id} className="member-item military-item">
                              <div className="member-avatar military-av">🪖</div>
                              <div className="member-info">
                                <div className="member-name military-name">{m.name}</div>
                                <div className="member-meta"><span className="badge badge-green">{sams.find(s=>s.id===selectedSam)?.name}샘</span></div>
                              </div>
                              <div className="attendance-check-btn military-skip">🪖</div>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              ):(
                <>
                  <div style={{fontSize:13,color:"#64748B",marginBottom:12}}>최근 5회 참석 현황 (군복무 제외)</div>
                  {allDates.length===0?(<div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-text">참석 기록이 없습니다</div></div>):(
                    <div style={{overflowX:"auto"}}><table className="summary-table"><thead><tr><th>이름</th>{allDates.map(d=><th key={d}>{formatDate(d).slice(5)}</th>)}</tr></thead><tbody>{activeMembers.map(m=>(<tr key={m.id}><td>{m.name}</td>{allDates.map(d=>{const rec=samAttendanceList.find(a=>a.member_id===m.id&&a.sam_id===selectedSam&&a.date===d);return<td key={d}>{rec?.status?<span className="dot-present">✓</span>:<span className="dot-absent"/>}</td>;})}</tr>))}{militaryMembers.length>0&&militaryMembers.map(m=>(<tr key={m.id} style={{opacity:0.5}}><td><span style={{fontSize:11}}>🪖</span> {m.name}</td>{allDates.map(d=><td key={d}><span className="dot-military">🪖</span></td>)}</tr>))}</tbody></table></div>
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
function NewMembersPage({newMembers,sams,setModal,onDelete,onToggleEdu,onAssign,admin,userEmail,newMemberMemos,onRefresh}){
  const [search,setSearch]=useState("");
  const [memoTarget,setMemoTarget]=useState(null); // 메모 팝업 대상
  const filtered=sortByName(newMembers).filter(m=>m.name.includes(search));
  const canWrite=canWriteNewMemberMemo(userEmail);
  const canRead=canReadNewMemberMemo(userEmail);
  const getMemoCount=(id)=>newMemberMemos.filter(m=>m.new_member_id===id).length;
  return(
    <div>
      <div className="search-bar"><span className="search-icon"><Icon name="users" size={16}/></span><input placeholder="이름으로 검색..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {filtered.length===0?(<div className="empty-state"><div className="empty-state-icon">🌟</div><div className="empty-state-text">새가족이 없습니다</div>{admin&&<div className="empty-state-sub">우측 상단 + 버튼으로 등록하세요</div>}</div>):(
        filtered.map(m=>{
          const eduDone=[m.week1,m.week2,m.week3,m.week4].filter(Boolean).length;
          const allDone=eduDone===4;
          return(
            <div key={m.id} className="card" style={{padding:"14px 14px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div className={`member-avatar ${m.gender}`} style={{width:38,height:38,fontSize:14}}>{m.name.charAt(0)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:"#1E293B"}}>{m.name}</div>
                  <div style={{fontSize:12,color:"#94A3B8",marginTop:1}}><span className={`badge ${m.gender==="male"?"badge-blue":"badge-pink"}`} style={{marginRight:4}}>{m.gender==="male"?"남":"여"}</span>{m.birth_year&&`${m.birth_year}년생`}{m.birthday&&` · 🎂${m.birthday}`}</div>
                  {m.phone&&<div style={{fontSize:12,marginTop:3,display:"flex",alignItems:"center",gap:4}}><Icon name="phone" size={11} color="#94A3B8"/><a href={`tel:${m.phone}`} className="phone-link">{m.phone}</a></div>}
                </div>
                {admin&&(<div style={{display:"flex",gap:6}}><button className="btn-icon" onClick={()=>setModal({type:"editNewMember",member:m})}><Icon name="edit" size={14}/></button><button className="btn-icon danger" onClick={()=>onDelete(m.id)}><Icon name="trash" size={14}/></button></div>)}
              </div>

              {/* 전환 이력 날짜 표시 */}
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:4,background:"#EFF6FF",borderRadius:8,padding:"4px 8px"}}>
                  <span style={{fontSize:10,color:"#94A3B8"}}>📅 등록</span>
                  <span style={{fontSize:11,fontWeight:600,color:"#2563EB"}}>{m.registered_at ? formatDate(m.registered_at) : "미기록"}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:4,background:m.edu_completed_at?"#ECFDF5":"var(--gray-50)",borderRadius:8,padding:"4px 8px"}}>
                  <span style={{fontSize:10,color:"#94A3B8"}}>📚 교육완료</span>
                  <span style={{fontSize:11,fontWeight:600,color:m.edu_completed_at?"#10B981":"#CBD5E1"}}>{m.edu_completed_at ? formatDate(m.edu_completed_at) : "미완료"}</span>
                </div>
              </div>

              <div style={{fontSize:12,fontWeight:600,color:"#64748B",marginBottom:6}}>새가족 교육 ({eduDone}/4주 완료)<div className="progress-bar-wrap" style={{marginTop:4}}><div className="progress-bar-fill" style={{width:`${(eduDone/4)*100}%`}}/></div></div>
              <div className="edu-weeks">
                {["1주차","2주차","3주차","4주차"].map((label,i)=>{
                  const done=m[`week${i+1}`];
                  return<button key={i} className={`week-check ${done?"done":""}`}
                    onClick={()=>admin&&onToggleEdu(m.id,i)}
                    style={{cursor:admin?"pointer":"default"}}>
                    {done?"✓":""}<br/><span style={{fontSize:11}}>{label}</span></button>;
                })}
              </div>
              {admin&&allDone&&(<button className="assign-btn" onClick={()=>onAssign(m)}><Icon name="assign" size={16} color="white"/>🎉 4주 완료! 샘 배정하기</button>)}

              {/* 메모 버튼 — 읽기 권한 있는 사람에게만 표시 */}
              {canRead&&(
                <button className="memo-btn" onClick={()=>setMemoTarget(m)}>
                  <Icon name="note" size={14} color="#7C3AED"/>
                  메모 {getMemoCount(m.id)>0?`${getMemoCount(m.id)}건 보기`:"추가하기"}
                </button>
              )}
            </div>
          );
        })
      )}

      {/* 메모 팝업 시트 */}
      {memoTarget&&(
        <NewMemberMemoSheet
          newMember={memoTarget}
          memos={newMemberMemos.filter(m=>m.new_member_id===memoTarget.id)}
          userEmail={userEmail}
          canWrite={canWrite}
          onClose={()=>setMemoTarget(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

// ==================== MODALS ====================
function MemberFormModal({sams,initial,onSave,onClose}){
  const [name,setName]=useState(initial?.name||"");
  const [gender,setGender]=useState(initial?.gender||"male");
  const [phone,setPhone]=useState(initial?.phone||"");
  const [birthYear,setBirthYear]=useState(initial?.birth_year||"");
  const [birthday,setBirthday]=useState(initial?.birthday||"");
  const [samId,setSamId]=useState(initial?.sam_id||"");
  const [military,setMilitary]=useState(initial?.military||false);
  const submit=()=>{if(!name.trim()){alert("이름을 입력해주세요");return;}onSave({name:name.trim(),gender,phone:phone.trim(),birthYear,birthday:normalizeBirthday(birthday),samId,military});};
  return(
    <div className="modal-overlay" onClick={onClose}><div className="modal-sheet" onClick={e=>e.stopPropagation()}>
      <div className="modal-handle"/><div className="modal-title">{initial?"청년 정보 수정":"청년 등록"}</div>
      <div className="form-group"><label className="form-label">이름 <span style={{color:"#EF4444"}}>*</span></label><input className="form-input" placeholder="이름 입력" value={name} onChange={e=>setName(e.target.value)}/></div>
      <GenderToggle gender={gender} setGender={setGender}/>
      <div className="form-group"><label className="form-label">전화번호 <span className="optional">(선택)</span></label><div className="input-with-icon"><span className="input-icon"><Icon name="phone" size={15}/></span><input className="form-input" type="tel" placeholder="010-0000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/></div></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">출생년도 <span className="optional">(선택)</span></label><input className="form-input" placeholder="예) 1998" type="number" value={birthYear} onChange={e=>setBirthYear(e.target.value)}/></div>
        <div className="form-group"><label className="form-label">생일 <span className="optional">(선택)</span></label><BirthdayInput value={birthday} onChange={setBirthday}/></div>
      </div>
      <div className="form-group"><label className="form-label">샘 배정 <span className="optional">(선택)</span></label><select className="form-select" value={samId} onChange={e=>setSamId(e.target.value)}><option value="">샘 선택</option>{sams.map(s=><option key={s.id} value={s.id}>{s.name}샘</option>)}</select></div>
      <div className={`military-toggle ${military?"active":""}`} onClick={()=>setMilitary(!military)}><div className="military-toggle-label"><Icon name="shield" size={18} color={military?"#4B5563":"#94A3B8"}/><span style={{fontSize:14,fontWeight:500,color:military?"#374151":"#94A3B8"}}>🪖 군복무 중</span></div><div className={`toggle-switch ${military?"on":""}`}><div className="toggle-knob"/></div></div>
      <button className="btn btn-primary" onClick={submit}><Icon name="check" size={16} color="white"/>{initial?"수정 완료":"등록하기"}</button>
    </div></div>
  );
}
function AddSamModal({onSave,onClose}){
  const [name,setName]=useState("");
  const submit=()=>{if(!name.trim()){alert("샘 이름을 입력해주세요");return;}onSave(name.trim());};
  return(<div className="modal-overlay" onClick={onClose}><div className="modal-sheet" onClick={e=>e.stopPropagation()}><div className="modal-handle"/><div className="modal-title">새 샘 추가</div><div className="form-group"><label className="form-label">샘 이름</label><input className="form-input" placeholder="예) 한나, 다윗, 요셉..." value={name} onChange={e=>setName(e.target.value)}/></div><button className="btn btn-primary" onClick={submit}><Icon name="plus" size={16} color="white"/>샘 추가하기</button></div></div>);
}
function NewMemberFormModal({initial,onSave,onClose}){
  const [name,setName]=useState(initial?.name||"");
  const [gender,setGender]=useState(initial?.gender||"male");
  const [phone,setPhone]=useState(initial?.phone||"");
  const [birthYear,setBirthYear]=useState(initial?.birth_year||"");
  const [birthday,setBirthday]=useState(initial?.birthday||"");
  const [registeredAt,setRegisteredAt]=useState(initial?.registered_at||today());
  const submit=()=>{if(!name.trim()){alert("이름을 입력해주세요");return;}onSave({name:name.trim(),gender,phone:phone.trim(),birthYear,birthday:normalizeBirthday(birthday),registeredAt});};
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">{initial?"새가족 정보 수정":"새가족 등록"}</div>
        <div className="form-group"><label className="form-label">이름 <span style={{color:"#EF4444"}}>*</span></label><input className="form-input" placeholder="이름 입력" value={name} onChange={e=>setName(e.target.value)}/></div>
        <GenderToggle gender={gender} setGender={setGender}/>
        <div className="form-group"><label className="form-label">전화번호 <span className="optional">(선택)</span></label><div className="input-with-icon"><span className="input-icon"><Icon name="phone" size={15}/></span><input className="form-input" type="tel" placeholder="010-0000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/></div></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">출생년도 <span className="optional">(선택)</span></label><input className="form-input" placeholder="예) 1998" type="number" value={birthYear} onChange={e=>setBirthYear(e.target.value)}/></div>
          <div className="form-group"><label className="form-label">생일 <span className="optional">(선택)</span></label><BirthdayInput value={birthday} onChange={setBirthday}/></div>
        </div>
        {/* 등록 날짜 입력 */}
        <div className="form-group">
          <label className="form-label">등록 날짜</label>
          <input className="form-input" type="date" value={registeredAt} onChange={e=>setRegisteredAt(e.target.value)}/>
          <div style={{fontSize:11,color:"var(--gray-400)",marginTop:4}}>💡 실제 처음 방문한 날짜를 입력해 주세요</div>
        </div>
        <div className="info-hint">💡 새가족 교육 4주 이수 체크는 등록 후 명단에서 직접 체크할 수 있습니다</div>
        <button className="btn btn-primary" onClick={submit}><Icon name="check" size={16} color="white"/>{initial?"수정 완료":"등록하기"}</button>
      </div>
    </div>
  );
}
function AssignSamModal({sams,newMember,onAssign,onClose}){
  const [samId,setSamId]=useState("");
  return(<div className="modal-overlay" onClick={onClose}><div className="modal-sheet" onClick={e=>e.stopPropagation()}><div className="modal-handle"/><div className="modal-title">🎉 샘 배정</div><div style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:"#065F46"}}><strong>{newMember.name}</strong> 님이 4주 교육을 모두 마쳤습니다!<br/>샘을 배정하면 청년 명단으로 이동됩니다.</div><div className="form-group"><label className="form-label">배정할 샘 선택</label><select className="form-select" value={samId} onChange={e=>setSamId(e.target.value)}><option value="">샘을 선택하세요</option>{sams.map(s=><option key={s.id} value={s.id}>{s.name}샘</option>)}</select></div><button className="assign-btn" style={{marginTop:0}} onClick={()=>{if(!samId){alert("샘을 선택해주세요");return;}onAssign(newMember,samId);}}><Icon name="assign" size={16} color="white"/>샘 배정 완료</button><button className="btn btn-secondary" style={{width:"100%",marginTop:8}} onClick={()=>onAssign(newMember,"")}>샘 미배정으로 이동</button></div></div>);
}

// ==================== 청년 상세 페이지 (나눔 기록) ====================
function MemberDetailPage({ member, sams, userEmail, onClose }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // 수정할 노트

  const viewAll = canViewAllNotes(userEmail);
  const viewOwn = canViewOwnNotes(userEmail);
  const canWrite = canWriteNotes(userEmail);

  const getSamName = (samId) => sams.find(s => s.id === samId)?.name || "";

  const fetchNotes = async () => {
    setLoading(true);
    let query = supabase.from("pastoral_notes").select("*").eq("member_id", member.id).order("date", { ascending: false });
    if (viewOwn && !viewAll) {
      query = query.eq("author_email", userEmail);
    }
    const { data } = await query;
    if (data) setNotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [member.id]);

  // 삭제
  const deleteNote = async (noteId) => {
    if (!window.confirm("이 나눔 기록을 삭제하시겠습니까?")) return;
    await supabase.from("pastoral_notes").delete().eq("id", noteId);
    await fetchNotes();
  };

  // 본인 기록 또는 전체열람자 여부
  const canEditNote = (note) => viewAll || note.author_email === userEmail;

  const methodLabel = (m) => {
    if (m === "face") return { label: "대면", cls: "face" };
    if (m === "phone") return { label: "전화", cls: "phone" };
    if (m === "chat") return { label: "카톡", cls: "chat" };
    return { label: m || "", cls: "face" };
  };

  const authorLabel = (email) => email?.replace("@hiyouth.com", "") || "";

  return (
    <div className="detail-page">
      {/* 헤더 */}
      <div className="detail-header">
        <button className="btn-icon" style={{ background: "var(--gray-100)", color: "var(--gray-600)" }} onClick={onClose}>
          <Icon name="back" size={18} />
        </button>
        <div className="detail-header-title">나눔 기록</div>
      </div>

      <div className="detail-content">
        {/* 청년 프로필 카드 */}
        <div className="member-profile-card">
          <div className="member-profile-avatar">
            {member.military ? "🪖" : member.name.charAt(0)}
          </div>
          <div>
            <div className="member-profile-name">{member.name}</div>
            <div className="member-profile-meta">
              {member.gender === "male" ? "남" : "여"}
              {member.birth_year && ` · ${member.birth_year}년생`}
              {getSamName(member.sam_id) && ` · ${getSamName(member.sam_id)}샘`}
              {member.military && " · 🪖 군복무 중"}
            </div>
            {member.phone && (
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>
                📱 {member.phone}
              </div>
            )}
          </div>
        </div>

        {/* 권한 안내 */}
        {viewOwn && !viewAll && (
          <div className="info-hint" style={{ marginBottom: 12 }}>
            📝 본인이 작성한 나눔 기록만 볼 수 있습니다
          </div>
        )}

        {/* 나눔 기록 목록 */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--gray-400)" }}>
            <div className="spinner" style={{ margin: "0 auto 12px" }} />
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">나눔 기록이 없습니다</div>
            {canWrite && <div className="empty-state-sub">아래 + 버튼으로 나눔 기록을 추가하세요</div>}
          </div>
        ) : (
          notes.map(note => {
            const { label, cls } = methodLabel(note.method);
            const editable = canEditNote(note);
            return (
              <div key={note.id} className="note-card">
                <div className="note-card-header">
                  <div className="note-date">📅 {formatDate(note.date)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {label && <span className={`note-method ${cls}`}>{label}</span>}
                    {/* 수정/삭제 버튼 — 본인 기록 또는 전체열람자만 표시 */}
                    {editable && (
                      <>
                        <button className="btn-icon" style={{ width: 28, height: 28 }}
                          onClick={() => { setEditingNote(note); setShowForm(true); }}>
                          <Icon name="edit" size={13} />
                        </button>
                        <button className="btn-icon danger" style={{ width: 28, height: 28 }}
                          onClick={() => deleteNote(note.id)}>
                          <Icon name="trash" size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {note.content && (
                  <div className="note-section">
                    <div className="note-section-label">내용</div>
                    <div className="note-section-text">{note.content}</div>
                  </div>
                )}
                {note.prayer && (
                  <div className="note-section">
                    <div className="note-section-label">🙏 기도제목</div>
                    <div className="note-prayer">
                      <div className="note-prayer-text">{note.prayer}</div>
                    </div>
                  </div>
                )}
                <div className="note-author">작성: {authorLabel(note.author_email)}</div>
              </div>
            );
          })
        )}
      </div>

      {/* 작성 버튼 (권한 있는 사람만) */}
      {canWrite && !showForm && (
        <button className="fab" onClick={() => { setEditingNote(null); setShowForm(true); }}>
          <Icon name="plus" size={22} color="white" />
        </button>
      )}

      {/* 나눔 기록 작성/수정 모달 */}
      {showForm && (
        <PastoralNoteForm
          memberId={member.id}
          userEmail={userEmail}
          initial={editingNote}
          onSave={async () => { await fetchNotes(); setShowForm(false); setEditingNote(null); }}
          onClose={() => { setShowForm(false); setEditingNote(null); }}
        />
      )}
    </div>
  );
}

// ==================== 나눔 기록 작성/수정 폼 ====================
function PastoralNoteForm({ memberId, userEmail, initial, onSave, onClose }) {
  const [date, setDate] = useState(initial?.date || new Date().toISOString().split("T")[0]);
  const [method, setMethod] = useState(initial?.method || "face");
  const [content, setContent] = useState(initial?.content || "");
  const [prayer, setPrayer] = useState(initial?.prayer || "");
  const [saving, setSaving] = useState(false);

  const isEdit = !!initial;

  const submit = async () => {
    if (!content.trim() && !prayer.trim()) { alert("내용 또는 기도제목을 입력해주세요"); return; }
    setSaving(true);
    if (isEdit) {
      // 수정
      await supabase.from("pastoral_notes").update({
        date,
        method,
        content: content.trim(),
        prayer: prayer.trim(),
      }).eq("id", initial.id);
    } else {
      // 신규 작성
      await supabase.from("pastoral_notes").insert([{
        member_id: memberId,
        date,
        method,
        content: content.trim(),
        prayer: prayer.trim(),
        author_email: userEmail,
      }]);
    }
    setSaving(false);
    onSave();
  };

  const methods = [
    { value: "face", label: "대면" },
    { value: "phone", label: "전화" },
    { value: "chat", label: "카톡" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">{isEdit ? "📝 나눔 기록 수정" : "📝 나눔 기록 작성"}</div>

        <div className="form-group">
          <label className="form-label">날짜</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">나눔 방식</label>
          <div style={{ display: "flex", gap: 8 }}>
            {methods.map(m => (
              <button key={m.value}
                className="btn"
                style={{
                  flex: 1, padding: "10px",
                  background: method === m.value ? "var(--primary)" : "var(--gray-100)",
                  color: method === m.value ? "white" : "var(--gray-600)",
                  fontSize: 14, fontWeight: 600,
                }}
                onClick={() => setMethod(m.value)}>
                {m.value === "face" ? "👤" : m.value === "phone" ? "📞" : "💬"} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">내용 <span className="optional">(선택)</span></label>
          <textarea className="form-input" placeholder="나눔 내용을 입력하세요"
            value={content} onChange={e => setContent(e.target.value)}
            rows={4} style={{ resize: "none", lineHeight: 1.6 }} />
        </div>

        <div className="form-group">
          <label className="form-label">🙏 기도제목 <span className="optional">(선택)</span></label>
          <textarea className="form-input" placeholder="기도제목을 입력하세요"
            value={prayer} onChange={e => setPrayer(e.target.value)}
            rows={3} style={{ resize: "none", lineHeight: 1.6 }} />
        </div>

        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          <Icon name="check" size={16} color="white" />
          {saving ? "저장 중..." : isEdit ? "수정 완료" : "기록 저장"}
        </button>
      </div>
    </div>
  );
}

// ==================== 더보기 페이지 ====================
function MorePage({setActiveNav,admin,userEmail,newMembersCount,noticesCount,prayersCount}){
  const menus=[
    {id:"newmembers",label:"새가족",sub:`등록 ${newMembersCount}명`,icon:"newuser",bg:"#FFFBEB",color:"#D97706"},
    {id:"notices",label:"공지 · 일정",sub:`${noticesCount}건`,icon:"bullhorn",bg:"#F5F3FF",color:"#7C3AED"},
    {id:"prayers",label:"기도제목",sub:`응답대기 ${prayersCount}건`,icon:"prayhand",bg:"#FDF2F8",color:"#DB2777"},
    {id:"absenceContact",label:"결석자 연락",sub:"연락 이력 관리",icon:"contact",bg:"#FFF7ED",color:"#EA580C"},
    {id:"events",label:"수련회 · 행사",sub:"행사 참가 관리",icon:"calendar",bg:"#EFF6FF",color:"#2563EB"},
  ];
  return(
    <div>
      <div style={{marginBottom:16,padding:"12px 14px",background:"var(--primary-light)",borderRadius:"var(--radius)",border:"1px solid #BFDBFE"}}>
        <div style={{fontSize:13,fontWeight:600,color:"var(--primary)"}}>추가 기능 메뉴</div>
        <div style={{fontSize:12,color:"var(--gray-500)",marginTop:2}}>아래 메뉴를 선택하세요</div>
      </div>
      <div className="more-page-grid">
        {menus.map(m=>(
          <button key={m.id} className="more-page-btn" onClick={()=>setActiveNav(m.id)}>
            <div className="more-page-icon" style={{background:m.bg}}>
              <Icon name={m.icon} size={20} color={m.color}/>
            </div>
            <div>
              <div className="more-page-label">{m.label}</div>
              <div className="more-page-sub">{m.sub}</div>
            </div>
          </button>
        ))}
      </div>
      {/* 엑셀 내보내기 — 관리자만 */}
      {admin&&(
        <button className="more-page-btn" style={{width:"100%",flexDirection:"row",gap:12,padding:"14px 16px",background:"#F0FDF4",border:"1px solid #A7F3D0"}}
          onClick={()=>setActiveNav("excel")}>
          <div className="more-page-icon" style={{background:"#DCFCE7",flexShrink:0}}>
            <Icon name="note" size={20} color="#16A34A"/>
          </div>
          <div>
            <div className="more-page-label" style={{color:"#15803D"}}>📊 엑셀 내보내기</div>
            <div className="more-page-sub">청년/출석/새가족 데이터 다운로드</div>
          </div>
        </button>
      )}
    </div>
  );
}

// ==================== 공지/일정 페이지 ====================
function NoticePage({notices,admin,userEmail,onRefresh,setModal}){
  const [tab,setTab]=useState("all");
  const todayDate = today();
  const filtered = (() => {
    if(tab==="past") return notices.filter(n=>n.category==="schedule"&&n.event_date&&n.event_date<todayDate).sort((a,b)=>b.event_date.localeCompare(a.event_date));
    // 전체/공지/일정 탭에서는 지난 일정 제외
    const active = notices.filter(n=>{
      if(n.category==="schedule"&&n.event_date&&n.event_date<todayDate) return false; // 지난 일정 제외
      return true;
    });
    if(tab==="all") return active;
    if(tab==="notice") return active.filter(n=>n.category==="notice");
    if(tab==="schedule") return active.filter(n=>n.category==="schedule");
    return active;
  })();

  const deleteNotice=async(id)=>{
    if(!window.confirm("삭제하시겠습니까?")) return;
    await supabase.from("notices").delete().eq("id",id);
    onRefresh();
  };

  return(
    <div>
      <div className="tab-bar">
        <button className={`tab-item ${tab==="all"?"active":""}`} onClick={()=>setTab("all")}>전체</button>
        <button className={`tab-item ${tab==="notice"?"active":""}`} onClick={()=>setTab("notice")}>📢 공지</button>
        <button className={`tab-item ${tab==="schedule"?"active":""}`} onClick={()=>setTab("schedule")}>📅 일정</button>
        <button className={`tab-item ${tab==="past"?"active":""}`} onClick={()=>setTab("past")}>⏰ 지난</button>
      </div>
      {filtered.length===0?(
        <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">등록된 내용이 없습니다</div>{admin&&<div className="empty-state-sub">우측 상단 + 버튼으로 추가하세요</div>}</div>
      ):(
        filtered.map(n=>{
          const isSchedule=n.category==="schedule";
          const isPast=isSchedule&&n.event_date&&n.event_date<todayDate;
          const bg=isSchedule?"#F5F3FF":"#EFF6FF";
          const color=isSchedule?"#7C3AED":"#2563EB";
          return(
            <div key={n.id} className={`notice-card ${n.category}`}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <span style={{background:bg,color,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600}}>{isSchedule?"📅 일정":"📢 공지"}</span>
                    {n.event_date&&<span style={{fontSize:12,color:isPast?"var(--gray-400)":"var(--gray-500)"}}>{isPast?"⏰ 지난 일정 · ":""}{formatDate(n.event_date)}</span>}
                  </div>
                  <div className="notice-title">{n.title}</div>
                  {n.content&&<div className="notice-content">{n.content}</div>}
                  <div style={{fontSize:11,color:"var(--gray-400)",marginTop:6}}>{formatDate(n.created_at?.split("T")[0])}</div>
                </div>
                {admin&&(
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    <button className="btn-icon" style={{width:28,height:28}} onClick={()=>setModal({type:"editNotice",notice:n})}><Icon name="edit" size={13}/></button>
                    <button className="btn-icon danger" style={{width:28,height:28}} onClick={()=>deleteNotice(n.id)}><Icon name="trash" size={13}/></button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ==================== 기도제목 페이지 ====================
function PrayerPage({prayers,members,admin,userEmail,onRefresh,setModal}){
  const [tab,setTab]=useState("active");
  const filtered=tab==="active"?prayers.filter(p=>!p.is_answered):prayers.filter(p=>p.is_answered);
  const getMemberName=(id)=>members.find(m=>m.id===id)?.name||"알 수 없음";
  const authorLabel=(email)=>email?.replace("@hiyouth.com","")||"";

  const toggleAnswered=async(p)=>{
    await supabase.from("prayers").update({is_answered:!p.is_answered,answered_at:!p.is_answered?today():null}).eq("id",p.id);
    onRefresh();
  };
  const deletePrayer=async(id)=>{
    if(!window.confirm("삭제하시겠습니까?")) return;
    await supabase.from("prayers").delete().eq("id",id);
    onRefresh();
  };

  return(
    <div>
      <div className="tab-bar">
        <button className={`tab-item ${tab==="active"?"active":""}`} onClick={()=>setTab("active")}>🙏 기도 중 ({prayers.filter(p=>!p.is_answered).length})</button>
        <button className={`tab-item ${tab==="answered"?"active":""}`} onClick={()=>setTab("answered")}>✅ 응답됨 ({prayers.filter(p=>p.is_answered).length})</button>
      </div>
      {filtered.length===0?(
        <div className="empty-state"><div className="empty-state-icon">🙏</div><div className="empty-state-text">{tab==="active"?"기도제목이 없습니다":"응답된 기도가 없습니다"}</div>{admin&&tab==="active"&&<div className="empty-state-sub">우측 상단 + 버튼으로 추가하세요</div>}</div>
      ):(
        filtered.map(p=>(
          <div key={p.id} className={`prayer-card ${p.is_answered?"answered":""}`}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
              <div style={{flex:1}}>
                <div className="prayer-member">
                  👤 {getMemberName(p.member_id)}
                  {p.is_answered&&<span className="contact-done-badge" style={{marginLeft:6}}>✅ {p.answered_at?formatDate(p.answered_at):""}</span>}
                </div>
                <div className="prayer-content">{p.content}</div>
                <div className="prayer-meta">
                  <span>{formatDate(p.created_at?.split("T")[0])} · {authorLabel(p.author_email)}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {admin&&!p.is_answered&&(
                      <button className="contact-done-btn" onClick={()=>toggleAnswered(p)}>
                        <Icon name="check" size={12}/>응답 완료
                      </button>
                    )}
                    {admin&&p.is_answered&&(
                      <button className="contact-done-btn" style={{background:"var(--gray-100)",color:"var(--gray-500)",borderColor:"var(--gray-200)"}} onClick={()=>toggleAnswered(p)}>취소</button>
                    )}
                  </div>
                </div>
              </div>
              {admin&&(
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button className="btn-icon" style={{width:28,height:28}} onClick={()=>setModal({type:"editPrayer",prayer:p})}><Icon name="edit" size={13}/></button>
                  <button className="btn-icon danger" style={{width:28,height:28}} onClick={()=>deletePrayer(p.id)}><Icon name="trash" size={13}/></button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ==================== 결석자 연락 페이지 ====================
function AbsenceContactPage({members,attendanceList,absenceContacts,admin,userEmail,onRefresh}){
  const [contactModal,setContactModal]=useState(null);

  const absentMembers=members.filter(m=>{
    if(m.military) return false;
    const w=getAbsentWeeks(m.id,attendanceList);
    return w!==null&&w>=4;
  }).sort((a,b)=>(getAbsentWeeks(b.id,attendanceList)||0)-(getAbsentWeeks(a.id,attendanceList)||0));

  const getLastContact=(memberId)=>{
    const list=absenceContacts.filter(c=>c.member_id===memberId).sort((a,b)=>b.contact_date.localeCompare(a.contact_date));
    return list[0]||null;
  };
  const authorLabel=(email)=>email?.replace("@hiyouth.com","")||"";

  const saveContact=async(memberId,memo)=>{
    await supabase.from("absence_contacts").insert([{member_id:memberId,contact_date:today(),memo:memo.trim(),author_email:userEmail}]);
    onRefresh();
    setContactModal(null);
  };

  return(
    <div>
      {absentMembers.length===0?(
        <div className="empty-state"><div className="empty-state-icon">🎉</div><div className="empty-state-text">장기결석자가 없습니다</div><div className="empty-state-sub">모든 청년이 출석 중이에요!</div></div>
      ):(
        <>
          <div style={{fontSize:13,color:"var(--gray-500)",marginBottom:12}}>4주 이상 결석 중인 청년 · 총 {absentMembers.length}명</div>
          {absentMembers.map(m=>{
            const weeks=getAbsentWeeks(m.id,attendanceList)||0;
            const lastContact=getLastContact(m.id);
            return(
              <div key={m.id} className={`alert-item ${weeks>=8?"weekly":"warn"}`} style={{flexDirection:"column",gap:8,alignItems:"stretch"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div className={`member-avatar ${m.gender}`} style={{width:36,height:36,fontSize:13,flexShrink:0}}>{m.name.charAt(0)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"var(--gray-800)"}}>{m.name}</div>
                    <div style={{fontSize:12,color:"var(--gray-500)"}}>{weeks>=8?`🔴 ${weeks}주째 결석`:`🟡 ${weeks}주째 결석`}{m.phone&&<> · <a href={`tel:${m.phone}`} className="phone-link">{m.phone}</a></>}</div>
                  </div>
                </div>
                {lastContact?(
                  <div style={{background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"6px 10px",fontSize:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span className="contact-done-badge">✅ {formatDate(lastContact.contact_date)} 연락완료</span>
                      <span style={{fontSize:11,color:"var(--gray-400)"}}>{authorLabel(lastContact.author_email)}</span>
                    </div>
                    {lastContact.memo&&<div style={{marginTop:4,color:"var(--gray-600)"}}>{lastContact.memo}</div>}
                  </div>
                ):(
                  <div style={{fontSize:12,color:"var(--gray-400)"}}>연락 기록 없음</div>
                )}
                {admin&&(
                  <button className="contact-done-btn" style={{width:"100%",justifyContent:"center"}} onClick={()=>setContactModal(m)}>
                    <Icon name="phone" size={14}/>연락 완료 기록하기
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
      {contactModal&&<ContactMemoModal member={contactModal} onSave={(memo)=>saveContact(contactModal.id,memo)} onClose={()=>setContactModal(null)}/>}
    </div>
  );
}

// ==================== 연락 메모 모달 ====================
function ContactMemoModal({member,onSave,onClose}){
  const [memo,setMemo]=useState("");
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">📞 연락 완료 기록</div>
        <div style={{background:"var(--primary-light)",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:"var(--primary)"}}>
          <strong>{member.name}</strong> 님과 연락한 내용을 기록해 두세요
        </div>
        <div className="form-group">
          <label className="form-label">메모 <span className="optional">(선택)</span></label>
          <textarea className="form-input" placeholder="예) 카톡으로 연락, 다음 주 출석 예정" value={memo} onChange={e=>setMemo(e.target.value)} rows={3} style={{resize:"none",lineHeight:1.6}}/>
        </div>
        <button className="btn btn-primary" onClick={()=>onSave(memo)}>
          <Icon name="check" size={16} color="white"/>연락 완료 저장
        </button>
      </div>
    </div>
  );
}

// ==================== 공지 작성/수정 폼 ====================
function NoticeFormModal({initial,userEmail,onSave,onClose}){
  const [title,setTitle]=useState(initial?.title||"");
  const [content,setContent]=useState(initial?.content||"");
  const [category,setCategory]=useState(initial?.category||"notice");
  const [eventDate,setEventDate]=useState(initial?.event_date||"");
  const [saving,setSaving]=useState(false);

  const submit=async()=>{
    if(!title.trim()){alert("제목을 입력해주세요");return;}
    setSaving(true);
    await onSave({title:title.trim(),content:content.trim(),category,event_date:eventDate||null,author_email:userEmail});
    setSaving(false);
  };

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">{initial?"공지/일정 수정":"공지/일정 등록"}</div>
        <div className="form-group">
          <label className="form-label">유형</label>
          <div style={{display:"flex",gap:8}}>
            {[{v:"notice",l:"📢 공지"},{v:"schedule",l:"📅 일정"}].map(c=>(
              <button key={c.v} className="btn" style={{flex:1,padding:"10px",background:category===c.v?"var(--primary)":"var(--gray-100)",color:category===c.v?"white":"var(--gray-600)",fontSize:14,fontWeight:600}} onClick={()=>setCategory(c.v)}>{c.l}</button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">제목 <span style={{color:"#EF4444"}}>*</span></label>
          <input className="form-input" placeholder="제목 입력" value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        {category==="schedule"&&(
          <div className="form-group">
            <label className="form-label">일정 날짜 <span className="optional">(선택)</span></label>
            <input className="form-input" type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)}/>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">내용 <span className="optional">(선택)</span></label>
          <textarea className="form-input" placeholder="내용 입력" value={content} onChange={e=>setContent(e.target.value)} rows={4} style={{resize:"none",lineHeight:1.6}}/>
        </div>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          <Icon name="check" size={16} color="white"/>{saving?"저장 중...":initial?"수정 완료":"등록하기"}
        </button>
      </div>
    </div>
  );
}

// ==================== 기도제목 작성/수정 폼 ====================
function PrayerFormModal({members,initial,userEmail,onSave,onClose}){
  const [memberId,setMemberId]=useState(initial?.member_id||"");
  const [searchText,setSearchText]=useState(()=>{
    if(initial?.member_id){
      const m=members.find(m=>m.id===initial.member_id);
      return m?m.name:"";
    }
    return "";
  });
  const [showList,setShowList]=useState(false);
  const [content,setContent]=useState(initial?.content||"");
  const [saving,setSaving]=useState(false);

  const activeMembers=sortByName(members.filter(m=>!m.military&&m.is_active!==false));
  const filtered=searchText.trim()
    ? activeMembers.filter(m=>m.name.includes(searchText.trim()))
    : activeMembers;

  const selectedMember=members.find(m=>m.id===memberId);

  const handleSelect=(m)=>{
    setMemberId(m.id);
    setSearchText(m.name);
    setShowList(false);
  };

  const handleSearchChange=(e)=>{
    setSearchText(e.target.value);
    setMemberId(""); // 검색어 바꾸면 선택 초기화
    setShowList(true);
  };

  const submit=async()=>{
    if(!memberId){alert("청년을 선택해주세요");return;}
    if(!content.trim()){alert("기도제목을 입력해주세요");return;}
    setSaving(true);
    await onSave({member_id:memberId,content:content.trim(),author_email:userEmail,is_answered:false});
    setSaving(false);
  };

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">{initial?"기도제목 수정":"기도제목 등록"}</div>

        {/* 이름 검색 입력 */}
        <div className="form-group" style={{position:"relative"}}>
          <label className="form-label">청년 이름 검색 <span style={{color:"#EF4444"}}>*</span></label>
          <div className="input-with-icon">
            <span className="input-icon"><Icon name="users" size={15}/></span>
            <input
              className="form-input"
              style={{paddingLeft:38}}
              placeholder="이름 입력 후 선택..."
              value={searchText}
              onChange={handleSearchChange}
              onFocus={()=>setShowList(true)}
              autoComplete="off"
            />
            {/* 선택된 경우 체크 표시 */}
            {memberId&&(
              <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#10B981",fontSize:14}}>✓</span>
            )}
          </div>

          {/* 자동완성 드롭다운 */}
          {showList&&searchText.trim()&&(
            <div style={{
              position:"absolute",top:"100%",left:0,right:0,
              background:"var(--white)",border:"1.5px solid var(--primary)",
              borderRadius:"var(--radius)",boxShadow:"var(--shadow-md)",
              zIndex:300,maxHeight:200,overflowY:"auto",marginTop:2,
            }}>
              {filtered.length===0?(
                <div style={{padding:"12px 14px",fontSize:13,color:"var(--gray-400)",textAlign:"center"}}>
                  일치하는 청년이 없습니다
                </div>
              ):(
                filtered.map(m=>(
                  <div key={m.id}
                    onClick={()=>handleSelect(m)}
                    style={{
                      display:"flex",alignItems:"center",gap:10,
                      padding:"10px 14px",cursor:"pointer",
                      background:memberId===m.id?"var(--primary-light)":"transparent",
                      borderBottom:"1px solid var(--gray-100)",
                      transition:"background 0.1s",
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--primary-light)"}
                    onMouseLeave={e=>e.currentTarget.style.background=memberId===m.id?"var(--primary-light)":"transparent"}
                  >
                    <div className={`member-avatar ${m.gender}`} style={{width:30,height:30,fontSize:12,flexShrink:0}}>
                      {m.name.charAt(0)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:600,color:"var(--gray-800)"}}>{m.name}</div>
                      <div style={{fontSize:11,color:"var(--gray-400)"}}>
                        {m.gender==="male"?"남":"여"}
                        {m.birth_year&&` · ${m.birth_year}년생`}
                        {m.sam_id&&members&&` · ${members.find?.(s=>s.id===m.sam_id)?.name||""}샘`}
                      </div>
                    </div>
                    {memberId===m.id&&<span style={{color:"#10B981",fontSize:14}}>✓</span>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 선택된 청년 표시 */}
        {selectedMember&&(
          <div style={{
            background:"var(--primary-light)",border:"1px solid #BFDBFE",
            borderRadius:"var(--radius)",padding:"10px 14px",
            marginBottom:16,display:"flex",alignItems:"center",gap:10,
          }}>
            <div className={`member-avatar ${selectedMember.gender}`} style={{width:34,height:34,fontSize:13}}>
              {selectedMember.name.charAt(0)}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:"var(--primary)"}}>{selectedMember.name}</div>
              <div style={{fontSize:12,color:"var(--gray-500)"}}>선택됨 ✓</div>
            </div>
            <button style={{background:"none",border:"none",color:"var(--gray-400)",cursor:"pointer",fontSize:16}}
              onClick={()=>{setMemberId("");setSearchText("");setShowList(false);}}>✕</button>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">기도제목 <span style={{color:"#EF4444"}}>*</span></label>
          <textarea className="form-input" placeholder="기도제목을 입력하세요"
            value={content} onChange={e=>setContent(e.target.value)}
            rows={4} style={{resize:"none",lineHeight:1.6}}/>
        </div>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          <Icon name="check" size={16} color="white"/>{saving?"저장 중...":initial?"수정 완료":"등록하기"}
        </button>
      </div>
    </div>
  );
}

// ==================== 새가족 메모 팝업 시트 ====================
function NewMemberMemoSheet({newMember, memos, userEmail, canWrite, onClose, onRefresh}){
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);

  const authorLabel = (email) => email?.replace("@hiyouth.com","") || "";

  // 내림차순 정렬 (최신 먼저)
  const sortedMemos = [...memos].sort((a,b)=>b.date.localeCompare(a.date));

  const saveMemo = async () => {
    if(!content.trim()){alert("메모 내용을 입력해주세요");return;}
    setSaving(true);
    if(editingMemo){
      await supabase.from("new_member_memos").update({
        content: content.trim(),
        date: editingMemo.date,
      }).eq("id", editingMemo.id);
    } else {
      await supabase.from("new_member_memos").insert([{
        new_member_id: newMember.id,
        date: today(),
        content: content.trim(),
        author_email: userEmail,
      }]);
    }
    setSaving(false);
    setContent("");
    setShowInput(false);
    setEditingMemo(null);
    onRefresh();
  };

  const deleteMemo = async (id) => {
    if(!window.confirm("메모를 삭제하시겠습니까?")) return;
    await supabase.from("new_member_memos").delete().eq("id", id);
    onRefresh();
  };

  const startEdit = (memo) => {
    setEditingMemo(memo);
    setContent(memo.content);
    setShowInput(true);
  };

  const 취소Input = () => {
    setShowInput(false);
    setContent("");
    setEditingMemo(null);
  };

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>

        {/* 헤더 */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div className={`member-avatar ${newMember.gender}`} style={{width:38,height:38,fontSize:14}}>
            {newMember.name.charAt(0)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700,color:"var(--gray-900)"}}>{newMember.name}</div>
            <div style={{fontSize:12,color:"var(--gray-400)"}}>새가족 메모</div>
          </div>
          {canWrite&&!showInput&&(
            <button className="btn-icon" onClick={()=>{setShowInput(true);setEditingMemo(null);setContent("");}}>
              <Icon name="plus" size={16}/>
            </button>
          )}
        </div>

        {/* 메모 입력 폼 */}
        {showInput&&(
          <div style={{background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:"var(--radius)",padding:"12px",marginBottom:14}}>
            <div style={{fontSize:12,fontWeight:600,color:"#7C3AED",marginBottom:8}}>
              {editingMemo?"✏️ 메모 수정":"📝 새 메모 작성"} · {formatDate(editingMemo?.date||today())}
            </div>
            <textarea
              className="form-input"
              placeholder="메모 내용을 입력하세요"
              value={content}
              onChange={e=>setContent(e.target.value)}
              rows={3}
              style={{resize:"none",lineHeight:1.6,marginBottom:8}}
              autoFocus
            />
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-primary" style={{flex:1,padding:"9px"}} onClick={saveMemo} disabled={saving}>
                <Icon name="check" size={14} color="white"/>
                {saving?"저장 중...":editingMemo?"수정 완료":"저장"}
              </button>
              <button className="btn btn-secondary" style={{padding:"9px 16px"}} onClick={취소Input}>취소</button>
            </div>
          </div>
        )}

        {/* 메모 목록 */}
        {sortedMemos.length===0?(
          <div className="empty-state" style={{padding:"30px 20px"}}>
            <div className="empty-state-icon" style={{fontSize:36}}>📝</div>
            <div className="empty-state-text">메모가 없습니다</div>
            {canWrite&&<div className="empty-state-sub">우측 상단 + 버튼으로 추가하세요</div>}
          </div>
        ):(
          sortedMemos.map(memo=>(
            <div key={memo.id} className="memo-card">
              <div className="memo-date">
                <span>📅 {formatDate(memo.date)}</span>
                {canWrite&&(
                  <div style={{display:"flex",gap:4}}>
                    <button className="btn-icon" style={{width:24,height:24}} onClick={()=>startEdit(memo)}>
                      <Icon name="edit" size={11}/>
                    </button>
                    <button className="btn-icon danger" style={{width:24,height:24}} onClick={()=>deleteMemo(memo.id)}>
                      <Icon name="trash" size={11}/>
                    </button>
                  </div>
                )}
              </div>
              <div className="memo-content">{memo.content}</div>
              <div className="memo-author">👤 {authorLabel(memo.author_email)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== 비활성 처리 모달 ====================
function InactivateModal({member, onSave, onClose}){
  const [reason, setReason] = useState("");
  const reasons = ["타 교회 이적","장로부 이동","지역 이동","개인 사정","기타"];

  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-title">비활성 처리</div>
        <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:13,color:"#92400E"}}>
          <strong>{member.name}</strong> 님을 비활성 처리합니다.<br/>
          출석/통계에서 제외되지만 데이터는 보존됩니다.
        </div>
        <div className="form-group">
          <label className="form-label">비활성 사유</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {reasons.map(r=>(
              <button key={r} className="btn btn-sm"
                style={{background:reason===r?"#F97316":"var(--gray-100)",color:reason===r?"white":"var(--gray-600)",padding:"6px 12px",fontSize:12}}
                onClick={()=>setReason(r)}>{r}</button>
            ))}
          </div>
          <input className="form-input" placeholder="직접 입력 또는 위에서 선택"
            value={reason} onChange={e=>setReason(e.target.value)}/>
        </div>
        <button className="btn btn-primary" style={{background:"#F97316"}}
          onClick={()=>{if(!reason.trim()){alert("사유를 입력해주세요");return;}onSave(reason.trim());}}>
          <Icon name="logout" size={16} color="white"/>비활성 처리
        </button>
        <button className="btn btn-secondary" style={{width:"100%",marginTop:8}} onClick={onClose}>취소</button>
      </div>
    </div>
  );
}

// ==================== 나눔 기록 전체 목록 ====================
function AllNotesPage({members, sams, userEmail, onSelectMember}){
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMember, setFilterMember] = useState("");
  const [search, setSearch] = useState("");

  const canViewAll = canViewAllNotes(userEmail);

  useEffect(()=>{
    const fetchNotes = async () => {
      setLoading(true);
      let query = supabase.from("pastoral_notes").select("*").order("date",{ascending:false});
      if(!canViewAll) query = query.eq("author_email", userEmail);
      const {data} = await query;
      if(data) setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  },[]);

  const getMember = (id) => members.find(m=>m.id===id);
  const getSamName = (samId) => sams.find(s=>s.id===samId)?.name||"";
  const authorLabel = (email) => email?.replace("@hiyouth.com","")||"";
  const methodLabel = (m) => m==="face"?"👤 대면":m==="phone"?"📞 전화":m==="chat"?"💬 카톡":m||"";

  // 청년 필터 목록
  const memberOptions = [...new Set(notes.map(n=>n.member_id))]
    .map(id=>getMember(id))
    .filter(Boolean)
    .sort((a,b)=>a.name.localeCompare(b.name,"ko"));

  const filtered = notes.filter(n=>{
    if(filterMember && n.member_id!==filterMember) return false;
    if(search){
      const m = getMember(n.member_id);
      if(!m?.name.includes(search)) return false;
    }
    return true;
  });

  return(
    <div>
      {/* 검색/필터 */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <div className="search-bar" style={{flex:1,margin:0}}>
          <span className="search-icon"><Icon name="users" size={16}/></span>
          <input placeholder="이름 검색..." value={search} onChange={e=>{setSearch(e.target.value);setFilterMember("");}}/>
        </div>
        <select className="form-select" style={{width:"auto",minWidth:100,fontSize:13}}
          value={filterMember} onChange={e=>setFilterMember(e.target.value)}>
          <option value="">전체</option>
          {memberOptions.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      <div style={{fontSize:12,color:"var(--gray-400)",marginBottom:10}}>
        총 {filtered.length}건{!canViewAll&&" (본인 작성)"}
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:40,color:"var(--gray-400)"}}>
          <div className="spinner" style={{margin:"0 auto 12px"}}/>
        </div>
      ):filtered.length===0?(
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">나눔 기록이 없습니다</div>
        </div>
      ):(
        filtered.map(note=>{
          const member = getMember(note.member_id);
          if(!member) return null;
          return(
            <div key={note.id} className="note-card" style={{cursor:"pointer"}}
              onClick={()=>onSelectMember(member)}>
              <div className="note-card-header">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className={`member-avatar ${member.gender}`} style={{width:32,height:32,fontSize:13,flexShrink:0}}>
                    {member.military?"🪖":member.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"var(--gray-800)"}}>{member.name}</div>
                    <div style={{fontSize:11,color:"var(--gray-400)"}}>{getSamName(member.sam_id)&&`${getSamName(member.sam_id)}샘 · `}{formatDate(note.date)}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:"var(--gray-500)"}}>{methodLabel(note.method)}</span>
                </div>
              </div>
              <div className="note-author" style={{marginBottom:0}}>
                <span style={{background:"#EFF6FF",color:"#2563EB",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600}}>
                  👤 {authorLabel(note.author_email)}
                </span>
              </div>
              {note.content&&(
                <div style={{fontSize:13,color:"var(--gray-600)",marginTop:8,lineHeight:1.6,
                  overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
                  WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                  {note.content}
                </div>
              )}
              {note.prayer&&(
                <div style={{fontSize:12,color:"#7C3AED",marginTop:6,background:"#F5F3FF",borderRadius:6,padding:"4px 8px"}}>
                  🙏 {note.prayer}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ==================== 엑셀 내보내기 ====================
function ExcelExportPage({members, sams, attendanceList, samAttendanceList, newMembers, admin}){
  const [startDate, setStartDate] = useState(()=>{
    const d = new Date(); d.setMonth(d.getMonth()-1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(today());
  const [exporting, setExporting] = useState(false);

  if(!admin) return(
    <div className="empty-state">
      <div className="empty-state-icon">🔒</div>
      <div className="empty-state-text">관리자만 접근 가능합니다</div>
    </div>
  );

  const getSamName = (id) => sams.find(s=>s.id===id)?.name||"미지정";

  const exportExcel = async () => {
    setExporting(true);
    try {
      const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs");

      const wb = XLSX.utils.book_new();

      // ===== 시트 1: 청년 명단 =====
      const activeMembers = members.filter(m=>m.is_active!==false);
      const sheet1Data = [
        ["이름","성별","출생년도","생일","전화번호","샘","등록일","군복무"],
        ...sortByName(activeMembers).map(m=>[
          m.name,
          m.gender==="male"?"남":"여",
          m.birth_year||"",
          m.birthday||"",
          m.phone||"",
          getSamName(m.sam_id),
          m.assigned_at||"",
          m.military?"예":"아니오",
        ])
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
      ws1["!cols"] = [{wch:10},{wch:6},{wch:10},{wch:8},{wch:14},{wch:10},{wch:12},{wch:8}];
      XLSX.utils.book_append_sheet(wb, ws1, "청년 명단");

      // ===== 시트 2: 예배참석 현황 =====
      const isSunday = d => new Date(d+"T00:00:00").getDay()===0;
      const sundayDates = [...new Set(
        attendanceList
          .filter(a=>a.status&&isSunday(a.date)&&a.date>=startDate&&a.date<=endDate)
          .map(a=>a.date)
      )].sort();
      const attendanceMembers = sortByName(members.filter(m=>!m.military&&m.is_active!==false));
      const sheet2Data = [
        ["이름","샘",...sundayDates.map(d=>formatDate(d))],
        ...attendanceMembers.map(m=>[
          m.name,
          getSamName(m.sam_id),
          ...sundayDates.map(d=>{
            const rec = attendanceList.find(a=>a.member_id===m.id&&a.date===d);
            return rec?.status?"O":"";
          })
        ])
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
      ws2["!cols"] = [{wch:10},{wch:10},...sundayDates.map(()=>({wch:10}))];
      XLSX.utils.book_append_sheet(wb, ws2, "예배참석 현황");

      // ===== 시트 3: 샘별참석 현황 =====
      const samDates = [...new Set(
        samAttendanceList
          .filter(a=>a.status&&isSunday(a.date)&&a.date>=startDate&&a.date<=endDate)
          .map(a=>a.date)
      )].sort();
      const sheet3Data = [
        ["이름","샘",...samDates.map(d=>formatDate(d))],
        ...sams.flatMap(s=>{
          const samMembers = sortByName(members.filter(m=>m.sam_id===s.id&&!m.military&&m.is_active!==false));
          return samMembers.map(m=>[
            m.name,
            getSamName(m.sam_id),
            ...samDates.map(d=>{
              const rec = samAttendanceList.find(a=>a.member_id===m.id&&a.date===d&&a.sam_id===s.id);
              return rec?.status?"O":"";
            })
          ]);
        })
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);
      ws3["!cols"] = [{wch:10},{wch:10},...samDates.map(()=>({wch:10}))];
      XLSX.utils.book_append_sheet(wb, ws3, "샘별참석 현황");

      // ===== 시트 4: 새가족 현황 =====
      const sheet4Data = [
        ["이름","성별","전화번호","등록일","4주교육완료일","샘배정일","배정된샘"],
        ...sortByName(newMembers).map(m=>[
          m.name,
          m.gender==="male"?"남":"여",
          m.phone||"",
          m.registered_at||"",
          m.edu_completed_at||"",
          "",
          "",
        ]),
        ...sortByName(members.filter(m=>m.new_member_registered_at&&m.is_active!==false)).map(m=>[
          m.name+" (전환)",
          m.gender==="male"?"남":"여",
          m.phone||"",
          m.new_member_registered_at||"",
          "",
          m.assigned_at||"",
          getSamName(m.sam_id),
        ])
      ];
      const ws4 = XLSX.utils.aoa_to_sheet(sheet4Data);
      ws4["!cols"] = [{wch:12},{wch:6},{wch:14},{wch:12},{wch:14},{wch:12},{wch:10}];
      XLSX.utils.book_append_sheet(wb, ws4, "새가족 현황");

      // 다운로드
      const now = new Date();
      const fileName = `학익청년부_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch(e) {
      console.error(e);
      alert("엑셀 생성 중 오류가 발생했습니다.");
    }
    setExporting(false);
  };

  return(
    <div>
      <div style={{background:"#F0FDF4",border:"1px solid #A7F3D0",borderRadius:"var(--radius-lg)",padding:"14px 16px",marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:600,color:"#15803D",marginBottom:4}}>📊 엑셀 파일 구성</div>
        <div style={{fontSize:12,color:"#166534",lineHeight:1.8}}>
          시트 1 — 청년 명단<br/>
          시트 2 — 예배참석 현황 (기간 선택)<br/>
          시트 3 — 샘별참석 현황 (기간 선택)<br/>
          시트 4 — 새가족 현황
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="card" style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:600,color:"var(--gray-700)",marginBottom:10}}>
          📅 출석 현황 기간 선택
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"var(--gray-400)",marginBottom:4}}>시작일</div>
            <input className="form-input" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/>
          </div>
          <div style={{color:"var(--gray-400)",marginTop:16}}>~</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:"var(--gray-400)",marginBottom:4}}>종료일</div>
            <input className="form-input" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}/>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" style={{width:"100%",background:"#16A34A",padding:"14px",fontSize:15}}
        onClick={exportExcel} disabled={exporting}>
        <Icon name="note" size={18} color="white"/>
        {exporting?"생성 중...":"📥 엑셀 파일 다운로드"}
      </button>
      <div style={{fontSize:11,color:"var(--gray-400)",textAlign:"center",marginTop:8}}>
        파일명: 학익청년부_날짜.xlsx
      </div>
    </div>
  );
}

// ==================== 수련회/행사 페이지 ====================
const EVENT_STATUS = {
  all:        { label:"전체 참가",      short:"전체",    color:"#10B981", bg:"#ECFDF5" },
  day1_eve:   { label:"첫날 저녁부터",  short:"첫날저녁~", color:"#3B82F6", bg:"#EFF6FF" },
  day2_morn:  { label:"둘째날 오전부터",short:"둘째오전~", color:"#6366F1", bg:"#EEF2FF" },
  day2_aft:   { label:"둘째날 오후부터",short:"둘째오후~", color:"#8B5CF6", bg:"#F5F3FF" },
  day2_eve:   { label:"둘째날 저녁부터",short:"둘째저녁~", color:"#A855F7", bg:"#FAF5FF" },
  absent:     { label:"불참",           short:"불참",    color:"#EF4444", bg:"#FEF2F2" },
  unknown:    { label:"미정",           short:"미정",    color:"#94A3B8", bg:"#F8FAFC" },
};

// 세션별 참가 여부 계산
const getSessionMembers = (status, participants, members) => {
  const order = ["all","day1_eve","day2_morn","day2_aft","day2_eve"];
  return members.filter(m=>{
    const p = participants.find(p=>p.member_id===m.id);
    if(!p) return false;
    const pidx = order.indexOf(p.status);
    const sidx = order.indexOf(status);
    if(pidx===-1) return false;
    return pidx <= sidx;
  });
};

function EventsPage({events,eventParticipants,eventGuests,members,sams,userEmail,admin,onRefresh,setActiveNav}){
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const canManage = admin && ["leader0","leader1","leader2"].includes(userEmail?.replace("@hiyouth.com",""));

  const deleteEvent = async (id) => {
    if(!window.confirm("행사를 삭제하시겠습니까?\n참가 기록도 모두 삭제됩니다.")) return;
    await supabase.from("events").delete().eq("id",id);
    onRefresh();
  };

  if(selectedEvent) {
    return(
      <EventDetailPage
        event={selectedEvent}
        participants={eventParticipants.filter(p=>p.event_id===selectedEvent.id)}
        guests={eventGuests.filter(g=>g.event_id===selectedEvent.id)}
        members={members} sams={sams}
        userEmail={userEmail} admin={admin}
        canManage={canManage}
        onRefresh={onRefresh}
        onBack={()=>setSelectedEvent(null)}
      />
    );
  }

  return(
    <div>
      {events.length===0?(
        <div className="empty-state">
          <div className="empty-state-icon">🏕️</div>
          <div className="empty-state-text">등록된 행사가 없습니다</div>
          {canManage&&<div className="empty-state-sub">+ 버튼으로 행사를 추가하세요</div>}
        </div>
      ):(
        events.map(ev=>{
          const parts = eventParticipants.filter(p=>p.event_id===ev.id);
          const going = parts.filter(p=>p.status!=="absent"&&p.status!=="unknown").length;
          const total = members.filter(m=>m.is_active!==false&&!m.military).length;
          const guests = eventGuests.filter(g=>g.event_id===ev.id);
          const guestTotal = guests.reduce((a,g)=>a+g.count,0);
          return(
            <div key={ev.id} className="card" style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setSelectedEvent(ev)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:700,color:"var(--gray-900)",marginBottom:4}}>🏕️ {ev.title}</div>
                  <div style={{fontSize:13,color:"var(--gray-500)",marginBottom:6}}>
                    📅 {formatDate(ev.event_date)}{ev.end_date&&ev.end_date!==ev.event_date?` ~ ${formatDate(ev.end_date)}`:""}
                  </div>
                  {ev.description&&<div style={{fontSize:12,color:"var(--gray-400)",marginBottom:6}}>{ev.description}</div>}
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,background:"#ECFDF5",color:"#10B981",borderRadius:20,padding:"2px 8px",fontWeight:600}}>
                      청년 {going}/{total}명
                    </span>
                    {guestTotal>0&&(
                      <span style={{fontSize:12,background:"#EFF6FF",color:"#2563EB",borderRadius:20,padding:"2px 8px",fontWeight:600}}>
                        게스트 {guestTotal}명
                      </span>
                    )}
                    <span style={{fontSize:12,background:"var(--gray-100)",color:"var(--gray-600)",borderRadius:20,padding:"2px 8px",fontWeight:600}}>
                      총 {going+guestTotal}명
                    </span>
                  </div>
                </div>
                {canManage&&(
                  <div style={{display:"flex",gap:4,flexShrink:0}}>
                    <button className="btn-icon" onClick={e=>{e.stopPropagation();setEditingEvent(ev);setShowForm(true);}}><Icon name="edit" size={14}/></button>
                    <button className="btn-icon danger" onClick={e=>{e.stopPropagation();deleteEvent(ev.id);}}><Icon name="trash" size={14}/></button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {canManage&&(
        <button className="fab" onClick={()=>{setEditingEvent(null);setShowForm(true);}}>
          <Icon name="plus" size={22} color="white"/>
        </button>
      )}

      {showForm&&(
        <EventFormModal
          initial={editingEvent}
          userEmail={userEmail}
          onSave={async(d)=>{
            if(editingEvent){
              await supabase.from("events").update(d).eq("id",editingEvent.id);
            } else {
              await supabase.from("events").insert([d]);
            }
            await onRefresh();
            setShowForm(false);
            setEditingEvent(null);
          }}
          onClose={()=>{setShowForm(false);setEditingEvent(null);}}
        />
      )}
    </div>
  );
}

// ==================== 행사 상세 / 참가 체크 ====================
function EventDetailPage({event,participants,guests,members,sams,userEmail,admin,canManage,onRefresh,onBack}){
  const [tab,setTab]=useState("summary"); // summary | check | session | sam
  const [sessionView,setSessionView]=useState("all");
  const [showGuestForm,setShowGuestForm]=useState(false);

  const userId = userEmail?.replace("@hiyouth.com","");
  // leader0,1,2 = 전체관리 / leader3~7 = 샘장 (체크 가능) / youth = 조회만
  const canCheckAll = admin; // 모든 관리자(leader0~7)는 체크 가능

  const activeMembers = sortByName(members.filter(m=>m.is_active!==false&&!m.military));
  const guestTotal = guests.reduce((a,g)=>a+g.count,0);

  // 참가 카운트
  const counts = Object.keys(EVENT_STATUS).reduce((acc,k)=>{
    acc[k] = participants.filter(p=>p.status===k).length;
    return acc;
  },{});
  const goingCount = participants.filter(p=>p.status!=="absent"&&p.status!=="unknown").length;

  // 세션별 인원
  const sessions = [
    {key:"all",      label:"첫날 오후"},
    {key:"day1_eve", label:"첫날 저녁"},
    {key:"day2_morn",label:"둘째날 오전"},
    {key:"day2_aft", label:"둘째날 오후"},
    {key:"day2_eve", label:"둘째날 저녁"},
  ];

  const updateParticipant = async (memberId, status, memo) => {
    const existing = participants.find(p=>p.member_id===memberId);
    if(existing){
      await supabase.from("event_participants").update({status,memo:memo||existing.memo||"",updated_at:new Date().toISOString()}).eq("id",existing.id);
    } else {
      await supabase.from("event_participants").insert([{event_id:event.id,member_id:memberId,status,memo:memo||"",author_email:userEmail}]);
    }
    onRefresh();
  };

  const deleteGuest = async (id) => {
    if(!window.confirm("삭제하시겠습니까?")) return;
    await supabase.from("event_guests").delete().eq("id",id);
    onRefresh();
  };

  return(
    <div>
      {/* 뒤로가기 + 제목 */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <button className="btn-icon" style={{background:"var(--gray-100)",color:"var(--gray-600)"}} onClick={onBack}>
          <Icon name="back" size={18}/>
        </button>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:"var(--gray-900)"}}>{event.title}</div>
          <div style={{fontSize:12,color:"var(--gray-400)"}}>
            📅 {formatDate(event.event_date)}{event.end_date&&event.end_date!==event.event_date?` ~ ${formatDate(event.end_date)}`:""}
          </div>
        </div>
      </div>

      {/* 탭 — 스크롤 시 고정 */}
      <div style={{
        position:"sticky", top:0, zIndex:10,
        background:"var(--bg)", paddingBottom:4,
        marginBottom:10, marginLeft:-16, marginRight:-16,
        paddingLeft:16, paddingRight:16,
        boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div className="tab-bar" style={{marginBottom:0}}>
          <button className={`tab-item ${tab==="summary"?"active":""}`} onClick={()=>setTab("summary")}>📊 현황</button>
          <button className={`tab-item ${tab==="check"?"active":""}`} onClick={()=>setTab("check")}>✅ 체크</button>
          <button className={`tab-item ${tab==="session"?"active":""}`} onClick={()=>setTab("session")}>📅 세션별</button>
          <button className={`tab-item ${tab==="sam"?"active":""}`} onClick={()=>setTab("sam")}>🌱 샘별</button>
        </div>
      </div>

      {/* 현황 탭 */}
      {tab==="summary"&&(
        <div>
          {/* 전체 요약 */}
          <div className="card" style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--gray-700)",marginBottom:10}}>청년부 참가 현황</div>
            {Object.entries(EVENT_STATUS).map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:13,color:"var(--gray-600)"}}>{v.label}</span>
                <span style={{fontSize:14,fontWeight:700,color:v.color,background:v.bg,borderRadius:20,padding:"2px 10px"}}>{counts[k]||0}명</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid var(--gray-100)",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600}}>참가 소계</span>
              <span style={{fontSize:15,fontWeight:800,color:"#10B981"}}>{goingCount}명</span>
            </div>
          </div>

          {/* 게스트 */}
          <div className="card" style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--gray-700)"}}>게스트</div>
              {canManage&&<button className="btn-icon" onClick={()=>setShowGuestForm(true)}><Icon name="plus" size={14}/></button>}
            </div>
            {guests.length===0?(
              <div style={{fontSize:13,color:"var(--gray-400)",textAlign:"center",padding:"10px 0"}}>게스트 없음</div>
            ):(
              guests.map(g=>(
                <div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <span style={{fontSize:13,color:"var(--gray-700)",fontWeight:600}}>{g.group_name}</span>
                    {g.memo&&<span style={{fontSize:11,color:"var(--gray-400)",marginLeft:6}}>{g.memo}</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#2563EB"}}>{g.count}명</span>
                    {canManage&&<button className="btn-icon danger" style={{width:24,height:24}} onClick={()=>deleteGuest(g.id)}><Icon name="trash" size={11}/></button>}
                  </div>
                </div>
              ))
            )}
            {guests.length>0&&(
              <div style={{borderTop:"1px solid var(--gray-100)",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:13,fontWeight:600}}>게스트 소계</span>
                <span style={{fontSize:15,fontWeight:800,color:"#2563EB"}}>{guestTotal}명</span>
              </div>
            )}
          </div>

          {/* 총 인원 */}
          <div style={{background:"var(--primary)",borderRadius:"var(--radius-lg)",padding:"16px",textAlign:"center",color:"white"}}>
            <div style={{fontSize:12,opacity:0.85,marginBottom:4}}>전체 총 인원</div>
            <div style={{fontSize:36,fontWeight:800,fontFamily:"'Montserrat',sans-serif"}}>{goingCount+guestTotal}명</div>
            <div style={{fontSize:12,opacity:0.75,marginTop:4}}>청년 {goingCount}명 + 게스트 {guestTotal}명</div>
          </div>

          {/* 미정자 명단 */}
          {counts.unknown>0&&(
            <div className="card" style={{marginTop:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--gray-700)",marginBottom:8}}>❓ 미정 · 미확인 ({counts.unknown}명)</div>
              {activeMembers.filter(m=>{
                const p=participants.find(p=>p.member_id===m.id);
                return !p||p.status==="unknown";
              }).map(m=>(
                <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:600}}>{m.name}</span>
                    {sams.find(s=>s.id===m.sam_id)&&<span style={{fontSize:11,color:"var(--gray-400)",marginLeft:6}}>{sams.find(s=>s.id===m.sam_id).name}샘</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 체크 탭 */}
      {tab==="check"&&(
        <div>
          <CheckBySam
            sams={sams}
            activeMembers={activeMembers}
            participants={participants}
            userEmail={userEmail}
            canCheckAll={canCheckAll}
            userId={userId}
            updateParticipant={updateParticipant}
          />
        </div>
      )}

      {/* 세션별 탭 */}
      {tab==="session"&&(
        <div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
            {sessions.map(s=>(
              <button key={s.key}
                className={`btn btn-sm ${sessionView===s.key?"btn-primary":"btn-secondary"}`}
                style={{whiteSpace:"nowrap",padding:"6px 12px"}}
                onClick={()=>setSessionView(s.key)}>
                {s.label}
              </button>
            ))}
          </div>
          {(() => {
            const sessionMembers = getSessionMembers(sessionView, participants, activeMembers);
            return(
              <>
                <div style={{fontSize:13,color:"var(--gray-500)",marginBottom:10}}>
                  {sessions.find(s=>s.key===sessionView)?.label} 참가 예정 <strong>{sessionMembers.length}명</strong>
                </div>
                {sessionMembers.map(m=>{
                  const p = participants.find(pp=>pp.member_id===m.id);
                  const isNew = p?.status===sessionView;
                  return(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:isNew?"#ECFDF5":"var(--gray-50)",borderRadius:"var(--radius)",marginBottom:6,borderLeft:isNew?"3px solid #10B981":"3px solid transparent"}}>
                      <div className={`member-avatar ${m.gender}`} style={{width:30,height:30,fontSize:12}}>{m.name.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <span style={{fontSize:13,fontWeight:600}}>{m.name}</span>
                        {isNew&&<span style={{fontSize:10,color:"#10B981",marginLeft:6,fontWeight:600}}>★ 이 세션 합류</span>}
                      </div>
                      <span style={{fontSize:11,background:EVENT_STATUS[p?.status]?.bg,color:EVENT_STATUS[p?.status]?.color,borderRadius:20,padding:"1px 7px",fontWeight:600}}>
                        {EVENT_STATUS[p?.status]?.short}
                      </span>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      )}

      {/* 샘별 탭 */}
      {tab==="sam"&&(
        <SamStatusView
          sams={sams}
          activeMembers={activeMembers}
          participants={participants}
        />
      )}

      {/* 게스트 추가 모달 */}
      {showGuestForm&&(
        <GuestFormModal
          eventId={event.id}
          userEmail={userEmail}
          onSave={async(d)=>{await supabase.from("event_guests").insert([d]);await onRefresh();setShowGuestForm(false);}}
          onClose={()=>setShowGuestForm(false)}
        />
      )}
    </div>
  );
}

// ==================== 행사 샘별 현황 ====================
function SamStatusView({sams, activeMembers, participants}){
  const [selectedSam, setSelectedSam] = useState(null);

  useEffect(()=>{
    if(sams.length>0 && !selectedSam) setSelectedSam(sams[0].id);
  },[sams.length]);

  const samMembers = activeMembers.filter(m=>m.sam_id===selectedSam);

  return(
    <div>
      {/* 샘 가로 탭 */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
        {sams.map(s=>{
          const ms = activeMembers.filter(m=>m.sam_id===s.id);
          const going = ms.filter(m=>{const p=participants.find(pp=>pp.member_id===m.id);return p&&p.status!=="absent"&&p.status!=="unknown";}).length;
          return(
            <button key={s.id}
              className={`btn btn-sm ${selectedSam===s.id?"btn-primary":"btn-secondary"}`}
              style={{whiteSpace:"nowrap",padding:"6px 14px",flexShrink:0}}
              onClick={()=>setSelectedSam(s.id)}>
              {s.name}샘
              <span style={{
                marginLeft:5,fontSize:10,
                background:selectedSam===s.id?"rgba(255,255,255,0.3)":"var(--gray-200)",
                color:selectedSam===s.id?"white":"var(--gray-500)",
                borderRadius:20,padding:"1px 6px",
              }}>{going}/{ms.length}</span>
            </button>
          );
        })}
      </div>

      {/* 선택된 샘 요약 */}
      {selectedSam&&(()=>{
        const ms = activeMembers.filter(m=>m.sam_id===selectedSam);
        const going = ms.filter(m=>{const p=participants.find(pp=>pp.member_id===m.id);return p&&p.status!=="absent"&&p.status!=="unknown";}).length;
        const absent = ms.filter(m=>{const p=participants.find(pp=>pp.member_id===m.id);return p?.status==="absent";}).length;
        const unknown = ms.filter(m=>{const p=participants.find(pp=>pp.member_id===m.id);return !p||p.status==="unknown";}).length;
        return(
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <div style={{flex:1,background:"#ECFDF5",borderRadius:"var(--radius)",padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:"#10B981"}}>{going}</div>
              <div style={{fontSize:11,color:"#10B981"}}>참가</div>
            </div>
            <div style={{flex:1,background:"#FEF2F2",borderRadius:"var(--radius)",padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:"#EF4444"}}>{absent}</div>
              <div style={{fontSize:11,color:"#EF4444"}}>불참</div>
            </div>
            <div style={{flex:1,background:"var(--gray-100)",borderRadius:"var(--radius)",padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:"var(--gray-500)"}}>{unknown}</div>
              <div style={{fontSize:11,color:"var(--gray-500)"}}>미정</div>
            </div>
          </div>
        );
      })()}

      {/* 인원 목록 */}
      {samMembers.map(m=>{
        const p=participants.find(pp=>pp.member_id===m.id);
        const status=p?.status||"unknown";
        return(
          <div key={m.id} style={{
            display:"flex",justifyContent:"space-between",alignItems:"center",
            padding:"9px 12px",background:"var(--gray-50)",borderRadius:"var(--radius)",
            marginBottom:6,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className={`member-avatar ${m.gender}`} style={{width:28,height:28,fontSize:11}}>{m.name.charAt(0)}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{m.name}</div>
                {p?.memo&&<div style={{fontSize:11,color:"var(--gray-400)"}}>{p.memo}</div>}
              </div>
            </div>
            <span style={{fontSize:11,background:EVENT_STATUS[status]?.bg,color:EVENT_STATUS[status]?.color,borderRadius:20,padding:"2px 8px",fontWeight:600,flexShrink:0}}>
              {EVENT_STATUS[status]?.short||"미정"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ==================== 행사 샘별 참가 체크 ====================
function CheckBySam({sams,activeMembers,participants,userEmail,canCheckAll,userId,updateParticipant}){
  const [selectedSam,setSelectedSam]=useState(null);

  // 접근 가능한 샘 목록 — 모든 관리자는 전체 샘 접근 가능
  const accessibleSams = sams;

  // 초기 선택 샘
  useEffect(()=>{
    if(accessibleSams.length>0 && !selectedSam){
      setSelectedSam(accessibleSams[0].id);
    }
  },[accessibleSams.length]);

  const samMembers = activeMembers.filter(m=>m.sam_id===selectedSam);
  const canCheck = canCheckAll || accessibleSams.some(s=>s.id===selectedSam);

  return(
    <div>
      <div style={{fontSize:12,color:"var(--gray-400)",marginBottom:8}}>
        {canCheckAll?"전체 청년 참가 여부를 체크하세요":"본인 샘 청년만 체크할 수 있습니다"}
      </div>

      {/* 샘 가로 탭 */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
        {accessibleSams.map(s=>{
          const samMs = activeMembers.filter(m=>m.sam_id===s.id);
          const checked = samMs.filter(m=>{
            const p=participants.find(p=>p.member_id===m.id);
            return p&&p.status!=="unknown";
          }).length;
          return(
            <button key={s.id}
              className={`btn btn-sm ${selectedSam===s.id?"btn-primary":"btn-secondary"}`}
              style={{whiteSpace:"nowrap",padding:"6px 14px",flexShrink:0}}
              onClick={()=>setSelectedSam(s.id)}>
              {s.name}샘
              <span style={{
                marginLeft:5,fontSize:10,
                background:selectedSam===s.id?"rgba(255,255,255,0.3)":"var(--gray-200)",
                color:selectedSam===s.id?"white":"var(--gray-500)",
                borderRadius:20,padding:"1px 6px",
              }}>{checked}/{samMs.length}</span>
            </button>
          );
        })}
      </div>

      {/* 선택된 샘 인원 목록 */}
      {samMembers.length===0?(
        <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-text">샘을 선택해주세요</div></div>
      ):(
        samMembers.map(m=>{
          const p=participants.find(pp=>pp.member_id===m.id);
          const status=p?.status||"unknown";
          return(
            <div key={m.id} style={{marginBottom:10,background:"var(--gray-50)",borderRadius:"var(--radius)",padding:"10px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div className={`member-avatar ${m.gender}`} style={{width:30,height:30,fontSize:12}}>{m.name.charAt(0)}</div>
                <span style={{fontSize:14,fontWeight:600,flex:1}}>{m.name}</span>
                <span style={{fontSize:11,background:EVENT_STATUS[status]?.bg,color:EVENT_STATUS[status]?.color,borderRadius:20,padding:"2px 8px",fontWeight:600}}>
                  {EVENT_STATUS[status]?.short||"미정"}
                </span>
              </div>
              {canCheck&&(
                <>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                    {Object.entries(EVENT_STATUS).map(([k,v])=>(
                      <button key={k}
                        style={{fontSize:11,padding:"4px 8px",borderRadius:20,
                          border:`1px solid ${status===k?v.color:"var(--gray-200)"}`,
                          background:status===k?v.bg:"white",
                          color:status===k?v.color:"var(--gray-500)",
                          cursor:"pointer",fontFamily:"'Noto Sans KR',sans-serif",
                          fontWeight:status===k?600:400}}
                        onClick={()=>updateParticipant(m.id,k,p?.memo)}>
                        {v.short}
                      </button>
                    ))}
                  </div>
                  <input
                    style={{width:"100%",fontSize:12,padding:"5px 8px",
                      border:"1px solid var(--gray-200)",borderRadius:6,
                      fontFamily:"'Noto Sans KR',sans-serif",background:"white"}}
                    placeholder="메모 (예: 토요일 11시 출발)"
                    defaultValue={p?.memo||""}
                    onBlur={e=>e.target.value!==(p?.memo||"")&&updateParticipant(m.id,status,e.target.value)}
                  />
                </>
              )}
              {!canCheck&&p?.memo&&<div style={{fontSize:11,color:"var(--gray-400)",marginTop:4}}>{p.memo}</div>}
            </div>
          );
        })
      )}
    </div>
  );
}

// ==================== 행사 등록/수정 폼 ====================
function EventFormModal({initial,userEmail,onSave,onClose}){
  const [title,setTitle]=useState(initial?.title||"");
  const [eventDate,setEventDate]=useState(initial?.event_date||today());
  const [endDate,setEndDate]=useState(initial?.end_date||"");
  const [description,setDescription]=useState(initial?.description||"");
  const [saving,setSaving]=useState(false);
  const submit=async()=>{
    if(!title.trim()){alert("행사명을 입력해주세요");return;}
    setSaving(true);
    await onSave({title:title.trim(),event_date:eventDate,end_date:endDate||null,description:description.trim(),author_email:userEmail});
    setSaving(false);
  };
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        {/* 헤더 — 취소 + 제목 + 등록하기 버튼 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexShrink:0}}>
          <button style={{background:"none",border:"none",fontSize:14,color:"var(--gray-400)",cursor:"pointer",padding:"4px 0",fontFamily:"'Noto Sans KR',sans-serif"}} onClick={onClose}>취소</button>
          <div style={{fontSize:16,fontWeight:700,color:"var(--gray-900)"}}>{initial?"행사 수정":"행사 등록"}</div>
          <button style={{background:"var(--primary)",border:"none",borderRadius:20,fontSize:14,color:"white",cursor:"pointer",padding:"6px 16px",fontFamily:"'Noto Sans KR',sans-serif",fontWeight:600,opacity:saving?0.7:1}} onClick={submit} disabled={saving}>
            {saving?"저장 중...":initial?"완료":"등록"}
          </button>
        </div>
        {/* 입력 폼 */}
        <div className="form-group">
          <label className="form-label">행사명 *</label>
          <input className="form-input" placeholder="예) 2025 여름 수련회" value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">시작일 *</label>
            <input className="form-input" type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">종료일 <span className="optional">(선택)</span></label>
            <input className="form-input" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}/>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">행사 설명 <span className="optional">(선택)</span></label>
          <textarea className="form-input" placeholder="행사에 대한 간단한 설명" value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{resize:"none"}}/>
        </div>
      </div>
    </div>
  );
}

// ==================== 게스트 그룹 추가 폼 ====================
function GuestFormModal({eventId,userEmail,onSave,onClose}){
  const [groupName,setGroupName]=useState("");
  const [count,setCount]=useState(1);
  const [memo,setMemo]=useState("");
  const [saving,setSaving]=useState(false);
  const submit=async()=>{
    if(!groupName.trim()){alert("그룹명을 입력해주세요");return;}
    if(count<1){alert("인원수를 입력해주세요");return;}
    setSaving(true);
    await onSave({event_id:eventId,group_name:groupName.trim(),count:Number(count),memo:memo.trim()});
    setSaving(false);
  };
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexShrink:0}}>
          <button style={{background:"none",border:"none",fontSize:14,color:"var(--gray-400)",cursor:"pointer",padding:"4px 0",fontFamily:"'Noto Sans KR',sans-serif"}} onClick={onClose}>취소</button>
          <div style={{fontSize:16,fontWeight:700,color:"var(--gray-900)"}}>게스트 추가</div>
          <button style={{background:"var(--primary)",border:"none",borderRadius:20,fontSize:14,color:"white",cursor:"pointer",padding:"6px 16px",fontFamily:"'Noto Sans KR',sans-serif",fontWeight:600,opacity:saving?0.7:1}} onClick={submit} disabled={saving}>
            {saving?"저장 중...":"추가"}
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">그룹명 *</label>
          <input className="form-input" placeholder="예) 지도자, 외부 찬양팀" value={groupName} onChange={e=>setGroupName(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">인원수 *</label>
          <input className="form-input" type="number" min="1" value={count} onChange={e=>setCount(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">비고 <span className="optional">(선택)</span></label>
          <input className="form-input" placeholder="예) 목사님, 부장님 / 둘째날 저녁만" value={memo} onChange={e=>setMemo(e.target.value)}/>
        </div>
      </div>
    </div>
  );
}
