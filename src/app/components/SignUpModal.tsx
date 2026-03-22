import { useState } from "react";
import { signUp } from "../services/authService";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpSuccess?: (name: string) => void;
}

export function SignUpModal({ isOpen, onClose, onSignUpSuccess }: SignUpModalProps) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    if (!name.trim()) { setErrorMsg("이름을 입력해주세요."); return; }
    if (!email.includes("@")) { setErrorMsg("올바른 이메일을 입력해주세요."); return; }
    if (password.length < 6) { setErrorMsg("비밀번호는 6자 이상이어야 합니다."); return; }
    if (password !== passwordConfirm) { setErrorMsg("비밀번호가 일치하지 않습니다."); return; }
    setLoading(true);
    const result = await signUp(name.trim(), email.trim(), password);
    setLoading(false);
    if (!result.success) {
      if (result.error?.includes("이메일을 발송")) setInfoMsg(result.error);
      else setErrorMsg(result.error ?? "오류가 발생했습니다.");
      return;
    }
    onSignUpSuccess?.(result.name!);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(14, 74, 132, 0.12)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl p-6"
        style={{ backgroundColor: "#ffffff", boxShadow: "0 8px 32px rgba(14, 74, 132, 0.13)", border: "1px solid #e8f0fa", width: "320px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="mb-5">
          <h2 className="text-xl font-bold mb-0.5" style={{ color: "#0e4a84" }}>회원가입</h2>
          <p className="text-xs text-gray-400">HY-Plan에 오신 것을 환영합니다</p>
        </div>
        {errorMsg && (
          <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
            {infoMsg}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="홍길동" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">학번</label>
            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="2024000000" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="example@hanyang.ac.kr" />
            <p className="text-xs text-gray-300 mt-1">@hanyang.ac.kr 메일만 가입 가능합니다</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="6자 이상" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호 확인</label>
            <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 mt-1 disabled:opacity-50" style={{ backgroundColor: "#0e4a84" }}>
            {loading ? "처리 중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
