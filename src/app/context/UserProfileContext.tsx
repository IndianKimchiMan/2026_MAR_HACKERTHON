/**
 * UserProfileContext
 * 사용자 프로필 전역 상태 — HY-Planner 챗봇에 실시간 반영
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  major: string;
  grade: string;
  interests: string[]; // 관심 교양 키워드 태그
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  major: '',
  grade: '',
  interests: [],
};

const STORAGE_KEY = 'hy-plan-user-profile';

interface UserProfileContextValue {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  /** 챗봇 시스템 프롬프트용 요약 문자열 */
  profileSummary: string;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children, initialName }: { children: ReactNode; initialName?: string }) {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
      // 로그인 시 이름 우선 적용
      if (initialName && !parsed.name) parsed.name = initialName;
      return parsed;
    } catch {
      return { ...DEFAULT_PROFILE, name: initialName ?? '' };
    }
  });

  // initialName이 바뀌면 (로그인 직후) 이름 동기화
  useEffect(() => {
    if (initialName && !profile.name) {
      setProfileState((prev) => ({ ...prev, name: initialName }));
    }
  }, [initialName]);

  const setProfile = (next: UserProfile) => {
    setProfileState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const profileSummary = [
    profile.name    && `이름: ${profile.name}`,
    profile.major   && `전공: ${profile.major}`,
    profile.grade   && `학년: ${profile.grade}학년`,
    profile.interests.length > 0 && `관심 교양 분야: ${profile.interests.join(', ')}`,
  ]
    .filter(Boolean)
    .join(' / ') || '프로필 미입력';

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, profileSummary }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
