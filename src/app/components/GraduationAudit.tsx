/**
 * GraduationAudit 컴포넌트
 * 졸업사정 수동 입력 및 관리 페이지
 */

import { useState } from 'react';
import { useGraduation, GraduationData } from '../context/GraduationContext';

type FieldKey = keyof GraduationData;

interface RowConfig {
  key: FieldKey;
  label: string;
  indent?: boolean;
  readOnly?: boolean;
  note?: string;
}

const MAJOR_ROWS: RowConfig[] = [
  { key: 'totalCredits',  label: '졸업 전체 학점' },
  { key: 'major100',      label: '전공 100단위',    indent: true },
  { key: 'major200300',   label: '전공 200~300단위', indent: true },
  { key: 'major400',      label: '전공 400단위',     indent: true },
];

const LIBERAL_ROWS: RowConfig[] = [
  { key: 'coreLiberal',    label: '핵심교양 합계',   readOnly: true, note: '고전읽기 + 선택 영역 합산' },
  { key: 'classicsReading',label: '고전읽기영역',    indent: true },
];

const ELECTIVE_ROWS: RowConfig[] = [
  { key: 'software',       label: '소프트웨어',       indent: true },
  { key: 'futureIndustry', label: '미래산업과창업',   indent: true },
  { key: 'scienceTech',    label: '과학과기술',       indent: true },
  { key: 'humanitiesArts', label: '인문과예술',       indent: true },
  { key: 'societyWorld',   label: '사회와세계',       indent: true },
];

const ELECTIVE_KEYS: FieldKey[] = ['software', 'futureIndustry', 'scienceTech', 'humanitiesArts', 'societyWorld'];

function remaining(allocated: number, earned: number) {
  return Math.max(0, allocated - earned);
}

