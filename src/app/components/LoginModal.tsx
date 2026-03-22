import { useState } from 'react';
import { signIn } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
  onLoginSuccess?: (name: string) => void;
}

export function LoginModal({ isOpen, onClose, onSignUpClick, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) { setErrorMsg('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (!result.success) { setErrorMsg(result.error ?? '로그인에 실패했습니다.'); return; }
    onLoginSuccess?.(result.name!);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(14, 74, 132, 0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl p-6"
        style={{ backgroundColor: '#ffffff', boxShadow: '0 8px 32px rgba(14, 74, 132, 0.13)', border: '1px solid #e8f0fa', width: '320px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold mb-0.5" style={{ color: '#0e4a84' }}>로그인</h2>
          <p className="text-xs text-gray-400">HY-Plan 계정으로 로그인하세요</p>
        </div>

        {errorMsg && (
          <div className="mb-3 px-3 py-2 rounded-lg text-xs" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
            {errorMsg}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="example@hanyang.ac.kr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:outline-none bg-gray-50" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" className="rounded" />
              로그인 상태 유지
            </label>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">비밀번호 찾기</a>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 mt-1 disabled:opacity-50"
            style={{ backgroundColor: '#0e4a84' }}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 border-t border-gray-100"></div>
          <span className="text-xs text-gray-300">또는</span>
          <div className="flex-1 border-t border-gray-100"></div>
        </div>

        <p className="text-center text-xs text-gray-400">
          계정이 없으신가요?{' '}
          <button type="button" onClick={onSignUpClick}
            className="font-medium hover:underline bg-transparent border-none p-0 cursor-pointer"
            style={{ color: '#0e4a84' }}>
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}
