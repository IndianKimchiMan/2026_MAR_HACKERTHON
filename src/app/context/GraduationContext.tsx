/**
 * GraduationContext
 * 졸업사정 데이터를 전역 상태로 관리하고 HY-Planner 챗봇에 노출
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GraduationData {
  // 전공
  totalCredits: { allocated: number; earned: number };
  major100: { allocated: number; earned: number };
  major200300: { allocated: number; earned: number };
  major400: { allocated: number; earned: number };
  // 교양
  coreLiberal: { allocated: number; earned: number };
  classicsReading: { allocated: number; earned: number };
  software: { allocated: number; earned: number };
  futureIndustry: { allocated: number; earned: number };
  scienceTech: { allocated: number; earned: number };
  humanitiesArts: { allocated: number; earned: number };
  societyWorld: { allocated: number; earned: number };
}

const DEFAULT_DATA: GraduationData = {
  totalCredits:   { allocated: 130, earned: 0 },
  major100:       { allocated: 9,   earned: 0 },
  major200300:    { allocated: 45,  earned: 0 },
  major400:       { allocated: 18,  earned: 0 },
  coreLiberal:    { allocated: 15,  earned: 0 },
  classicsReading:{ allocated: 3,   earned: 0 },
  software:       { allocated: 4,   earned: 0 },
  futureIndustry: { allocated: 4,   earned: 0 },
  scienceTech:    { allocated: 4,   earned: 0 },
  humanitiesArts: { allocated: 4,   earned: 0 },
  societyWorld:   { allocated: 4,   earned: 0 },
};

const STORAGE_KEY = 'hy-plan-graduation';

interface GraduationContextValue {
  data: GraduationData;
  setData: (data: GraduationData) => void;
  /** 잔여 학점이 있는 항목 요약 (챗봇용) */
  remainingSummary: string;
}

const GraduationContext = createContext<GraduationContextValue | null>(null);

export function GraduationProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<GraduationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_DATA, ...JSON.parse(saved) } : DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const setData = (next: GraduationData) => {
    setDataState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const remaining = (field: { allocated: number; earned: number }) =>
    Math.max(0, field.allocated - field.earned);

  const remainingSummary = [
    remaining(data.totalCredits) > 0   && `졸업 전체 학점 ${remaining(data.totalCredits)}학점 잔여`,
    remaining(data.major100) > 0        && `전공 100단위 ${remaining(data.major100)}학점 잔여`,
    remaining(data.major200300) > 0     && `전공 200~300단위 ${remaining(data.major200300)}학점 잔여`,
    remaining(data.major400) > 0        && `전공 400단위 ${remaining(data.major400)}학점 잔여`,
    remaining(data.classicsReading) > 0 && `고전읽기 ${remaining(data.classicsReading)}학점 잔여`,
  ]
    .filter(Boolean)
    .join(', ') || '모든 필수 항목 이수 완료';

  return (
    <GraduationContext.Provider value={{ data, setData, remainingSummary }}>
      {children}
    </GraduationContext.Provider>
  );
}

export function useGraduation() {
  const ctx = useContext(GraduationContext);
  if (!ctx) throw new Error('useGraduation must be used within GraduationProvider');
  return ctx;
}