export default function GraduationAudit() {
  const { data, setData } = useGraduation();
  const [draft, setDraft] = useState<GraduationData>({ ...data });
  const [saved, setSaved] = useState(false);

  // 선택 5영역 합산 → 핵심교양 합계 자동 계산
  const electiveEarned = ELECTIVE_KEYS.reduce((sum, k) => sum + draft[k].earned, 0);
  const electiveAllocated = draft.coreLiberal.allocated - draft.classicsReading.allocated;
  const coreLiberalEarned = draft.classicsReading.earned + Math.min(electiveEarned, electiveAllocated);

  const getDisplayData = (key: FieldKey) => {
    if (key === 'coreLiberal') {
      return { allocated: draft.coreLiberal.allocated, earned: coreLiberalEarned };
    }
    return draft[key];
  };

  const handleChange = (key: FieldKey, field: 'allocated' | 'earned', raw: string) => {
    const val = Math.max(0, parseInt(raw) || 0);
    setDraft((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    const updated: GraduationData = {
      ...draft,
      coreLiberal: { ...draft.coreLiberal, earned: coreLiberalEarned },
    };
    setData(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setDraft({ ...data });
    setSaved(false);
  };

  const renderRow = (row: RowConfig) => {
    const { allocated, earned } = getDisplayData(row.key);
    const rem = remaining(allocated, earned);
    const isComplete = rem === 0;

    return (
      <tr key={row.key} style={{ borderBottom: '1px solid #e8f0f6' }}>
        <td style={{
          padding: '12px 16px', fontSize: '14px', color: '#1e3a5f',
          paddingLeft: row.indent ? '32px' : '16px',
          fontWeight: row.readOnly ? 600 : 400,
        }}>
          {row.label}
          {row.note && (
            <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>({row.note})</span>
          )}
        </td>

        {/* 배당 */}
        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
          {row.readOnly ? (
            <span style={{ fontSize: '14px', color: '#0e4a84', fontWeight: 600 }}>{allocated}</span>
          ) : (
            <input
              type="number" min={0} value={allocated}
              onChange={(e) => handleChange(row.key, 'allocated', e.target.value)}
              style={inputStyle}
            />
          )}
        </td>

        {/* 취득 */}
        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
          {row.readOnly ? (
            <span style={{ fontSize: '14px', color: '#0e4a84', fontWeight: 600 }}>{earned}</span>
          ) : (
            <input
              type="number" min={0} value={earned}
              onChange={(e) => handleChange(row.key, 'earned', e.target.value)}
              style={inputStyle}
            />
          )}
        </td>

        {/* 잔여 */}
        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '14px', fontWeight: 600,
            color: isComplete ? '#16a34a' : '#dc2626',
          }}>
            {isComplete ? '✓' : rem}
            {!isComplete && <span style={{ fontSize: '12px', fontWeight: 400 }}>학점</span>}
          </span>
        </td>
      </tr>
    );
  };

  // 선택 5영역 합산 행
  const electiveTotal = ELECTIVE_KEYS.reduce((sum, k) => sum + draft[k].earned, 0);
  const electiveAllocDisplay = draft.coreLiberal.allocated - draft.classicsReading.allocated;
  const electiveSatisfied = electiveTotal >= electiveAllocDisplay;

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#ffffff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* 페이지 헤더 */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0e4a84', margin: 0 }}>
            졸업사정 조회
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            졸업 요건 이수 현황을 직접 입력하고 관리하세요. 입력된 데이터는 HY-Planner 추천에 반영됩니다.
          </p>
        </div>

        {/* 전공 섹션 */}
        <Section title="전공 학점">
          <Table>
            {MAJOR_ROWS.map(renderRow)}
          </Table>
        </Section>

        {/* 교양 섹션 */}
        <Section title="교양 학점">
          <Table>
            {LIBERAL_ROWS.map(renderRow)}

            {/* 선택 5영역 소제목 */}
            <tr>
              <td colSpan={4} style={{
                padding: '10px 16px 4px 16px', fontSize: '12px',
                color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em',
                background: '#f8fbff', borderBottom: '1px solid #e8f0f6',
              }}>
                선택 5영역 (아래 중 배당 학점 이상 취득 시 이수 완료)
              </td>
            </tr>

            {ELECTIVE_ROWS.map(renderRow)}

            {/* 선택 영역 총합 행 */}
            <tr style={{ background: '#f0f7ff', borderBottom: '1px solid #d1e5f0' }}>
              <td style={{ padding: '12px 16px 12px 32px', fontSize: '13px', color: '#0e4a84', fontWeight: 600 }}>
                선택 영역 총합
              </td>
              <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#0e4a84', fontWeight: 600 }}>
                {electiveAllocDisplay}
              </td>
              <td style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: '#0e4a84', fontWeight: 600 }}>
                {electiveTotal}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                <span style={{
                  fontSize: '13px', fontWeight: 700,
                  color: electiveSatisfied ? '#16a34a' : '#dc2626',
                }}>
                  {electiveSatisfied ? '✓ 충족' : `${Math.max(0, electiveAllocDisplay - electiveTotal)}학점 부족`}
                </span>
              </td>
            </tr>
          </Table>
        </Section>

        {/* 저장 버튼 */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button onClick={handleReset} style={secondaryBtnStyle}>
            초기화
          </button>
          <button onClick={handleSave} style={{
            ...primaryBtnStyle,
            background: saved ? '#16a34a' : '#0e4a84',
          }}>
            {saved ? '✓ 저장됨' : '저장하기'}
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'right', marginTop: '8px' }}>
          데이터는 브라우저 로컬 스토리지에 저장됩니다.
        </p>
      </div>
    </div>
  );
}

// ── 서브 컴포넌트 ──

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{
        fontSize: '13px', fontWeight: 700, color: '#0e4a84',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: '10px', paddingLeft: '4px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      borderRadius: '12px', border: '1px solid #d1e5f0',
      overflow: 'hidden', boxShadow: '0 2px 8px rgba(14,74,132,0.06)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e8f4fd' }}>
            {['항목', '배당 학점', '취득 학점', '잔여 학점'].map((h) => (
              <th key={h} style={{
                padding: '10px 16px', fontSize: '12px', fontWeight: 700,
                color: '#0e4a84', textAlign: h === '항목' ? 'left' : 'center',
                borderBottom: '1px solid #d1e5f0',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// ── 스타일 상수 ──

const inputStyle: React.CSSProperties = {
  width: '64px', padding: '6px 8px', textAlign: 'center',
  border: '1px solid #d1e5f0', borderRadius: '8px',
  fontSize: '14px', color: '#1e3a5f', background: '#f8fbff',
  outline: 'none',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '10px 24px', borderRadius: '10px', border: 'none',
  color: '#fff', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', transition: 'background 0.2s',
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: '10px 20px', borderRadius: '10px',
  border: '1px solid #d1e5f0', background: '#f8fbff',
  color: '#0e4a84', fontSize: '14px', fontWeight: 500,
  cursor: 'pointer',
};
