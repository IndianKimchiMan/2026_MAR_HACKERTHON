/**
 * UserProfile 컴포넌트
 * 개인정보 설정 페이지 — 프로필 입력 및 관심 교양 태그 관리
 */

import { useState, KeyboardEvent } from 'react';
import { useUserProfile } from '../context/UserProfileContext';

const GRADE_OPTIONS = ['1', '2', '3', '4', '5', '6'];

export default function UserProfile() {
  const { profile, setProfile } = useUserProfile();

  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [grade, setGrade] = useState(profile.grade);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [tagInput, setTagInput] = useState('');
  const [saved, setSaved] = useState(false);

  // 실시간으로 Context 업데이트
  const syncProfile = (updates: Partial<typeof profile>) => {
    const next = { name, major, grade, interests, ...updates };
    setProfile(next);
  };

  const handleNameChange = (v: string) => { setName(v); syncProfile({ name: v }); };
  const handleMajorChange = (v: string) => { setMajor(v); syncProfile({ major: v }); };
  const handleGradeChange = (v: string) => { setGrade(v); syncProfile({ grade: v }); };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || interests.includes(trimmed)) { setTagInput(''); return; }
    const next = [...interests, trimmed];
    setInterests(next);
    syncProfile({ interests: next });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    const next = interests.filter((t) => t !== tag);
    setInterests(next);
    syncProfile({ interests: next });
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
  };

  const handleSave = () => {
    syncProfile({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#ffffff' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0e4a84', margin: 0 }}>개인정보 설정</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
            입력된 정보는 HY-Planner 과목 추천에 실시간으로 반영됩니다.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 이름 */}
          <Field label="이름">
            <input
              type="text" value={name} onChange={(e) => handleNameChange(e.target.value)}
              placeholder="홍길동"
              style={inputStyle}
            />
          </Field>

          {/* 전공 */}
          <Field label="전공">
            <input
              type="text" value={major} onChange={(e) => handleMajorChange(e.target.value)}
              placeholder="예: 컴퓨터소프트웨어학부"
              style={inputStyle}
            />
          </Field>

          {/* 학년 */}
          <Field label="학년">
            <select value={grade} onChange={(e) => handleGradeChange(e.target.value)} style={inputStyle}>
              <option value="">학년 선택</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}학년</option>
              ))}
            </select>
          </Field>

          {/* 관심 교양 분야 */}
          <Field label="관심 교양 분야">
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text" value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="과목/영역(예: 건강)을 입력해 주세요."
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addTag}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: 'none',
                  background: '#0e4a84', color: '#fff', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                추가
              </button>
            </div>

            {/* 태그 리스트 */}
            {interests.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {interests.map((tag) => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '20px',
                    background: '#e8f4fd', color: '#0e4a84',
                    fontSize: '13px', fontWeight: 500,
                    border: '1px solid #b8dff0',
                  }}>
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      aria-label={`${tag} 삭제`}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#0e4a84', fontSize: '14px', lineHeight: 1,
                        padding: '0', display: 'flex', alignItems: 'center',
                        opacity: 0.6,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {interests.length === 0 && (
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                Enter 또는 추가 버튼으로 키워드를 등록하세요.
              </p>
            )}
          </Field>

        </div>

        {/* 저장 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 28px', borderRadius: '10px', border: 'none',
              background: saved ? '#16a34a' : '#0e4a84',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#f8fbff', borderRadius: '12px',
      border: '1px solid #d1e5f0', padding: '16px 20px',
    }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0e4a84', marginBottom: '10px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1px solid #d1e5f0', background: '#ffffff',
  fontSize: '14px', color: '#1e293b', outline: 'none',
  boxSizing: 'border-box',
};
