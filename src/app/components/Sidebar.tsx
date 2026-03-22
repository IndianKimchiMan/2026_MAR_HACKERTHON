import React from 'react';
import { HYPlanLogo } from './HYPlanLogo';

interface NavMenuItem {
  id: string;
  label: string;
  type: 'internal' | 'external';
  url?: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  activeMenu: string;
  onMenuSelect: (menuId: string) => void;
  onLogout?: () => void;
}

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

const PortalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const FoodIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
    <path d="M12 10h.01" /><path d="M12 14h.01" />
    <path d="M16 10h.01" /><path d="M16 14h.01" />
    <path d="M8 10h.01" /><path d="M8 14h.01" />
  </svg>
);

const GraduationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NAV_MENU_ITEMS: NavMenuItem[] = [
  { id: 'hy-planner',  label: 'HY-Planner',    type: 'internal', icon: <BotIcon /> },
  { id: 'graduation',  label: '졸업사정 조회',  type: 'internal', icon: <GraduationIcon /> },
  { id: 'profile',     label: '개인정보 설정',  type: 'internal', icon: <UserIcon /> },
  { id: 'home',        label: '한양대 홈페이지', type: 'external', url: 'https://www.hanyang.ac.kr/web/www/home', icon: <HomeIcon /> },
  { id: 'portal',      label: '학교포털',      type: 'external', url: 'https://portal.hanyang.ac.kr/sso/lgin.do', icon: <PortalIcon /> },
  { id: 'certificate', label: '증명발급',       type: 'external', url: 'https://academic.hanyang.ac.kr/%EC%A6%9D%EB%AA%85%EB%B0%9C%EA%B8%89%EC%95%88%EB%82%B4', icon: <DocumentIcon /> },
  { id: 'menu',        label: '오늘의 메뉴',   type: 'external', url: 'https://fnb.hanyang.ac.kr/front/fnbmMdMenu', icon: <FoodIcon /> },
  { id: 'schedule',    label: '학사일정',      type: 'external', url: 'https://www.hanyang.ac.kr/-93', icon: <CalendarIcon /> },
  { id: 'facility',    label: '시설대관',      type: 'external', url: 'https://shareit.kr/exhibit/118?cid=HYU', icon: <BuildingIcon /> },
];

export function Sidebar({ activeMenu, onMenuSelect, onLogout }: SidebarProps) {
  const handleItemClick = (item: NavMenuItem) => {
    if (item.type === 'external' && item.url) {
      window.open(item.url, '_blank');
    } else {
      onMenuSelect(item.id);
    }
  };

  return (
    <aside
      className="sidebar-wave"
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100vh',
        borderRight: '1px solid #b8dff0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        boxSizing: 'border-box',
        backgroundSize: '300% 300%',
        animation: 'sidebarWave 9s ease-in-out infinite',
      }}
    >
      {/* 로고 영역 - 1:1 비율 고정 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <HYPlanLogo size={80} />
      </div>

      {/* 구분선 */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: '20px' }} />

      {/* 내비게이션 메뉴 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {NAV_MENU_ITEMS.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              data-active={isActive}
              className={isActive ? 'sidebar-menu-item sidebar-menu-item--active' : 'sidebar-menu-item'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                background: isActive ? '#d3eff5' : 'transparent',
                color: isActive ? '#0e4a84' : '#ffffff',
                fontWeight: isActive ? 600 : 400,
                fontSize: '14px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.type === 'external' && (
                <span
                  data-testid={`external-icon-${item.id}`}
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', opacity: 0.5 }}
                >
                  <ExternalLinkIcon />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '11px 14px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            background: 'transparent',
            color: '#ffffff',
            fontSize: '14px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <LogoutIcon />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}

export { NAV_MENU_ITEMS };
export type { NavMenuItem, SidebarProps };
