import { HYPlanLogo } from "./components/HYPlanLogo";
import { HanyangLogoBackground } from "./components/HanyangLogoBackground";
import { SignUpModal } from "./components/SignUpModal";
import { LoginModal } from "./components/LoginModal";
import Dashboard from "./components/Dashboard";
import { GraduationProvider } from "./context/GraduationContext";
import { useState, useEffect } from "react";
import { getSession, signOut } from "./services/authService";

export default function App() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // 페이지 새로고침 시 세션 복원
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setUserName(session.name);
        setIsLoggedIn(true);
      }
    });
  }, []);

  const openSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const handleLoginSuccess = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleSignUpSuccess = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    setIsSignUpOpen(false);
  };

  if (isLoggedIn) {
    return (
      <GraduationProvider>
        <Dashboard userName={userName} onLogout={async () => { await signOut(); setIsLoggedIn(false); setUserName(''); }} />
      </GraduationProvider>
    );
  }

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="w-full border-b border-gray-100 py-4 px-8">
        <nav className="w-full flex justify-end gap-8">
          <a href="#" className="text-sm" style={{ color: '#0e4a84' }}>홈</a>
          <a href="#" className="text-sm" style={{ color: '#0e4a84' }}>소개</a>
          <a href="#" className="text-sm" style={{ color: '#0e4a84' }}>문의</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="w-full flex">
          {/* Left Sidebar */}
          <aside className="w-[260px] min-w-[260px] border-r border-blue-900 p-8 flex flex-col items-center gap-8 sidebar-wave">
            <div className="mt-4">
              <HYPlanLogo />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button 
                className="w-full py-2.5 px-5 rounded-xl font-medium transition-all hover:opacity-90 bg-white"
                style={{ color: '#0e4a84' }}
                onClick={() => setIsSignUpOpen(true)}
              >
                HY-Plan 회원가입
              </button>

              <button 
                className="w-full py-2.5 px-5 rounded-xl font-medium transition-all bg-white/20 hover:bg-white/30 text-white border border-white/40"
                onClick={() => setIsLoginOpen(true)}
              >
                로그인
              </button>

              <a href="#" className="text-sm text-white/70 text-center hover:text-white transition-colors">
                아이디/비밀번호 찾기
              </a>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="flex-1 relative flex items-start justify-start pt-32 p-16 pl-32">
            <HanyangLogoBackground />
            
            <div className="relative z-10 text-left max-w-3xl">
              <h1 
                className="text-9xl font-bold mb-8 tracking-tight"
                style={{ color: '#0e4a84' }}
              >
                HY-Plan
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed">
                한양대학교 학생들을 위한<br />
                스마트한 시간표 및 일정 관리 플랫폼
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 py-6 px-8">
        <div className="w-full flex justify-between items-center">
          <p className="text-xs text-gray-400">© 2024 HY-Plan. All rights reserved.</p>
          <div className="flex gap-6">            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">이용약관</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">개인정보처리방침</a>
            <a href="#" className="text-xs text-gray-400 hover:text-gray-600">고객지원</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} onSignUpSuccess={handleSignUpSuccess} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSignUpClick={openSignUp} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}