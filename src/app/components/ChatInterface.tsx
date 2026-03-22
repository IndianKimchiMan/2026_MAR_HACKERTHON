/**
 * ChatInterface 컴포넌트 — Gemini-style UI
 * 초기: 중앙 인사말 + 제안 칩 + 입력바
 * 대화 시작 후: 메시지 목록 + 하단 입력바
 */

import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/llmService';
import { useUserProfile } from '../context/UserProfileContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userName?: string;
}

const SUGGESTION_CHIPS = [
  { label: '수강 신청 도움 받기', icon: '📚' },
  { label: '학사일정 확인', icon: '📅' },
  { label: '시간표 만들기', icon: '🕐' },
  { label: '오늘의 학식 메뉴', icon: '🍽️' },
];

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasMessages = messages.length > 0;
  const displayName = userName || '사용자';
  const { profileSummary } = useUserProfile();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const doSend = async (text: string) => {
    if (text.trim() === '') return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);
    try {
      const response = await sendMessage(userMessage.content, profileSummary);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => doSend(inputText);
  const handleChipClick = (label: string) => doSend(label);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── 초기 화면 (대화 없을 때) ──
  if (!hasMessages) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
        {/* 중앙 인사말 + 칩 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#0e4a84', margin: 0, lineHeight: 1.3 }}>
              {displayName}님, 안녕하세요
            </h1>
            <p style={{ fontSize: '24px', color: '#6b7280', marginTop: '8px', fontWeight: 400 }}>
              무엇을 도와드릴까요?
            </p>
          </div>

          {/* 제안 칩 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '560px' }}>
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px', borderRadius: '24px',
                  border: '1px solid #d1e5f0', background: '#f8fbff',
                  color: '#1e3a5f', fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#e8f4fd'; e.currentTarget.style.borderColor = '#0e4a84'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fbff'; e.currentTarget.style.borderColor = '#d1e5f0'; }}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 입력바 */}
        <div style={{ padding: '16px 24px 24px', maxWidth: '680px', width: '100%', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '10px',
            background: '#f0f5fa', borderRadius: '24px', padding: '8px 8px 8px 20px',
            border: '1px solid #d1e5f0',
          }}>
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="HY-Planner에게 물어보기"
              rows={1}
              style={{
                flex: 1, resize: 'none', background: 'transparent', border: 'none',
                padding: '8px 0', color: '#1e293b', fontSize: '15px', outline: 'none',
                lineHeight: 1.5, maxHeight: '120px', overflowY: 'auto',
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || inputText.trim() === ''}
              aria-label="전송"
              style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: inputText.trim() ? '#0e4a84' : '#c5d5e4',
                border: 'none', color: '#fff', cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', transition: 'background 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 대화 모드 ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
      {/* 헤더 */}
      <div style={{
        padding: '14px 24px', borderBottom: '1px solid #e8f0f6',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#0e4a84',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '14px', fontWeight: 700,
        }}>
          HY
        </div>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#0e4a84' }}>HY-Planner</span>
      </div>

      {/* 오류 배너 */}
      {error && (
        <div role="alert" style={{
          padding: '10px 20px', background: '#fef2f2', borderBottom: '1px solid #fecaca',
          color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{
            marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626',
            cursor: 'pointer', fontSize: '16px',
          }} aria-label="오류 닫기">×</button>
        </div>
      )}

      {/* 메시지 목록 */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                display: 'flex', gap: '10px', maxWidth: '85%', alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#0e4a84', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '11px', fontWeight: 700, marginTop: '2px',
                  }}>HY</div>
                )}
                <div style={msg.role === 'user' ? {
                  background: '#0e4a84', color: '#fff', borderRadius: '20px 20px 4px 20px',
                  padding: '12px 18px', fontSize: '14px', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                } : {
                  background: '#f0f5fa', color: '#1e293b', borderRadius: '20px 20px 20px 4px',
                  padding: '12px 18px', fontSize: '14px', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* 로딩 */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: '#0e4a84', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '11px', fontWeight: 700,
              }}>HY</div>
              <div style={{
                background: '#f0f5fa', borderRadius: '20px 20px 20px 4px',
                padding: '14px 18px', display: 'flex', gap: '6px',
              }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#0e4a84',
                    opacity: 0.4, display: 'inline-block',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 하단 입력바 */}
      <div style={{ padding: '12px 24px 20px', maxWidth: '720px', width: '100%', margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          background: '#f0f5fa', borderRadius: '24px', padding: '8px 8px 8px 20px',
          border: '1px solid #d1e5f0',
        }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="HY-Planner에게 물어보기"
            rows={1}
            style={{
              flex: 1, resize: 'none', background: 'transparent', border: 'none',
              padding: '8px 0', color: '#1e293b', fontSize: '15px', outline: 'none',
              lineHeight: 1.5, maxHeight: '120px', overflowY: 'auto',
              opacity: isLoading ? 0.5 : 1,
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || inputText.trim() === ''}
            aria-label="전송"
            style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: isLoading || !inputText.trim() ? '#c5d5e4' : '#0e4a84',
              border: 'none', color: '#fff',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', transition: 'background 0.2s',
            }}
          >
            ➤
          </button>
        </div>
      </div>

      {/* 로딩 애니메이션 keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export type { Message, ChatInterfaceProps };
