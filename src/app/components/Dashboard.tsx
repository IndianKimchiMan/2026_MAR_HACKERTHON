import { useState } from 'react';
import { Sidebar } from './Sidebar';
import ChatInterface from './ChatInterface';
import GraduationAudit from './GraduationAudit';
import UserProfile from './UserProfile';
import { UserProfileProvider } from '../context/UserProfileContext';

interface DashboardProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Dashboard({ userName, onLogout }: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState<string>('hy-planner');

  return (
    <UserProfileProvider initialName={userName}>
      <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#f0f8ff', overflow: 'hidden' }}>
        <Sidebar activeMenu={activeMenu} onMenuSelect={setActiveMenu} onLogout={onLogout} />
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
          {activeMenu === 'hy-planner'  && <ChatInterface userName={userName} />}
          {activeMenu === 'graduation'  && <GraduationAudit />}
          {activeMenu === 'profile'     && <UserProfile />}
        </main>
      </div>
    </UserProfileProvider>
  );
}
